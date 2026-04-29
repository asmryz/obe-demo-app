import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "converter.json");

const toInt = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (String(value).trim().toLowerCase() === "elective") {
    return 0;
  }

  const match = String(value).match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
};

const courses = JSON.parse(await readFile(filePath, "utf8"));

const parsedCourses = courses.map((course) => ({
  ...course,
  code: course.code.trim(),
  title: course.title.trim(),
  semester: toInt(course.semester),
  clo: toInt(course.clo),
  taxonomy: toInt(course.taxonomy),
  plo: toInt(course.plo),
}));

const sqlValue = (value) => {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return `'${String(value).replaceAll("'", "''")}'`;
};

const uniqueCourses = [
  ...new Map(
    parsedCourses.map(({ code, title, semester }) => [
      code,
      { code, title, semester },
    ]),
  ).values(),
];

const values = uniqueCourses
  .map(({ code, title, semester }) => {
    return `  (${sqlValue(code)}, ${sqlValue(title)}, ${sqlValue(semester)})`;
  })
  .join(",\n");

const cloValues = parsedCourses
  .map(({ code, clo, statement, domain, taxonomy, plo }) => {
    return `  (${sqlValue(clo)}, ${sqlValue(statement)}, ${sqlValue(domain)}, ${sqlValue(taxonomy)}, ${sqlValue(plo)}, (SELECT cid FROM public.course WHERE code = ${sqlValue(code)} LIMIT 1))`;
  })
  .join(",\n");

const firstNewCourseId = 80;
const curriculumId = 1;
const curriculumCourseValues = uniqueCourses
  .map((_, index) => {
    return `  (${firstNewCourseId + index}, ${curriculumId})`;
  })
  .join(",\n");

const newCourseCodes = uniqueCourses.map(({ code }) => sqlValue(code)).join(", ");

console.log(`INSERT INTO public.course (code, title, semester)\nVALUES\n${values};`);
console.log("");
console.log(
  `INSERT INTO public.clo (clo, statment, domain, taxonomy, plo, cid)\nVALUES\n${cloValues};`,
);
console.log("");
console.log(
  `INSERT INTO public.curriculum_courses (cid, curid)\nVALUES\n${curriculumCourseValues};`,
);
console.log("");
console.log(`UPDATE public.offered_courses oc
SET ccid = cc.ccid
FROM public.rcourse rc
JOIN public.course c ON c.code = rc.code
JOIN public.curriculum_courses cc ON cc.cid = c.cid
WHERE oc.rid = rc.rid
  AND oc.ccid IS NULL
  AND cc.curid = ${curriculumId}
  AND c.code IN (${newCourseCodes});`);
