import express from 'express';
const router = express.Router();
import { db } from '../db.js';


router.get('/recaps', async (req, res) => {
    try {
        const result = await db.query('SELECT rid, batch, course, faculty, semester, year FROM recaps ORDER BY rid;');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching marks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;
