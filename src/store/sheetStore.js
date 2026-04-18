import { create } from 'zustand'


const defaultSheetData = [
    ["S.No", "Name", "Reg.No", "Quiz 1", "Quiz 2", "Quiz 3", "Mid Term Paper 1", null, null, null, "Final Paper 1", null, null, null, "Project 1"],
    [null, null, null, 1, 2, 3, 1, 1, 2, 2, 1, 2, 3, 4, 4],
    [null, null, null, 10, 10, 10, 5, 5, 5, 5, 10, 10, 10, 10, 10],
    [1, "Muhammad Huzaifa Ghafoor", "1945116", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "Muhammad Azaan Mirza", "2045115", 10, 9, 8, 1, 2, 4, 1.5, 4, 8, 4, 9, 7],
    [3, "Sher  Bahadur", "2045154", 6.5, 6, 6.5, 1, 2, 3, 0, 1, 1, 1, 3, 5],
    [4, "Abdul Mueed Shaikh", "2145120", 10, 9, 10, 3, 2, 3, 1, 1, 5, 3, 1, 7],
    [5, "Hassin  Sikander", "2245102", 10, 7.5, 10, 5, 4, 4, 3, 6.5, 6, 7, 8, 9],
    [6, "Hussain  Hasnain", "2245103", 10, 7.5, 9, 5, 4, 5, 4.5, 7, 10, 9, 10, 9],
    [7, "Mohammad Shabbir Tarwari", "2245104", 10, 8.5, 9, 4, 4, 5, 4.5, 6, 10, 7, 8, 9],
    [8, "Ahmad  Foad", "2245110", 10, 6, 7, 3, 3, 4, 1, 4, 7, 7, 9, 7],
    [9, "Ali Khan Mashori", "2245111", 10, 8, 9, 0, 2.5, 2, 4, 3, 3, 5, 8, 6],
    [10, "Jawwad Raza", "2245115", 10, 8.5, 9, 2, 2.5, 0, 1, 1.5, 2, 6, 8, 6],
    [11, "Rayyan Ahmed Thakur", "2245118", 10, 10, 8, 1, 4, 4, 3, 10, 5, 9, 9, 7],
    [12, "Syed Faaiz Raza Zaidi", "2245120", 10, 8.5, 7, 0, 2, 3, 3, 0, 7, 4, 7, 6],
    [13, "Zain Ul Abedien Raza", "2245123", 8.5, 6, 6, 5, 2, 3, 2, 0, 0, 0, 0, 6],
    [14, "Um E Abiha", "2245124", 4.5, 7.5, 10, 4, 4, 4, 0, 0, 2, 5, 8, 7],
    [15, "Hunain  Muhammad Iqbal", "2245126", 7.5, 6, 4.5, 5, 4, 4, 4, 10, 10, 8, 10, 7]


]


function generateHeadsData(multiCLOData) {
    // multiCLOData: 2D array, first row contains head names
    const headsData = {};
    const headNames = multiCLOData[0].slice(3); // skip SNo, Name, Reg.No
    const cloRow = multiCLOData[1].slice(3); // CLO numbers for each head
    const totalRow = multiCLOData[2].slice(3); // Totals for each head
    const studentRows = multiCLOData.slice(3); // Student data rows

    // Map of head to all indices where it appears
    const headIndices = {};
    headNames.forEach((head, i) => {
        if (!head) return;
        if (!headIndices[head]) headIndices[head] = [];
        headIndices[head].push(i);
    });

    Object.entries(headIndices).forEach(([head, indices]) => {
        headsData[head] = indices.map(idx => {
            const clo = cloRow[idx];
            const tot = totalRow[idx];
            const values = studentRows.map(row => row[idx + 3]);
            // Use string for total if it is a string in the data
            return [head, clo, tot, ...values];
        });
    });
    return headsData;
}

// ["Heads", null, null, "Quiz 1", "Quiz 2", "Midterm", null, null, null, "Quiz 3", "CEP", "Final Exam", null, null, null],
// ["CLO", null, null, 1, 2, 1, 1, 2, 2, 3, 4, 1, 2, 3, 4],
// ["Questions", null, null, null, null, "Q1", "Q2", "Q3", "Q4", null, null, "Q1", "Q2", "Q3", "Q4"],
// ["SNo", "Name", "Reg.No", 10, 10, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10],
// [1, "Muhammad Huzaifa Ghafoor", 1945116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// [2, "Muhammad Azaan Mirza", 2045115, 10, 9, 1, 2, 4, 1.5, 8, 7, 4, 8, 4, 9],
// [3, "Sher Bahadur", 2045154, 6.5, 6, 1, 2, 3, 0, 6.5, 5, 1, 1, 1, 3],
// [4, "Abdul Mueed Shaikh", 2145120, 10, 9, 3, 2, 3, 1, 10, 7, 1, 5, 3, 1],
// [5, "Hassin Sikander", 2245102, 10, 7.5, 5, 4, 4, 3, 10, 9, 6.5, 6, 7, 8],
// [6, "Hussain Hasnain", 2245103, 10, 7.5, 5, 4, 5, 4.5, 9, 9, 7, 10, 9, 10],
// [7, "Mohammad Shabbir Tarwari", 2245104, 10, 8.5, 4, 4, 5, 4.5, 9, 9, 6, 10, 7, 8],
// [8, "Ahmad Foad", 2245110, 10, 6, 3, 3, 4, 1, 7, 7, 4, 7, 7, 9],
// [9, "Ali Khan Mashori", 2245111, 10, 8, 0, 2.5, 2, 4, 9, 6, 3, 3, 5, 8],
// [10, "Jawwad Raza", 2245115, 10, 8.5, 2, 2.5, 0, 1, 9, 6, 1.5, 2, 6, 8],
// [11, "Rayyan Ahmed Thakur", 2245118, 10, 10, 1, 4, 4, 3, 8, 7, 10, 5, 9, 9],
// [12, "Syed Faaiz Raza Zaidi", 2245120, 10, 8.5, 0, 2, 3, 3, 7, 6, 0, 7, 4, 7],
// [13, "Zain Ul Abedien Raza", 2245123, 8.5, 6, 5, 2, 3, 2, 6, 6, 0, 0, 0, 0],
// [14, "Um E Abiha", 2245124, 4.5, 7.5, 4, 4, 4, 0, 10, 7, 0, 2, 5, 8],
// [15, "Hunain Muhammad Iqbal", 2245126, 7.5, 6, 5, 4, 4, 4, 4.5, 7, 10, 10, 8, 10]
export const useSheetStore = create((set) => {
    const multiCLOData = defaultSheetData.slice(0, 2).concat(defaultSheetData.slice(2));
    return {
        sheetData: defaultSheetData,
        multiCLOData,
        statusData: () => {
            let status = {};
            defaultSheetData[0].slice(3).filter(x => x !== null)
                .map(e => {
                    if (typeof e === 'string') {
                        const normalized = e.trim().replace(/\s+/g, ' ');
                        status[normalized] = true;
                    } else {
                        status[e] = true;
                    }
                })
            return status;
        },
        headsData: generateHeadsData(multiCLOData),
        setSheetData: (allSheets) => {
            const firstSheetName = Object.keys(allSheets || {})[0]
            const rows = firstSheetName ? allSheets[firstSheetName] : null
            set({ sheetData: rows })
        }
    }
})
