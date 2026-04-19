
import express from 'express';
const router = express.Router();
import { db } from '../db.js';


router.get('/recaps', async (req, res) => {
    try {
        const search = (req.query.q || '').toString().trim();
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
            ORDER BY r.rid;
        `;
        const result = await db.query(query, [effectiveSearch]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching marks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/recaps/:rid', async (req, res) => {
    try {
        const rid = Number(req.params.rid);

        if (!Number.isInteger(rid)) {
            res.status(400).json({ error: 'Invalid recap id' });
            return;
        }

        const recapQuery = `
            SELECT rid, batch, course, faculty, semester, year, data
            FROM recaps
            WHERE rid = $1;
        `;
        const cloQuery = `
            SELECT cl.*
            FROM rcourse r
            JOIN course c ON r.code = c.code
            JOIN clo cl ON cl.cid = c.cid
            WHERE r.rid = $1;
        `;

        const [recapResult, cloResult] = await Promise.all([
            db.query(recapQuery, [rid]),
            db.query(cloQuery, [rid])
        ]);

        if (recapResult.rows.length === 0) {
            res.status(404).json({ error: 'Recap not found' });
            return;
        }

        res.json({
            ...recapResult.rows[0],
            clo: cloResult.rows
        });
    } catch (err) {
        console.error('Error fetching recap by id:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/closheet/:closid', async (req, res) => {
    try {
        const closid = Number(req.params.closid);

        if (!Number.isInteger(closid)) {
            res.status(400).json({ error: 'Invalid CLO Sheet id' });
            return;
        }

        const closheetQuery = `
            SELECT closid, rid, data
            FROM closheet
            WHERE closid = $1;
        `;

        const closheetResult = await db.query(closheetQuery, [closid]);

        if (closheetResult.rows.length === 0) {
            res.status(404).json({ error: 'CLO Sheet not found' });
            return;
        }

        res.json(closheetResult.rows[0]);
    } catch (err) {
        console.error('Error fetching CLO Sheet by id:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Save CLO Sheet
router.post('/closheet', async (req, res) => {
    try {
        const { rid, multiCLO } = req.body;
        if (!rid || !multiCLO) {
            return res.status(400).json({ error: 'Missing rid or multiCLO' });
        }
        const insertQuery = `
            INSERT INTO closheet (rid, data)
            VALUES ($1, $2::jsonb) RETURNING *;
        `;
        const result = await db.query(insertQuery, [rid, JSON.stringify(multiCLO)]);
        res.json({ success: true, closheet: result.rows[0] });
    } catch (err) {
        console.error('Error saving CLO Sheet:', err);
        res.status(500).json({ error: 'Failed to save CLO Sheet' });
    }
});

export default router;