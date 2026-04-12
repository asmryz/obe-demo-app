import { writeFile } from "node:fs/promises";
import recaps from "./recaps.json" with { type: "json" };

const escapeSqlLiteral = (value) => String(value).replaceAll("'", "''");

const toValuesTuple = (recap) => {
  const header = recap?.[0]?.[0];
  if (typeof header !== "string") {
    return null;
  }

  const [semester, yearRaw, batch, course, faculty] = header.split("::");
  if (!semester || !yearRaw || !batch || !course || !faculty) {
    return null;
  }

  const year = Number.parseInt(yearRaw, 10);
  if (!Number.isFinite(year)) {
    return null;
  }

  const data = recap.slice(1);
  const dataJson = JSON.stringify(data);

  return `('${escapeSqlLiteral(semester)}', ${year}, '${escapeSqlLiteral(batch)}', '${escapeSqlLiteral(course)}', '${escapeSqlLiteral(faculty)}', '${escapeSqlLiteral(dataJson)}'::jsonb)`;
};

const valuesTuples = recaps
  .map(toValuesTuple)
  .filter(Boolean)
  .join(",\n");

const script = [
  "INSERT INTO recaps (semester, year, batch, course, faculty, data)",
  "VALUES",
  `${valuesTuples};`,
].join("\n");

await writeFile("recaps_inserts.sql", `${script}\n`, "utf8");
console.log(`Generated one bulk SQL insert for ${recaps.length} recaps in recaps_inserts.sql`);

export default recaps;


// CREATE TABLE recaps (
//   rid SERIAL PRIMARY KEY,
//   semester VARCHAR(10) NOT NULL,
//   year INT NOT NULL,
//   batch VARCHAR(50) NOT NULL,
//   course VARCHAR(150) NOT NULL,
//   faculty VARCHAR(100) NOT NULL,
//   data JSONB
// );

// INSERT INTO recaps (semester, year, batch, course, faculty, data)
// VALUES (r[0].split('::')[0], 2024, r[0].split('::')[1], r[0].split('::')[2],  r[0].split('::')[3],
// '[
//   ["BEME 5 - Section A::ME3509-L Microprocessor and Microcontroller Based Systems (0, 1)::Muhammad Nabeel"],
//   ["S.No", "Name", "Reg.No", "Final Paper 1", "Project 1", "manual 1", "", "Final", "Proj", "Mn", "Total Marks", "Total %", "Letter Grade", "GPA"],
//   [null, null, null, 30, 40, 30, null, 30, 40, 30, null, null, null, null],
//   [1, "Manoj Kumar", 1945170, 15, 25, 17, null, 15, 25, 17, 57, 57, "C-", 1.5],
//   [2, "Aashir Azim", 2045101, 10, 35, 21.8, null, 10, 35, 21.8, 66.8, 67, "B-", 2.75]
// ]'
// );