import React from 'react'
import PasterIcon from './PasterIcon'
import { use } from 'react'
import { useState, useEffect } from 'react'
import { api } from '../api/index.js'
import { useRecapStore } from '../store/recapStore.js'
import { ToggleButton } from './ToggleButton'

// import { useSheetStore } from '../store/sheetStore.js'

// import { useEffect } from 'react'



export const CLOApply = ({ rid, closid }) => {
    const { getRecapResource } = useRecapStore()
    const { recap, error } = use(getRecapResource(rid))
    // const { multiCLOData, headsData, statusData } = useSheetStore((state) => state);
    const recapRows = Array.isArray(recap?.data) ? recap.data : []
    const cloRows = Array.isArray(recap?.clo) ? recap.clo : []

    // const fourthElements = recapRows.map((row) => (Array.isArray(row) ? row[3] : undefined))
    const [showAllColumns, setShowAllColumns] = useState(false)
    const [heads, setHeads] = useState({})
    const [multiCLO, setMultiCLO] = useState(
        () => {
            // Each row should only have its first 3 elements
            let arr = recapRows.map(row => Array.isArray(row) ? row.slice(0, 3) : [row]);
            arr.splice(1, 0, [null, null, null]) // Insert an empty row for CLO selection;
            return arr;
        }
    )
    const [editableIndex, setEditableIndex] = useState(-1)
    const [del, setDel] = useState({})
    const [selCLO, setSelCLO] = useState(0)
    const [status, setStatus] = useState({})
    const [editColumn, setEditColumn] = useState([])
    const [total, setTotal] = useState(editColumn[2])
    const [clipboardCache, setClipboardCache] = useState([])
    const [clipboardArray, setClipboardArray] = useState([])
    const [clipboardActive, setClipboardActive] = useState(false)
    const [save, setSave] = useState(false)
    const clipboardAvailable = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.read === 'function'

    const firstRow = Array.isArray(recapRows[0]) ? recapRows[0] : []
    const firstEmptyCellIndex = firstRow.findIndex((cell) => cell === '')
    const lastThreeColumnsStartIndex = Math.max(firstRow.length - 3, 0)
    const canHideMiddleColumns = firstEmptyCellIndex !== -1 && firstEmptyCellIndex + 1 < lastThreeColumnsStartIndex

    // console.log(` >> ${JSON.stringify(recap)}`)

    // Save CLO Sheet to backend
    const saveCLOSheet = async () => {
        console.log(rid, multiCLO)
        try {
            await api.post('/closheet', {
                rid,
                multiCLO
            });
            alert('CLO Sheet saved successfully!');
        } catch (err) {
            alert('Failed to save CLO Sheet: ' + (err?.response?.data?.error || err.message));
        }
    };



    function checkSaveStatus() {
        if (!Array.isArray(recapRows[0]) || firstEmptyCellIndex === -1) {
            setSave(false);
            return;
        }
        const noOfHeads = recapRows[0].slice(3, firstEmptyCellIndex);
        const shouldSave =
            noOfHeads.length === Object.keys(status).length &&
            Object.values(status).every((v) => v === true);
        setSave(shouldSave);
    }

    // Re-evaluate save status whenever status or recapRows changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        checkSaveStatus();
    }, [status, recapRows, firstEmptyCellIndex]);

    // Returns the sum of all nth elements in heads[key]
    function verify(key, rowIndex) {
        if (!heads[key] || heads[key].length === 0) return false;
        // Get the nth element from each array in heads[key] and sum them
        return heads[key].reduce((sum, arr) => sum + Number(arr[rowIndex]), 0) === editColumn[rowIndex];
    }

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
        if (total === "" || total === null || total === undefined || isNaN(Number(total))) {
            if (msg.length > 0) msg += `\n`;
            msg += `Enter a numeric Total before saving.`;
        }
        if (msg.length > 0) {
            alert(msg);
            return;
        }
        let saveCache = clipboardCache;
        if (clipboardCache.length === 0) {
            // If clipboardCache is empty, save an empty row of the correct length
            saveCache = new Array(editColumn.length - 3).fill('');
        }
        let rowsCopy = [...multiCLO]
        const rows = rowsCopy.map((row, index) => [
            ...row.slice(0, rowsCopy.length),
            index === 0 ? heads[editColumn[0]].length === 0 ? editColumn[0] : null
                : index === 1 ? Number(selCLO)
                    : index === 2 ? Number(total)
                        : index > 2 ? saveCache[index - 3]
                            : null
        ])
        setMultiCLO(rows)
        // console.log(rows)
        // Assign the last element of rows to heads[editColumn[0]]

        const key = editColumn[0];
        setDel(prev => {
            const prevArr = prev[key] || [];
            // Get the length of the array stored at prev[key] (or 0 if undefined)
            const arrLength = prevArr.length;
            return {
                ...prev,
                [key]: [...prevArr, `${multiCLO[0].length}:${arrLength}`]
            };
        })

        setHeads(prev => {
            const prevArr = prev[key] || [];
            const newHeads = {
                ...prev,
                [key]: [...prevArr, [key, Number(selCLO), total, ...clipboardCache]]
            };
            // After updating heads, update status using the new heads value
            if (newHeads[key] && newHeads[key].length > 0) {
                let check = true;
                editColumn.slice(3).forEach((val, idx) => {
                    const sum = newHeads[key].reduce((sum, arr) => sum + Number(arr[idx + 3]), 0);
                    if (sum !== val) {
                        check = false;
                    }
                });
                setStatus(prevStatus => ({ ...prevStatus, [key]: check }));
            }
            return newHeads;
        })
        // setClipboardCache([])
        setClipboardActive(false);
        setTotal('')
        setSelCLO(0)
        checkSaveStatus();
    }

    const handleDelete = (head, index) => () => {
        setHeads(prev => {
            const key = head;
            const prevArr = prev[key] || [];
            const newArr = prevArr.filter((_, i) => i !== index);
            const newHeads = {
                ...prev,
                [key]: newArr
            };
            // After updating heads, update status using the new heads value
            if (newHeads[key]) {
                let check = true;
                // Only check if there are any heads left for this key
                if (newHeads[key].length > 0) {
                    editColumn.slice(3).forEach((val, idx) => {
                        const sum = newHeads[key].reduce((sum, arr) => sum + Number(arr[idx + 3]), 0);
                        if (sum !== val) {
                            check = false;
                        }
                    });
                } else {
                    check = false;
                }
                setStatus(prevStatus => ({ ...prevStatus, [key]: check }));
            }
            return newHeads;
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
                    pad + '     ' + key + ':' + printObject(value, indent + 1)
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
            {closid}
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
                            <span style={{}}>
                                <pre style={{ marginTop: '12px' }}>{JSON.stringify(recapRows.map((row) => row[editableIndex]))}</pre>
                                <pre style={{ marginTop: '12px' }}>
                                    {printObject({ editableIndex, total, editColumn, clipboardArray, clipboardCache, selCLO, heads, status, save })}
                                    {/* {JSON.stringify({ total, editColumn, clipboardArray, clipboardCache, selCLO, heads })} */}
                                </pre>
                            </span>
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
                            textDecoration: 'none', 
                            margin: '16px 12px',
                        }}
                        title={clipboardAvailable ? 'Paste from clipboard' : 'Clipboard API not available'}
                    >
                        Clipboard
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
                                                        {rowIndex === 1 && cellIndex === 1 ? 'CLO' : cellContent}
                                                        {rowIndex === 1 && cellIndex > 3 ? (
                                                            <a href='#!' style={{
                                                                position: 'absolute',
                                                                top: 0, right: 0, cursor: 'pointer',
                                                                fontWeight: 'bold', lineHeight: 1,
                                                            }} onClick={handleDelete(editColumn[0], cellIndex - 4)}>
                                                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.75732 7.75745L16.2426 16.2427" stroke="red" strokeWidth={1.6} strokeLinecap="round" className="my-path" />
                                                                    <path d="M16.2426 7.75745L7.75732 16.2427" stroke="red" strokeWidth={1.6} strokeLinecap="round" className="my-path" />
                                                                </svg>
                                                            </a>
                                                        ) : cellIndex === 3 && rowIndex > 1 && verify(editColumn[0], rowIndex) ? (
                                                            <span style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#28e23d">
                                                                    <g fill="none" stroke="#217c2b" strokeWidth="1.5">
                                                                        <circle cx="12" cy="12" r="10" opacity=".5" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5l2 2l5-5" />
                                                                    </g>
                                                                </svg>
                                                            </span>
                                                        ) : null}
                                                    </td>
                                                })}
                                                {!status[editColumn[0]] && (
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
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
                            {multiCLO.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '50px', border: '1px solid #d3d3d3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {save ? <span style={{ color: 'green', fontWeight: 'bold' }}>All CLOs saved!</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>CLOs not saved</span>}
                                        <button onClick={saveCLOSheet} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Save CLO Sheet">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="#000000"><g fill="none" stroke="#979797" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"><path d="M42.5 11c0 4.418-8.283 8-18.5 8S5.5 15.418 5.5 11M43 24.205C43 28.51 34.493 32 24 32S5 28.51 5 24.205M11.5 24a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1"/><path d="M5.5 11c0-4.418 8.283-8 18.5-8s18.5 3.582 18.5 8c0 0 .5 5 .5 13s-.5 13-.5 13c0 4.418-8.283 8-18.5 8S5.5 41.418 5.5 37c0 0-.5-5-.5-13s.5-13 .5-13"/><path d="M11.5 37a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1M18 25.75a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1m0 14a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1"/></g></svg>
                                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                                <defs>
                                                    <path id="SVGJ5kDdewH" fill="#fff" d="M24 19c10.217 0 18.5-3.582 18.5-8S34.217 3 24 3S5.5 6.582 5.5 11s8.283 8 18.5 8" />
                                                </defs>
                                                <g fill="none" strokeWidth="3">
                                                    <path fill="#8fbffa" d="M5.5 11c0-4.418 8.283-8 18.5-8s18.5 3.582 18.5 8c0 0 .5 5 .5 13s-.5 13-.5 13c0 4.418-8.283 8-18.5 8S5.5 41.418 5.5 37c0 0-.5-5-.5-13s.5-13 .5-13" />
                                                    <use href="#SVGJ5kDdewH" />
                                                    <use href="#SVGJ5kDdewH" />
                                                    <path stroke="#2859c5" strokeLinecap="round" strokeLinejoin="round" d="M42.5 11c0 4.418-8.283 8-18.5 8S5.5 15.418 5.5 11M43 24.205C43 28.51 34.493 32 24 32S5 28.51 5 24.205M11.5 24a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1" />
                                                    <path stroke="#2859c5" strokeLinecap="round" strokeLinejoin="round" d="M5.5 11c0-4.418 8.283-8 18.5-8s18.5 3.582 18.5 8c0 0 .5 5 .5 13s-.5 13-.5 13c0 4.418-8.283 8-18.5 8S5.5 41.418 5.5 37c0 0-.5-5-.5-13s.5-13 .5-13" />
                                                    <path stroke="#2859c5" strokeLinecap="round" strokeLinejoin="round" d="M11.5 37a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1M18 25.75a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1m0 14a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1" />
                                                </g>
                                            </svg>
                                        </button>
                                    </div>
                                    <div>
                                        <table style={{ marginLeft: '20px' }}>
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
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {/* <pre>
                {multiCLO && multiCLO.map((row) => JSON.stringify(row)).join(`,\n`)}
            </pre> */}
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

/*
["S.No","Name","Reg.No","Quiz 1","Quiz 2","Quiz 3","Mid Term Paper 1",null,null,null,"Final Paper 1",null,null,null,"Project 1"]
[null,null,null,1,2,3,1,1,2,2,1,2,3,4,4]
[null,null,null,10,10,10,5,5,5,5,10,10,10,10,10]
[1,"Muhammad Huzaifa Ghafoor","1945116",0,0,0,0,0,0,0,0,0,0,0,0]
[2,"Muhammad Azaan Mirza","2045115",10,9,8,1,2,4,1.5,4,8,4,9,7]
[3,"Sher  Bahadur","2045154",6.5,6,6.5,1,2,3,0,1,1,1,3,5]
[4,"Abdul Mueed Shaikh","2145120",10,9,10,3,2,3,1,1,5,3,1,7]
[5,"Hassin  Sikander","2245102",10,7.5,10,5,4,4,3,6.5,6,7,8,9]
[6,"Hussain  Hasnain","2245103",10,7.5,9,5,4,5,4.5,7,10,9,10,9]
[7,"Mohammad Shabbir Tarwari","2245104",10,8.5,9,4,4,5,4.5,6,10,7,8,9]
[8,"Ahmad  Foad","2245110",10,6,7,3,3,4,1,4,7,7,9,7]
[9,"Ali Khan Mashori","2245111",10,8,9,0,2.5,2,4,3,3,5,8,6]
[10,"Jawwad Raza","2245115",10,8.5,9,2,2.5,0,1,1.5,2,6,8,6]
[11,"Rayyan Ahmed Thakur","2245118",10,10,8,1,4,4,3,10,5,9,9,7]
[12,"Syed Faaiz Raza Zaidi","2245120",10,8.5,7,0,2,3,3,0,7,4,7,6]
[13,"Zain Ul Abedien Raza","2245123",8.5,6,6,5,2,3,2,0,0,0,0,6]
[14,"Um E Abiha","2245124",4.5,7.5,10,4,4,4,0,0,2,5,8,7]
[15,"Hunain  Muhammad Iqbal","2245126",7.5,6,4.5,5,4,4,4,10,10,8,10,7]
*/