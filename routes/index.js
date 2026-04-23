import express from "express";
const router = express.Router();
import { db } from "../db.js";

router.get("/recaps", async (req, res) => {
  try {
    const search = (req.query.q || "").toString().trim();
    const effectiveSearch = search.length >= 3 ? search : "";
      
        const query = `
          SELECT voc.offid, voc.ccid, voc.batch, voc.title, voc."name", voc.semester, voc."year", cs.closid, voc.rid 
          FROM 
            (SELECT oc.offid, oc.ccid, oc.batch, c.title, f."name", oc.semester, oc."year", oc.rid
            FROM offered_courses oc
            LEFT OUTER JOIN curriculum_courses cc on oc.ccid = cc.ccid
            JOIN course c ON c.cid = cc.cid
            JOIN faculty f ON oc.fid = f.fid
            AND oc.ccid IS NOT NULL
            UNION
            SELECT oc.offid, oc.ccid, oc.batch, vr.title, f."name", oc.semester, oc."year", oc.rid
            FROM offered_courses oc
            JOIN faculty f ON f.fid = oc.fid
            JOIN rcourse vr ON oc.rid = vr.rid
            AND oc.ccid IS NULL) voc
          LEFT OUTER JOIN closheet cs ON voc.rid = cs.rid
          WHERE (
              $1 = '' OR
              to_tsvector(
                'simple',
                concat_ws(' ',
                  coalesce(voc.title, ''),
                  coalesce(voc."name", ''),
                  coalesce(voc.semester::text, ''),
                  coalesce(voc."year"::text, '')
                )
              ) @@ plainto_tsquery('simple', $1)
            )
          ORDER BY voc.offid;
        `;
    const result = await db.query(query, [effectiveSearch]);
	
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching marks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/clolist", async (req, res) => {
  const query = `
        SELECT c.cid, c.code, c.title, clo.clo, clo.statment, clo."domain", clo.taxonomy, clo.plo 
        FROM course c
        JOIN clo ON clo.cid = c.cid
        ORDER BY c.code, clo.clo;
    `;
  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching CLO list:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } 
});

router.get("/recaps/:rid", async (req, res) => {
  try {
    const rid = Number(req.params.rid);

    if (!Number.isInteger(rid)) {
      res.status(400).json({ error: "Invalid recap id" });
      return;
    }

    const recapQuery = `
            SELECT rid, batch, course, faculty, semester, year, data
            FROM recaps
            WHERE rid = $1;
        `;
    const cloQuery = `
            SELECT cl.*
            FROM closheet cs
            INNER JOIN offered_courses oc ON oc.offid = cs.offid
            INNER JOIN curriculum_courses cc ON cc.ccid = oc.ccid
            INNER JOIN clo cl ON cl.cid = cc.cid
            WHERE cs.rid = $1
            ORDER BY cl.clo;
        `;

    const [recapResult, cloResult] = await Promise.all([
      db.query(recapQuery, [rid]),
      db.query(cloQuery, [rid]),
    ]);

    if (recapResult.rows.length === 0) {
      res.status(404).json({ error: "Recap not found" });
      return;
    }

    res.json({
      ...recapResult.rows[0],
      clo: cloResult.rows,
    });
  } catch (err) {
    console.error("Error fetching recap by id:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/closheet/:closid", async (req, res) => {
  try {
    const closid = Number(req.params.closid);

    if (!Number.isInteger(closid)) {
      res.status(400).json({ error: "Invalid CLO Sheet id" });
      return;
    }

    const closheetQuery = `
            SELECT closid, rid, data
            FROM closheet
            WHERE closid = $1;
        `;
    const cloQuery = `
            SELECT cl.*
            FROM closheet cs
            INNER JOIN offered_courses oc ON oc.offid = cs.offid
            INNER JOIN curriculum_courses cc ON cc.ccid = oc.ccid
            INNER JOIN clo cl ON cl.cid = cc.cid
            WHERE cs.closid = $1
            ORDER BY cl.clo;
        `;

    const closheetResult = await db.query(closheetQuery, [closid]);
    const cloResult = await db.query(cloQuery, [closid]);

    if (closheetResult.rows.length === 0) {
      res.status(404).json({ error: "CLO Sheet not found" });
      return;
    }

    res.json({
      ...closheetResult.rows[0],
      clo: cloResult.rows,
    });
  } catch (err) {
    console.error("Error fetching CLO Sheet by id:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Save CLO Sheet
router.post("/closheet", async (req, res) => {
  try {
    const { rid, multiCLO } = req.body;
    if (!rid || !multiCLO) {
      return res.status(400).json({ error: "Missing rid or multiCLO" });
    }
    const insertQuery = `
            INSERT INTO closheet (rid, data)
            VALUES ($1, $2::jsonb) RETURNING *;
        `;
    const result = await db.query(insertQuery, [rid, JSON.stringify(multiCLO)]);
    res.json({ success: true, closheet: result.rows[0] });
  } catch (err) {
    console.error("Error saving CLO Sheet:", err);
    res.status(500).json({ error: "Failed to save CLO Sheet" });
  }
});

export default router;
