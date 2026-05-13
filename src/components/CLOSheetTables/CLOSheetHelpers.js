export const grades = [
    { "start": 90, "end": 100, "grade": "A+", "gpa": 4 },
    { "start": 85, "end": 89, "grade": "A", "gpa": 3.75 },
    { "start": 80, "end": 84, "grade": "A-", "gpa": 3.5 },
    { "start": 75, "end": 79, "grade": "B+", "gpa": 3.25 },
    { "start": 70, "end": 74, "grade": "B", "gpa": 3 },
    { "start": 66, "end": 69, "grade": "B-", "gpa": 2.75 },
    { "start": 63, "end": 65, "grade": "C+", "gpa": 2.5 },
    { "start": 60, "end": 62, "grade": "C", "gpa": 2 },
    { "start": 55, "end": 59, "grade": "C-", "gpa": 1.5 },
    { "start": 0, "end": 54, "grade": "F", "gpa": 0 }
];

export function groupPlanByFirstWord(planRows) {
    const result = {};
    planRows.forEach(row => {
        if (typeof row.head !== 'string' || !row.head) return;
        const key = row.head.split(' ')[0]; // Split by non-breaking space and take the first part

        const mark = Number(row.total) || 0;
        result[key] = (result[key] || 0) + mark;
    });

    return result;
}

export const ENUMS = Object.freeze({
    HEADS: 0,
    CLO: 1,
    MAX: 2
});

export function getArr(data) {
    return data[ENUMS.CLO].slice(3)
}

export function getClo(arr) {
    return Array.from(new Set(arr.map((x) => {
        const n = Number(x)
        return Number.isNaN(n) ? null : n
    }).filter((x) => x !== null))).sort((a, b) => a - b)
}

export function getHeadsCleaned(data) {
    return data[ENUMS.HEADS].map(h =>
        typeof h === 'string' ? h.replace(/\s*Paper\s*1/g, '') : h
    )
}

export function getPlan(headsCleaned, data) {
    let sno = 1
    let previousHead = ''

    return headsCleaned.slice(3).map((head, index) => {
        const currentHead = headsCleaned[index + 3]
        if (currentHead !== null) {
            previousHead = currentHead
        }
        const chead = previousHead

        return {
            sno: sno++,
            head: chead,
            clo: data[ENUMS.CLO][index + 3] ?? '',
            total: data[ENUMS.MAX][index + 3] ?? ''
        }
    })
}
