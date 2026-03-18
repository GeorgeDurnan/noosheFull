require('dotenv').config()
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: process.env.PG_PASSWORD,
  port: 5432,
})
module.exports = pool 