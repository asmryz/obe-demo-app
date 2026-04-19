import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: false
});

async function runTest() {
  try {
    // set a short statement timeout to avoid indefinite hangs
    await pool.query("SET statement_timeout = '5000'");

    const search = 'abc';
    const effectiveSearch = search.length >= 3 ? search : '';
    const query = `
      SELECT r.rid, r.batch, r.course, r.faculty, r.semester, r.year, c.code, cs.closid
      FROM recaps r JOIN rcourse vr ON r.rid = vr.rid
      LEFT OUTER JOIN course c ON vr.code = trim(c.code)
      LEFT OUTER JOIN closheet cs ON cs.rid = r.rid
      WHERE r.batch NOT LIKE 'MSME%'
        AND r.batch NOT LIKE 'BSASAI%'
        AND (
            $1 = '' OR
            to_tsvector(
                'simple',
                concat_ws(' ',
                    coalesce(r.course, ''),
                    coalesce(r.faculty, ''),
                    coalesce(r.semester::text, ''),
                    coalesce(r.year::text, '')
                )
            ) @@ plainto_tsquery('simple', $1)
        )
      ORDER BY r.rid
      LIMIT 5;
    `;

    console.log('Running recaps test query with LIMIT 5...');
    const res = await pool.query(query, [effectiveSearch]);
    console.log('Test query returned rows:', res.rows.length);
    if (res.rows.length > 0) console.log('First row sample:', res.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Test query failed or timed out:', err && err.message ? err.message : err);
    try { await pool.end(); } catch(_){}
    process.exit(1);
  }
}

runTest();
