import fs from 'node:fs/promises'
import express from 'express'
import { Transform } from 'node:stream'
import pg from 'pg'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const ABORT_DELAY = 10000

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Parse JSON request bodies
app.use(express.json())

// PostgreSQL connection pool
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if available (Railway auto-provides this)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  // Fall back to individual environment variables
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'plmokn',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'studentdb',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

const pool = new pg.Pool(poolConfig)

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

const db = pool

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// API Routes - must come before catch-all route
app.get("/marks/:roll", async (req,res)=>{
  const {roll} = req.params;
  try{
    const result = await db.query('SELECT * FROM marks WHERE roll = $1', [roll]);
    if(result.rows.length === 0) return res.json({error:"Not Found"});
    res.json(result.rows[0]);
  }catch(e){
    console.error(e);
    res.json({error:"DB Error"});
  }
});

app.post("/marks", async (req,res)=>{
  const {roll,name,math,phy,chem} = req.body;
  try{
    await db.query(
      `INSERT INTO marks (roll, name, math, phy, chem) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (roll) DO UPDATE SET name = $2, math = $3, phy = $4, chem = $5`,
      [roll,name,math,phy,chem]
    );
    res.json({status:"ok"});
  }catch(e){
    console.error(e);
    res.json({error:"DB Error"});
  }
});

// Serve HTML (catch-all, must come last)
app.use(/^\/?.*/, async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.js').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    let didError = false

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500)
        res.set({ 'Content-Type': 'text/html' })
        res.send('<h1>Something went wrong</h1>')
      },
      onShellReady() {
        res.status(didError ? 500 : 200)
        res.set({ 'Content-Type': 'text/html' })

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`)
        let htmlEnded = false

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            // See entry-server.jsx for more details of this code
            if (!htmlEnded) {
              chunk = chunk.toString()
              if (chunk.endsWith('<vite-streaming-end></vite-streaming-end>')) {
                res.write(chunk.slice(0, -41) + htmlEnd, 'utf-8')
              } else {
                res.write(chunk, 'utf-8')
              }
            } else {
              res.write(chunk, encoding)
            }
            callback()
          },
        })

        transformStream.on('finish', () => {
          res.end()
        })

        res.write(htmlStart)

        pipe(transformStream)
      },
      onError(error) {
        didError = true
        console.error(error)
      },
    })

    setTimeout(() => {
      abort()
    }, ABORT_DELAY)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
