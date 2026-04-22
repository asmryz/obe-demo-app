-- CREATE TABLE offered_courses AS
SELECT cc.ccid, f.fid, r.semester, r.year, r.batch, r.rid 
FROM recaps r 
JOIN rcourse vr ON r.rid = vr.rid
JOIN faculty f ON f.name = r.faculty
LEFT OUTER JOIN course c ON vr.code = trim(c.code) --AND vr.title = c.title
LEFT OUTER JOIN curriculum_courses cc ON c.cid = cc.cid
-- LEFT OUTER JOIN closheet cs ON cs.rid = r.rid
WHERE r.batch NOT LIKE 'MSME%'
AND r.batch NOT LIKE 'BSASAI%'
ORDER BY r.rid;