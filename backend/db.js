const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'PG434039p*',
  port: 5432,
})
module.exports = pool;