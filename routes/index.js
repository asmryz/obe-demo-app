import express from 'express';
const router = express.Router();
import { db } from '../db.js';


router.get('/recaps', async (req, res) => {
    try {
        const search = (req.query.q || '').toString().trim();
        const effectiveSearch = search.length >= 3 ? search : '';
        const query = `
            SELECT rid, batch, course, faculty, semester, year
            FROM recaps
            WHERE (
                $1 = '' OR
                to_tsvector(
                    'simple',
                    concat_ws(' ',
                        coalesce(course, ''),
                        coalesce(faculty, ''),
                        coalesce(semester::text, ''),
                        coalesce(year::text, '')
                    )
                ) @@ plainto_tsquery('simple', $1)
            )
            ORDER BY rid;
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

        const query = `
            SELECT rid, batch, course, faculty, semester, year, data
            FROM recaps
            WHERE rid = $1;
        `;
        const result = await db.query(query, [rid]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Recap not found' });
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching recap by id:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;
