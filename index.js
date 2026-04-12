import puppeteer from "puppeteer";
// Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page.
const browser = await puppeteer.launch({
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--start-maximized",
        "--ignore-certificate-errors",
    ],
    headless: false,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
});
const page = await browser.newPage();

const waitForNextPageLoad = async (pageInstance, { timeout = 20000 } = {}) => {
    try {
        await pageInstance.waitForNavigation({
            waitUntil: "networkidle2",
            timeout,
        });
        return;
    } catch (error) {
        if (error?.name !== "TimeoutError") {
            throw error;
        }
    }

    // Some form submits keep the same URL; fall back to document readiness.
    await pageInstance.waitForFunction(() => document.readyState === "complete", {
        timeout,
    });
};

// Navigate the page to a URL.
await page.goto("https://springzabdesk.szabist.edu.pk/", {
    waitUntil: "networkidle2",
});

await page.screenshot({ path: "screenshots/home.png", fullPage: true });

// Set screen size.
await page.setViewport({ width: 1920, height: 1080 });

// // Open the search menu using the keyboard.
// await page.keyboard.press('/');

// Enter username in textBox
await page.locator("#search input[type=text]").fill("drumar");
/*
walikhubaib
0.2700464
*/

// Enter password in textBox.
await page.locator("#search input[type=password]").fill("ktjcjl");

await Promise.all([
    page.locator("#search input[type=submit]").click(),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
]);
await page.screenshot({ path: "screenshots/login.png", fullPage: true });

const coordinatorHref = await page.$$eval("a", (anchors) => {
    const link = anchors.find(
        (a) => a.textContent?.trim().toLowerCase() === "coordinator"
    );
    return link?.href ?? null;
});

if (!coordinatorHref) {
    throw new Error('Anchor with textContent "Coordinator" was not found.');
}

await page.goto(coordinatorHref, { waitUntil: "networkidle2" });
await page.screenshot({ path: "screenshots/coordinator.png", fullPage: true });

const bemeHref = await page.$$eval("a", (anchors) => {
    const link = anchors.find(
        (a) => a.textContent?.trim().toLowerCase() === "beme"
    );
    return link?.href ?? null;
});

if (!bemeHref) {
    throw new Error('Anchor with textContent "BEME" was not found on Coordinator page.');
}

await page.goto(bemeHref, { waitUntil: "networkidle2" });
await page.screenshot({ path: "screenshots/beme.png", fullPage: true });

const prevSemStatusHref = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll("a.leftmenus")).find(
        (a) => a.textContent.includes("Prev. Semester Status")
    );
    return link?.href ?? null;
});

if (!prevSemStatusHref) {
    throw new Error('Anchor with textContent "Prev. Semester Status" was not found on BEME page.');
}

await page.goto(prevSemStatusHref, { waitUntil: "networkidle2" });
await page.screenshot({ path: "screenshots/prev_sem_status.png", fullPage: true });

const semesterSequence = ["Spring", "Summer", "Fall"];
const years = [2022, 2023, 2024, 2025];

const submitSemesterSelection = async (year, semester) => {
    const selectionResult = await page.evaluate(({ year, semester }) => {
        const getSelect = (keys) => {
            const allSelects = Array.from(document.querySelectorAll("select"));
            return (
                allSelects.find((el) => {
                    const id = (el.id || "").toLowerCase();
                    const name = (el.name || "").toLowerCase();
                    return keys.some((key) => id.includes(key) || name.includes(key));
                }) || null
            );
        };

        const setOption = (selectEl, target) => {
            const targetText = String(target).trim().toLowerCase();
            const option = Array.from(selectEl.options).find((opt) => {
                const text = (opt.textContent || "").trim().toLowerCase();
                const value = (opt.value || "").trim().toLowerCase();
                return text === targetText || value === targetText;
            });

            if (!option) {
                return false;
            }

            selectEl.value = option.value;
            selectEl.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        };

        const semYearSelect = getSelect(["semyear", "year"]);
        const semTypeSelect = getSelect(["semtype", "semester", "term"]);

        if (!semYearSelect || !semTypeSelect) {
            return { ok: false, reason: "SemYear or SemType select not found" };
        }

        const yearSet = setOption(semYearSelect, year);
        const semesterSet = setOption(semTypeSelect, semester);

        if (!yearSet || !semesterSet) {
            return {
                ok: false,
                reason: `Could not set options (yearSet=${yearSet}, semesterSet=${semesterSet})`,
            };
        }

        const submitButton =
            semTypeSelect.form?.querySelector('input[type="submit"], button[type="submit"]') ||
            semYearSelect.form?.querySelector('input[type="submit"], button[type="submit"]') ||
            document.querySelector('input[type="submit"], button[type="submit"]');

        if (!submitButton) {
            return { ok: false, reason: "Submit button not found" };
        }

        submitButton.click();
        return { ok: true };
    }, { year, semester });

    if (!selectionResult.ok) {
        throw new Error(`Failed to submit ${year} ${semester}: ${selectionResult.reason}`);
    }
};

