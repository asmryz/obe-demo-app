import React from 'react'
import PasterIcon from './PasterIcon'
import { use } from 'react'
import { useState } from 'react'
import { api } from '../api/index.js'
import { ToggleButton } from './ToggleButton'

// import { useEffect } from 'react'

const recapResourceCache = new Map()

function getRecapResource(rid) {
    if (!recapResourceCache.has(rid)) {
        const recapPromise = api.get(`/recaps/${rid}`)
            .then(({ data }) => ({ recap: data, error: null }))
            .catch((err) => ({
                recap: null,
                error: err?.response?.data?.error || 'Failed to load recap data.'
            }))

        recapResourceCache.set(rid, recapPromise)
    }

    return recapResourceCache.get(rid)
}

export const CLOApply = ({ rid }) => {
    const { recap, error } = use(getRecapResource(rid))
    const recapRows = Array.isArray(recap?.data) ? recap.data : []
    const cloRows = Array.isArray(recap?.clo) ? recap.clo : []
    // const fourthElements = recapRows.map((row) => (Array.isArray(row) ? row[3] : undefined))
    const [showAllColumns, setShowAllColumns] = useState(false)
    const [heads, setHeads] = useState(
        {}
        // { "Final Paper 1": [["Final Paper 1", 1, "10", 0, 25, 6, 10, 27.5, 36, 31, 27, 19, 17.5, 33, 18, 0, 15, 38], ["Final Paper 1", 2, "10", 0, 8, 1, 5, 6, 10, 10, 7, 3, 2, 5, 7, 0, 2, 10], ["Final Paper 1", 3, "10", 0, 4, 1, 3, 7, 9, 7, 7, 5, 6, 9, 4, 0, 5, 8], ["Final Paper 1", 4, "10", 0, 9, 3, 1, 8, 10, 8, 9, 8, 8, 9, 7, 0, 8, 10]] }
    )
    const [del, setDel] = useState({})

    const [multiCLO, setMultiCLO] = useState(
        () => {
            // Each row should only have its first 3 elements
            let arr = recapRows.map(row => Array.isArray(row) ? row.slice(0, 3) : [row]);
            arr.splice(1, 0, [null, null, null]) // Insert an empty row for CLO selection;
            return arr;
        }

        // [["S.No", "Name", "Reg.No", "Final Paper 1", null, null, null],
        // [null, null, null, 1, 2, 3, 4],
        // [null, null, null, "10", "10", "10", "10"],
        // [1, "Muhammad Huzaifa Ghafoor", "1945116", 0, 0, 0, 0],
        // [2, "Muhammad Azaan Mirza", "2045115", 25, 8, 4, 9],
        // [3, "Sher  Bahadur", "2045154", 6, 1, 1, 3],
        // [4, "Abdul Mueed Shaikh", "2145120", 10, 5, 3, 1],
        // [5, "Hassin  Sikander", "2245102", 27.5, 6, 7, 8],
        // [6, "Hussain  Hasnain", "2245103", 36, 10, 9, 10],
        // [7, "Mohammad Shabbir Tarwari", "2245104", 31, 10, 7, 8],
        // [8, "Ahmad  Foad", "2245110", 27, 7, 7, 9],
        // [9, "Ali Khan Mashori", "2245111", 19, 3, 5, 8],
        // [10, "Jawwad Raza", "2245115", 17.5, 2, 6, 8],
        // [11, "Rayyan Ahmed Thakur", "2245118", 33, 5, 9, 9],
        // [12, "Syed Faaiz Raza Zaidi", "2245120", 18, 7, 4, 7],
        // [13, "Zain Ul Abedien Raza", "2245123", 0, 0, 0, 0],
        // [14, "Um E Abiha", "2245124", 15, 2, 5, 8],
        // [15, "Hunain  Muhammad Iqbal", "2245126", 38, 10, 8, 10]]
    )
    const [selCLO, setSelCLO] = useState(0)


    const [editableIndex, setEditableIndex] = useState(-1)
    const [editColumn, setEditColumn] = useState([])
    const [total, setTotal] = useState(editColumn[2])
    //const [inputValues, setInputValues] = useState([])
    const [clipboardCache, setClipboardCache] = useState([])
    const [clipboardArray, setClipboardArray] = useState([])
    const [clipboardActive, setClipboardActive] = useState(false)
    const clipboardAvailable = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.read === 'function'

    const firstRow = Array.isArray(recapRows[0]) ? recapRows[0] : []
    const firstEmptyCellIndex = firstRow.findIndex((cell) => cell === '')
    const lastThreeColumnsStartIndex = Math.max(firstRow.length - 3, 0)
    const canHideMiddleColumns = firstEmptyCellIndex !== -1 && firstEmptyCellIndex + 1 < lastThreeColumnsStartIndex


    //     useEffect(() => {
    //         setMultiCLO([["S.No","Name","Reg.No","Final Paper 1",null,null,null],[null,null,null,1,2,3,4],[null,null,null,"10","10","10","10"],[1,"Muhammad Huzaifa Ghafoor","1945116",0,0,0,0],[2,"Muhammad Azaan Mirza","2045115",25,8,4,9],[3,"Sher  Bahadur","2045154",6,1,1,3],[4,"Abdul Mueed Shaikh","2145120",10,5,3,1],[5,"Hassin  Sikander","2245102",27.5,6,7,8],[6,"Hussain  Hasnain","2245103",36,10,9,10],[7,"Mohammad Shabbir Tarwari","2245104",31,10,7,8],[8,"Ahmad  Foad","2245110",27,7,7,9],[9,"Ali Khan Mashori","2245111",19,3,5,8],[10,"Jawwad Raza","2245115",17.5,2,6,8],[11,"Rayyan Ahmed Thakur","2245118",33,5,9,9],[12,"Syed Faaiz Raza Zaidi","2245120",18,7,4,7],[13,"Zain Ul Abedien Raza","2245123",0,0,0,0],[14,"Um E Abiha","2245124",15,2,5,8],[15,"Hunain  Muhammad Iqbal","2245126",38,10,8,10]]
    // )
    //     }, []);

    const shouldHideColumn = (columnIndex) => {
        if (showAllColumns || !canHideMiddleColumns) {
            return false
        }

        return columnIndex >= firstEmptyCellIndex && columnIndex < lastThreeColumnsStartIndex
    }

    if (error) {
        return <p>{error}</p>
    }

    const handleEditableHead = (index) => {
        setEditableIndex(index)
        let col = recapRows.map((row) => row[index])
        col.splice(1, 0, null)
        setEditColumn(col)
        setClipboardCache(col.slice(3))
        setTotal(col[2])
        // Only add a new key if it does not exist, preserving all previous keys/values
        setHeads(prev => {
            const key = col[0];
            if (Object.prototype.hasOwnProperty.call(prev, key)) return prev;
            return { ...prev, [key]: [] };
        })
        //console.log(editColumn)
    }

    const readClipboardItems = async (e) => {
        e.preventDefault();
        if (!clipboardAvailable) {
            alert('Clipboard API not available in this environment. Please ensure HTTPS is enabled.');
            return;
        }
        try {
            const items = await navigator.clipboard.read();

            for (const item of items) {
                for (const type of item.types) {
                    const blob = await item.getType(type);
                    //console.log(type, blob);
                    if (type === 'text/plain') {
                        const text = await blob.text();
                        let arr;
                        try {
                            const parsed = JSON.parse(text.trim());
                            arr = Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                            arr = text
                                .split(/\r?\n/)
                                .map(s => s.trim())
                                .filter(Boolean);
                        }
                        arr = arr.map(v => (isNaN(Number(v)) ? v : Number(v)));
                        setClipboardArray(arr);
                        setClipboardCache(arr);
                        setClipboardActive(true);
                    }
                }
            }
        } catch (err) {
            alert(`Failed to read clipboard: ${err.message}`);
        }
    };

    const handleTotalChange = (e) => {
        const value = e.target.value;
        setTotal(value);
    }

    const handleSaveCLO = () => {
        let msg = ``;
        if (Number(selCLO) === 0) {
            msg += `Please select a valid CLO.`;
        }
        if (

            total === "" ||
            total === null ||
            total === undefined ||
            isNaN(Number(total))
        ) {
            if (msg.length > 0) msg += `\n`;
            msg += `Enter a numeric Total before saving.`;
        }
        if (msg.length > 0) {
            alert(msg);
            return;
        }
        if (clipboardCache.length === 0) {
            setClipboardCache(editColumn.slice(3));
        }
        let rowsCopy = [...multiCLO]

        const rows = rowsCopy.map((row, index) => [...row.slice(0, rowsCopy.length),
        index === 0 ? heads[editColumn[0]].length === 0 ? editColumn[0] : null
            : index === 1 ? Number(selCLO)
                : index === 2 ? Number(total)
                    : index > 2 ? clipboardCache[index - 3]
                        : null])
        setMultiCLO(rows)
        // console.log(rows)
        // Assign the last element of rows to heads[editColumn[0]]

        setDel(prev => {
            const key = editColumn[0];
            const prevArr = prev[key] || [];
            // Get the length of the array stored at prev[key] (or 0 if undefined)
            const arrLength = prevArr.length;
            return {
                ...prev,
                [key]: [...prevArr, `${multiCLO[0].length}:${arrLength}`]
            };
        })

        setHeads(prev => {
            // If the key exists, append to its array; otherwise, create a new key with the value

            const key = editColumn[0];
            const prevArr = prev[key] || [];
            return {
                ...prev,
                [key]: [...prevArr, [key, Number(selCLO), total, ...clipboardCache]]
            };
        })
        setClipboardCache([])
        setClipboardActive(false);
        setTotal('')
        setSelCLO(0)
    }

    const handleDelete = (head, index) => () => {
        setHeads(prev => {
            const key = head;
            const prevArr = prev[key] || [];
            const newArr = prevArr.filter((_, i) => i !== index);
            return {
                ...prev,
                [key]: newArr
            };
        })

        const delLoc = del[head][index].split(':').map(Number);
        // Utility: Delete nth index from all arrays in a 2D array
        //console.log(JSON.stringify(multiCLO))

        let cloArr = [...multiCLO]

        if (cloArr[0][delLoc[0] + 1] === null) {
            cloArr = cloArr.map((row, rowIndex) =>
                rowIndex === 0
                    ? row.map((cell, idx) => idx === delLoc[0] + 1 ? head : cell)
                    : row
            );
            //setMultiCLO(cloArr);

            // console.log(delLoc + 1, cloArr)
        }

        cloArr = cloArr.map(row => Array.isArray(row)
            ? row.filter((_, idx) => idx !== delLoc[0])
            : row)

        setMultiCLO(cloArr)

        // Example usage: delete the 2nd index from all rows in multiCLO
        // const newMultiCLO = deleteNthIndexFromAll(multiCLO, 2);
        // setMultiCLO(newMultiCLO);            
    }



    // Utility function to print object properties on separate lines
    function printObject(obj, indent = 0) {
        const pad = ' '.repeat(indent);
        if (obj === null) return pad + 'null';
        if (obj === undefined) return 'undefined';
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            return '[' + obj.map(item => printObject(item, 0)).join(', ') + ']';
        } else if (typeof obj === 'object') {
            const entries = Object.entries(obj);
            if (entries.length === 0) return '{}';
            return (
                '{\n' +
                entries.map(([key, value]) =>
                    pad + '     ' + key + ':' + printObject(value, indent + 2)
                ).join(',\n') +
                '\n' + pad + '}'
            );
        } else {
            return pad + JSON.stringify(obj);
        }
    }

    return (
        <section>
            {/* Hidden input to capture Ctrl+V and onPaste events */}
            <input
                style={{ position: 'absolute', left: '-9999px', width: 0, height: 0, opacity: 0 }}
                tabIndex={-1}
                aria-hidden="true"
                onPaste={readClipboardItems}
                onKeyDown={e => {
                    if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
                        readClipboardItems(e);
                    }
                }}
            />
            <h3>CLOApply {rid}</h3>

            <ToggleButton
                checked={showAllColumns}
                onToggle={() => setShowAllColumns((prev) => !prev)}
                onLabel="All Columns"
                offLabel="Hide Middle"
                scale={0.7}
            />

            {recapRows.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <tbody>
                            {recapRows.map((row, rowIndex) => (
                                <tr key={`row-${rowIndex}`}>
                                    {(Array.isArray(row) ? row : [row])
                                        .map((cell, cellIndex) => ({ cell, cellIndex }))
                                        .filter(({ cellIndex }) => !shouldHideColumn(cellIndex))
                                        .map(({ cell, cellIndex }) => {
                                            const content = cell === null ? '' : typeof cell === 'object' ? JSON.stringify(cell) : cell
                                            return rowIndex === 0 || rowIndex === 1
                                                ? <th key={`cell-${rowIndex}-${cellIndex}`}>
                                                    {cellIndex > 2 && cellIndex < firstEmptyCellIndex
                                                        ? (<a href="#!" onClick={() => handleEditableHead(cellIndex)}>{content}</a>)
                                                        : content}
                                                </th>
                                                : <td key={`cell-${rowIndex}-${cellIndex}`}>{content}</td>
                                        })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editableIndex !== -1 && (
                        <>
                            <pre style={{ marginTop: '12px' }}>{JSON.stringify(recapRows.map((row) => row[editableIndex]))}</pre>
                            <pre style={{ marginTop: '12px' }}>
                                {printObject({ total, editColumn, clipboardArray, clipboardCache, selCLO, heads })}
                                {/* {JSON.stringify({ total, editColumn, clipboardArray, clipboardCache, selCLO, heads })} */}
                            </pre>

                        </>
                    )}

                </div>
            ) : (
                <p>No recap table data available.</p>
            )}
            {editableIndex !== -1 && (
                <>
                    <a
                        href="#!"
                        onClick={readClipboardItems}
                        style={{
                            opacity: clipboardAvailable ? 1 : 0.5,
                            cursor: clipboardAvailable ? 'pointer' : 'not-allowed',
                            textDecoration: 'none'
                        }}
                        title={clipboardAvailable ? 'Paste from clipboard' : 'Clipboard API not available'}
                    >
                        Paste
                    </a>
                    {clipboardArray.length > 0 && (
                        <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(clipboardArray)}</pre>
                    )}

                    <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'pre' }}>
                        <div>
                            <table style={{ marginTop: '12px' }} onPaste={readClipboardItems}>
                                <tbody>
                                    <tr style={{ border: '1px solid white' }}>
                                        <td colSpan={multiCLO.length - 1} style={{ textAlign: 'right', border: 'none' }}>

                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100.016"><path fill="#23475F" d="M88.555 0H83v.016a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V0H4a4 4 0 0 0-4 4v92.016a4 4 0 0 0 4 4h92a4 4 0 0 0 4-4V11.525C100.049 11.436 88.564.071 88.555 0z"/><path fill="#1C3C50" d="M81.04 53.016H18.96a2 2 0 0 0-2 2v45h66.08v-45c0-1.106-.895-2-2-2zm-61.957-10h61.834a2 2 0 0 0 2-2V.555A1.993 1.993 0 0 1 81 2.015H19c-.916 0-1.681-.62-1.917-1.46v40.46a2 2 0 0 0 2 2.001z"/><path fill="#EBF0F1" d="M22 55.985h56a2 2 0 0 1 2 2v37.031a2 2 0 0 1-2 2H22c-1.104 0-2-.396-2-1.5V57.985a2 2 0 0 1 2-2z"/><path fill="#BCC4C8" d="M25 77.016h50v1H25v-1zm0 10h50v1H25v-1z"/><path fill="#1C3C50" d="M7 84.016h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm83 0h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"/><path fill="#BCC4C8" d="M37 1.989v36.026a2 2 0 0 0 2 2h39a2 2 0 0 0 2-2V1.989c0 .007-42.982.007-43 0zm37 29.027a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V10.989a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v20.027z"/><path fill="#FF9D00" d="M78 55.985H22a2 2 0 0 0-2 2v10.031h60V57.985a2 2 0 0 0-2-2z"/></svg> */}
                                            <a href="#!" onClick={handleSaveCLO} >
                                                <svg className="w-[31px] h-[31px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" d="M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z" />
                                                </svg>
                                            </a>
                                            {/* {editColumn.length} */}
                                        </td>
                                    </tr>
                                    {multiCLO.map((erow, rowIndex) => {
                                        let cells;

                                        if (erow.length > 3) {
                                            // Insert editColumn[rowIndex] at index 3, then merge rowIndex-th subelement of all heads[editColumn[0]]
                                            const merged = [
                                                ...erow.slice(0, 3),
                                                editColumn[rowIndex]
                                            ];
                                            const headArr = Array.isArray(heads[editColumn[0]]) ? heads[editColumn[0]] : [];
                                            // For each element in heads[editColumn[0]], take the rowIndex-th subelement (if exists)
                                            const combined = headArr.map(arr => Array.isArray(arr) && arr.length > rowIndex ? arr[rowIndex] : undefined).filter(v => v !== undefined);
                                            cells = [...merged, ...combined];
                                        } else {
                                            cells = [...erow, editColumn[rowIndex]];
                                        }
                                        return (
                                            <tr key={`row-${rowIndex}`}>
                                                {cells.map((cell, cellIndex) => {
                                                    const cellContent = cell === null ? '' : typeof cell === 'object' ? JSON.stringify(cell) : cell;
                                                    return <td key={`cell-${rowIndex}-${cellIndex}`} style={{
                                                        color: cellIndex === 3 ? 'maroon' : 'inherit',
                                                        fontWeight: cellIndex === 3 ? 'bold' : 'normal',
                                                        width: cellIndex === 3 ? '45px' : 'auto',
                                                        position: (rowIndex === 1 && cellIndex > 3) || cellIndex === 3 ? 'relative' : undefined
                                                    }}>
                                                        {/* {cellIndex === 3 && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                lineHeight: 1,
                                                            }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                                    <circle cx="12" cy="12" r="10" fill="#28e23d" opacity=".15" />
                                                                    <path d="M8.5 12.5l2 2 5-5" stroke="#058614" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                                </svg>
                                                            </div>
                                                        )} */}
                                                        {rowIndex === 1 && cellIndex === 1 ? 'CLO' : cellContent}
                                                        {rowIndex === 1 && cellIndex > 3 ? (
                                                            <a href='#!' style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                // padding: '-2px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold',
                                                                // fontSize: '16px',
                                                                lineHeight: 1,
                                                            }} onClick={handleDelete(editColumn[0], cellIndex - 4)}>

                                                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.75732 7.75745L16.2426 16.2427" stroke="red" strokeWidth={1.6} strokeLinecap="round" className="my-path" />
                                                                    <path d="M16.2426 7.75745L7.75732 16.2427" stroke="red" strokeWidth={1.6} strokeLinecap="round" className="my-path" />
                                                                </svg>
                                                            </a>
                                                        ) : cellIndex === 3 ? (
                                                            <span style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#28e23d">
                                                                    <g fill="none" stroke="#217c2b" stroke-width="1.5">
                                                                        <circle cx="12" cy="12" r="10" opacity=".5" />
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.5 12.5l2 2l5-5" />
                                                                    </g>
                                                                </svg>
                                                            </span>
                                                        ) : null}
                                                    </td>
                                                })}
                                                <td style={{ width: '45px' }}>
                                                    {rowIndex === 0
                                                        ? editColumn[rowIndex]
                                                        : rowIndex === 1
                                                            ? (<select value={selCLO} onChange={(e) => setSelCLO(e.target.value)}>
                                                                <option value=""></option>
                                                                {cloRows.map((clo, cloIndex) => (
                                                                    <option key={`clo-option-${cloIndex}`} value={clo.clo}>{`CLO${clo.clo}`}</option>
                                                                ))}
                                                            </select>)
                                                            : rowIndex === 2 ? (<>
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: '20px' }}>
                                                                    <input type="text" value={total} onChange={handleTotalChange} style={{ width: '30px' }} />
                                                                    <a
                                                                        href="#!"
                                                                        onClick={readClipboardItems}
                                                                        style={{
                                                                            opacity: clipboardAvailable ? 1 : 0.5,
                                                                            cursor: clipboardAvailable ? 'pointer' : 'not-allowed',
                                                                            textDecoration: 'none'
                                                                        }}
                                                                        title={clipboardAvailable ? 'Paste from clipboard' : 'Clipboard API not available'}
                                                                    >

                                                                        <PasterIcon width={20} height={20} />
                                                                    </a>

                                                                </span>
                                                            </>)
                                                                // Copy total value to all rows if total is changed, otherwise show original values or clipboard values
                                                                : rowIndex > 2 && Number(total) === editColumn[2]
                                                                    ? editColumn[rowIndex]
                                                                    : rowIndex > 2 && clipboardActive
                                                                        ? clipboardCache.length !== 0
                                                                            ? clipboardCache[rowIndex - 3]
                                                                            : null
                                                                        : null}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
                            {multiCLO.length > 0 && (
                                <table style={{ marginTop: '50px', marginLeft: '20px' }}>
                                    <tbody>
                                        {multiCLO.map((row, i) => (
                                            <tr key={`multi-${i}`}>
                                                {row.map((cell, j) => (
                                                    <td key={`multi-${i}-${j}`}>{cell === null ? '' : typeof cell === 'object' ? JSON.stringify(cell) : cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}
            {/* <pre>{JSON.stringify(multiCLO)}</pre> */}
            {cloRows.length > 0 && (
                <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                    <h4>CLOs</h4>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(cloRows[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cloRows.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                        <td key={j}>{val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

