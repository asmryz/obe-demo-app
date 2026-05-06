import express from "express";
const router = express.Router();
import { db } from "../db.js";

// let closheetColumnsReady;

// function ensureClosheetColumns() {
//   if (!closheetColumnsReady) {
//     closheetColumnsReady = (async () => {
//       await db.query(`
//         ALTER TABLE closheet
//         ADD COLUMN IF NOT EXISTS withdraws jsonb NOT NULL DEFAULT '[]'::jsonb;
//       `);
//       await db.query(`
//         ALTER TABLE closheet
//         ADD COLUMN IF NOT EXISTS report jsonb NOT NULL DEFAULT '{}'::jsonb;
//       `);
//       await db.query(`
//         UPDATE closheet
//         SET withdraws = '[]'::jsonb
//         WHERE withdraws IS NULL;
//       `);
//       await db.query(`
//         UPDATE closheet
//         SET report = '{}'::jsonb
//         WHERE report IS NULL;
//       `);
//     })();
//   }

//   return closheetColumnsReady;
// }

router.get("/recaps", async (req, res) => {
  try {
    const search = (req.query.q || "").toString().trim();
    const effectiveSearch = search.length >= 3 ? search : "";
      
        const query = `
          SELECT voc.offid, voc.ccid, voc.batch, voc.title, voc."name", voc.semester, voc."year", cs.closid, voc.rid ,cs.offid csoffid 
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

    // console.log(rid)

    const recapQuery = `
            SELECT rid, batch, course, faculty, semester, year, data
            FROM recaps
            WHERE rid = $1;
        `;
    const cloQuery = `
            SELECT cl.*, p.title, cu.kpi, cu.cohort 
            FROM offered_courses oc
            INNER JOIN curriculum_courses cc ON cc.ccid = oc.ccid
            INNER JOIN clo cl ON cl.cid = cc.cid
            INNER JOIN course c ON c.cid = cl.cid
            INNER JOIN plo p ON p.plo = cl.plo
            INNER JOIN curriculum cu ON cu.curid = p.curid
            WHERE oc.rid = $1
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

    // console.log({
    //     ...recapResult.rows[0],
    //   clo: cloResult.rows,
    // })

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
    // await ensureClosheetColumns();

    const closid = Number(req.params.closid);

    if (!Number.isInteger(closid)) {
      res.status(400).json({ error: "Invalid CLO Sheet id" });
      return;
    }

    const closheetQuery = `
            SELECT closid, rid, offid, data,
                   COALESCE(withdraws, '[]'::jsonb) AS withdraws,
                   COALESCE(report, '{}'::jsonb) AS report
            FROM closheet
            WHERE closid = $1;
        `;
    const closheetResult = await db.query(closheetQuery, [closid]);

    if (closheetResult.rows.length === 0) {
      res.status(404).json({ error: "CLO Sheet not found" });
      return;
    }

    const { rid, offid } = closheetResult.rows[0];
    const cloQuery = `
            SELECT DISTINCT cl.*
            FROM offered_courses oc
            INNER JOIN curriculum_courses cc ON cc.ccid = oc.ccid
            INNER JOIN clo cl ON cl.cid = cc.cid
            WHERE (
              $1::int IS NOT NULL AND oc.offid = $1
            ) OR (
              $1::int IS NULL AND oc.rid = $2
            )
            ORDER BY cl.clo;
        `;
    const cloResult = await db.query(cloQuery, [offid, rid]);

    res.json({
      ...closheetResult.rows[0],
      clo: cloResult.rows,
    });
  } catch (err) {
    console.error("Error fetching CLO Sheet by id:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/closheet/:closid/report", async (req, res) => {
  try {
    // await ensureClosheetColumns();

    const closid = Number(req.params.closid);
    const { report = {} } = req.body;

    if (!Number.isInteger(closid)) {
      res.status(400).json({ error: "Invalid CLO Sheet id" });
      return;
    }

    if (report === null || typeof report !== "object" || Array.isArray(report)) {
      res.status(400).json({ error: "Report must be an object" });
      return;
    }

    const updateQuery = `
      UPDATE closheet
      SET report = $1::jsonb
      WHERE closid = $2
      RETURNING closid, rid, offid, data, withdraws, report;
    `;
    const result = await db.query(updateQuery, [
      JSON.stringify(report),
      closid,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "CLO Sheet not found" });
      return;
    }

    res.json({ success: true, closheet: result.rows[0] });
  } catch (err) {
    console.error("Error updating CLO Sheet report:", err);
    res.status(500).json({ error: "Failed to update CLO Sheet report" });
  }
});

router.get("/closheet/:closid/report", async (req, res) => {
  try {
    // await ensureClosheetColumns();

    const closid = Number(req.params.closid);

    if (!Number.isInteger(closid)) {
      res.status(400).json({ error: "Invalid CLO Sheet id" });
      return;
    }

    const reportQuery = `
      SELECT closid, COALESCE(report, '{}'::jsonb) AS report
      FROM closheet
      WHERE closid = $1;
    `;
    const result = await db.query(reportQuery, [closid]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "CLO Sheet not found" });
      return;
    }

    res.json({
      closid: result.rows[0].closid,
      report: result.rows[0].report,
    });
  } catch (err) {
    console.error("Error fetching CLO Sheet report:", err);
    res.status(500).json({ error: "Failed to load CLO Sheet report" });
  }
});

// Save CLO Sheet
router.post("/closheet", async (req, res) => {
  try {
    // await ensureClosheetColumns();

    const { rid, multiCLO, withdraws = [], cloSid, report = {} } = req.body;
    if (!rid || !multiCLO) {
      return res.status(400).json({ error: "Missing rid or multiCLO" });
    }

    if (cloSid !== null && cloSid !== undefined) {
      const updateQuery = `
            UPDATE closheet
            SET data = $1::jsonb,
                withdraws = $2::jsonb,
                report = $3::jsonb
            WHERE closid = $4
            RETURNING *;
        `;
      const result = await db.query(updateQuery, [
        JSON.stringify(multiCLO),
        JSON.stringify(withdraws),
        JSON.stringify(report),
        cloSid,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "CLO Sheet not found" });
      }

      return res.json({ success: true, closheet: result.rows[0] });
    }

    const insertQuery = `
            INSERT INTO closheet (rid, offid, data, withdraws, report)
            VALUES (
              $1,
              (
                SELECT oc.offid
                FROM offered_courses oc
                WHERE oc.rid = $1
                ORDER BY oc.offid
                LIMIT 1
              ),
              $2::jsonb,
              $3::jsonb, 
              $4::jsonb
            ) RETURNING *;
        `;
    const result = await db.query(insertQuery, [
      rid,
      JSON.stringify(multiCLO),
      JSON.stringify(withdraws),
      JSON.stringify(report),
    ]);
    res.json({ success: true, closheet: result.rows[0] });
  } catch (err) {
    console.error("Error saving CLO Sheet:", err);
    res.status(500).json({ error: "Failed to save CLO Sheet" });
  }
});

export default router;
