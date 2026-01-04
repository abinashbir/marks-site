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

  if (req.method === 'POST') {
    try {
      const { roll, name, math, phy, chem } = req.body

      if (!roll || !name || math === undefined || phy === undefined || chem === undefined) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      await pool.query(
        `INSERT INTO marks (roll, name, math, phy, chem) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (roll) DO UPDATE SET name = $2, math = $3, phy = $4, chem = $5`,
        [roll, name, math, phy, chem]
      )
      res.status(200).json({ status: 'ok' })
    } catch (e) {
      console.error('Database error:', e)
      res.status(500).json({ error: 'Database connection error' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