const getRecapRows = async () => {
    await page.waitForSelector("#content_table", { timeout: 20000 });

    return page.$$eval("#content_table tr", (rows) => {
        const cleanBatch = (raw) =>
            (raw || "")
                .replace(/\s*PLO\s*Mapping\s*$/i, "")
                .trim();

        const result = [];
        let currentBatch = "";

        rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll("td"));
            if (cells.length === 0) {
                return;
            }

            if (cells.length === 1 && cells[0].getAttribute("colspan") === "9") {
                currentBatch = cleanBatch(cells[0].innerText);
                return;
            }

            if (cells.length !== 9) {
                return;
            }

            const submitButton = cells[6]?.querySelector('[name="cmdViewRecapSheet"]');
            if (!submitButton) {
                return;
            }

            const course = cells[1]?.innerText?.trim() || "";
            const faultyName = cells[2]?.innerText?.trim() || "";

            result.push({
                rowIndex,
                batch: currentBatch,
                course,
                faultyName,
            });
        });

        return result;
    });
};

for (const year of years) {
    for (const semester of semesterSequence) {
        //console.log(`Processing ${year} ${semester}`);

        await page.goto(prevSemStatusHref, { waitUntil: "networkidle2" });
        await submitSemesterSelection(year, semester);
        await waitForNextPageLoad(page, { timeout: 40000 });
        await page.screenshot({
            path: `screenshots/prev_sem_status_${year}_${semester.toLowerCase()}.png`,
            fullPage: true,
        });

        const recapRows = await getRecapRows();
        //console.log(`Found ${recapRows.length} recap rows in content_table for ${year} ${semester}`);

        for (let i = 0; i < recapRows.length; i++) {
            const row = recapRows[i];
    // console.log(
    //     `[${i + 1}/${recapRows.length}] Batch: ${row.batch} | Course: ${row.course} | Faulty Name: ${row.faultyName}`
    // );

    const rowSelector = `#content_table tr:nth-child(${row.rowIndex + 1})`;
    const submitSelector = `${rowSelector} td:nth-child(7) [name="cmdViewRecapSheet"]`;

    await page.waitForSelector(submitSelector, { timeout: 20000 });

    const beforeUrl = page.url();
    await page.click(submitSelector);
    await waitForNextPageLoad(page, { timeout: 20000 });

    let table2HeadSummary = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("#Table2 thead tr"));

        const parseMaxMarks = (lines) => {
            if (!Array.isArray(lines) || lines.length < 2) {
                return null;
            }

            const secondLine = (lines[1] || "").trim();
            if (!/^max\s*:/i.test(secondLine) && !/^max\s*marks\s*:/i.test(secondLine)) {
                return null;
            }

            const parts = secondLine.split(":");
            if (parts.length < 2) {
                return null;
            }

            const rawValue = parts.slice(1).join(":").trim();
            const numericValue = Number(rawValue);
            return Number.isNaN(numericValue) ? rawValue : numericValue;
        };

        const cells = rows.flatMap((row) => Array.from(row.querySelectorAll("th")));
        const heads = [];
        const totals = [];

        cells.forEach((cell) => {
            const fullText = (cell.innerText || "").trim();
            const lines = fullText
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);

            heads.push(lines[0] || "");
            totals.push(parseMaxMarks(lines));
        });

        return [heads, totals];
    });

    // console.log("Table2 thead summary:", table2HeadSummary);

    const [heads, totals] = table2HeadSummary;
    const table2BodyRows = await page.evaluate(
        ({ heads, totals }) => {
            console.log(`Table2 tbody first row cell count: ${document.querySelectorAll("#Table2 tbody tr:nth-child(1) td, #Table2 tbody tr:nth-child(1) th").length}`);
            const normalizeCellValue = (cell) => {
                const raw = (cell?.textContent || "").replace(/\u00a0/g, " ").trim();
                if (raw === "") {
                    return null;
                }

                const numericValue = Number(raw);
                return Number.isNaN(numericValue) ? raw : numericValue;
            };
            const bodyRows = Array.from(document.querySelectorAll("#Table2 tbody tr"));

            return bodyRows.map((row) => {
                const cells = Array.from(row.querySelectorAll("td, th"));
                const width = Array.isArray(heads) ? heads.length : cells.length;

                return Array.from({ length: width }, (_, index) => {
                    const raw = (cells[index]?.textContent || "").replace(/\u00a0/g, " ").trim();
                    return index === 2 ? raw : normalizeCellValue(cells[index]);
                });
            });
        },
        { heads, totals }
    );

    const metaRow = [`${semester}::${year}::${row.batch}::${row.course}::${row.faultyName}`];
    table2HeadSummary = [metaRow, ...table2HeadSummary, ...table2BodyRows];

    const formatValue = (v) => {
        if (v === null) return "null";
        if (typeof v === "string") return JSON.stringify(v); // keeps quotes
        return String(v);
    };
    //console.log(`[`);
    for (let rowIndex = 0; rowIndex < table2HeadSummary.length; rowIndex++) {
        const summaryRow = table2HeadSummary[rowIndex];
        const suffix = rowIndex === table2HeadSummary.length - 1 ? "]," : ",";
        console.log(`${rowIndex === 0 ? "[" : ""}[ ${summaryRow.map(formatValue).join(", ")} ]${suffix}`);
    }
    //console.log(`${JSON.stringify(table2HeadSummary, null, 2)},\n);
    // console.log(`]`);


    await page.screenshot({
        path: `screenshots/${i + 1}_${row.batch}_${row.course.replace(/[^a-z0-9]/gi, "_")}.png`,
        fullPage: true,
    });



    const isStillOnTable = (await page.$("#content_table")) !== null;
    if (!isStillOnTable || page.url() !== beforeUrl) {
        await page.goBack({ waitUntil: "networkidle2" });
        await page.waitForSelector("#content_table", { timeout: 20000 });
    }
}
    }
}







await browser.close();
