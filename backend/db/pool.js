const mariadb = require("mariadb");
const { DB } = require("../utils/config");

const pool = mariadb.createPool(DB);

async function query(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows;
  } finally {
    if (conn) conn.release();
  }
}

async function ping() {
  const rows = await query("SELECT NOW() AS now");
  return rows[0]?.now;
}

module.exports = { pool, query, ping };
