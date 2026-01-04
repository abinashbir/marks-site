import pg from 'pg'

const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'plmokn',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'studentdb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    try {
      const { roll } = req.query
      if (!roll) {
        return res.status(400).json({ error: 'Roll number required' })
      }

      const result = await pool.query('SELECT * FROM marks WHERE roll = $1', [roll])
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not Found' })
      }
      res.status(200).json(result.rows[0])
    } catch (e) {
      console.error('Database error:', e)
      res.status(500).json({ error: 'Database connection error' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
