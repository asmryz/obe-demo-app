import React from 'react'
import PasterIcon from './PasterIcon'
import { use } from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { api } from '../api/index.js'
import { useRecapStore } from '../store/recapStore.js'
import { ToggleButton } from './ToggleButton'
import { useSheetStore } from '../store/sheetStore.js'
import { useNotify } from '../store/notifyStore.js'

// import { useSheetStore } from '../store/sheetStore.js'

// import { useEffect } from 'react'

const recapHeaderLabels = {
    "Letter Grade": "Grade",
    "Mid Term Paper 1": "Mid Term",
    "Final Paper 1": "Final",
}

const formatRecapCell = (cell) => {
    if (cell === null) return ''
    if (typeof cell === 'object') return JSON.stringify(cell)
    if (typeof cell !== 'string') return cell

    const normalizedCell = cell.replace(/\s+/g, ' ').trim()
    return recapHeaderLabels[normalizedCell] ?? cell
}


export const CLOApply = ({ rid, closid = null, edit = false }) => {
    const { getRecapResource, updateRecapClosid } = useRecapStore()
    const notify = useNotify()

    const { getCLOSheet, cloSid, setWithdraws: setStoreWithdraws, setActiveTabIndex, csOffid: storeCsOffid, setCSOffid } = useSheetStore();
    const { recap, error } = use(getRecapResource(rid))

    const activeClosid = closid ?? cloSid;
    // eslint-disable-next-line no-unused-vars
    const { data: cloSheetData, withdraws: cloSheetWithdraws, error: cloError } = edit && activeClosid !== null
        ? use(getCLOSheet(activeClosid))
        : { data: null, withdraws: [], error: null };
    // console.log(recap, cloSheetData)
    // const { multiCLOData, headsData, statusData } = useSheetStore((state) => state);
    const recapRows = Array.isArray(recap?.data) ? recap.data : []
    const cloRows = Array.isArray(recap?.clo) ? recap.clo : []
    const initialMultiCLO = getInitialMultiCLO()
    const firstRow = Array.isArray(recapRows[0]) ? recapRows[0] : []
    const firstEmptyCellIndex = firstRow.findIndex((cell) => cell === '')
    const lastThreeColumnsStartIndex = Math.max(firstRow.length - 3, 0)
    const canHideMiddleColumns = firstEmptyCellIndex !== -1 && firstEmptyCellIndex + 1 < lastThreeColumnsStartIndex
    const initialEditableIndex = edit ? 3 : -1
    const initialEditColumn = initialEditableIndex !== -1 ? getEditColumn(initialEditableIndex) : []
    const initialHeads = edit ? getHeadsFromMultiCLO(initialMultiCLO) : {}
    const initialStatus = edit ? getStatusFromHeads(initialHeads) : {}
    const initialSave = edit && Object.keys(initialStatus).length > 0 && Object.values(initialStatus).every(Boolean)
    const loadedWithdraws = useMemo(
        () => Array.isArray(cloSheetWithdraws) ? cloSheetWithdraws : [],
        [cloSheetWithdraws]
    )
    const loadedWithdrawsKey = useMemo(() => JSON.stringify(loadedWithdraws), [loadedWithdraws])

    // const fourthElements = recapRows.map((row) => (Array.isArray(row) ? row[3] : undefined))
    const [showAllColumns, setShowAllColumns] = useState(false)
    const [heads, setHeads] = useState(initialHeads)
    const [multiCLO, setMultiCLO] = useState(initialMultiCLO)
    const [editableIndex, setEditableIndex] = useState(initialEditableIndex)
    const [del, setDel] = useState({})
    const [selCLO, setSelCLO] = useState(0)
    const [status, setStatus] = useState(initialStatus)
    const [editColumn, setEditColumn] = useState(initialEditColumn)
    const [total, setTotal] = useState(initialEditColumn[2])
    const [clipboardCache, setClipboardCache] = useState(initialEditColumn.slice(3))
    const [clipboardArray, setClipboardArray] = useState([])
    const [clipboardActive, setClipboardActive] = useState(false)
    const [save, setSave] = useState(initialSave)
    const [withdraws, setWithdraws] = useState(loadedWithdraws)
    const syncingWithdrawsRef = useRef(false)
    const syncedWithdrawsKeyRef = useRef(loadedWithdrawsKey)
    const clipboardAvailable = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.read === 'function'
    const [isWide, setIsWide] = useState(() => window.innerWidth > 1000)
    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth > 1000)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // console.log(` >> ${JSON.stringify(recap)}`)


    // if(closid !== null) {
    //     const { data, error: cloError } = use(getCLOSheet(closid))
    //     if (cloError) {
    //         return <p>{cloError}</p>
    //     }
    //     console.log(` >> ${JSON.stringify(data)}`)
    // }

    // Save CLO Sheet to backend
    const saveCLOSheet = async () => {
        if (!edit && storeCsOffid !== null && storeCsOffid !== undefined) {
            notify.warning('CLOSheet has already been added', 'Warning', { position: 'top-center', dismissible: true });
            return;
        }
        
        try {
            await api.post('/closheet', {
                rid,
                multiCLO,
                withdraws,
                cloSid
            }).then(({ data }) => {
                console.log(data)
                const closheetPayload = data?.closheet ?? data;
                if (closheetPayload?.offid != null) {
                    setCSOffid(closheetPayload.offid);
                }
                notify.success('CLO Sheet saved successfully!', 'Success', { position: 'top-center', dismissible: true });
                if (closheetPayload?.closid != null) {
                    updateRecapClosid(rid, closheetPayload.closid);
                    setActiveTabIndex(0)
                }
                // alert('CLO Sheet saved successfully!');
            });
        } catch (err) {
            notify.error('Failed to save CLO Sheet: ' + (err?.response?.data?.error || err.message), 'Error', { position: 'top-center', dismissible: true });
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

    useEffect(() => {
        checkSaveStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, recapRows, firstEmptyCellIndex]);

    useEffect(() => {
        if (edit && Array.isArray(cloSheetData)) {
            setSave(false);
        }
    }, [edit, cloSheetData]);

    useEffect(() => {
        if (!edit) return;
        if (syncedWithdrawsKeyRef.current === loadedWithdrawsKey) {
            return;
        }

        syncingWithdrawsRef.current = true;
        syncedWithdrawsKeyRef.current = loadedWithdrawsKey;
        setWithdraws(loadedWithdraws);
    }, [edit, cloSheetData, loadedWithdraws, loadedWithdrawsKey]);

    useEffect(() => {
        if (!edit) return;
        if (syncingWithdrawsRef.current) {
            syncingWithdrawsRef.current = false;
            return;
        }

        const currentWithdraws = Array.isArray(withdraws) ? withdraws : [];
        if (loadedWithdrawsKey !== JSON.stringify(currentWithdraws)) {
            setSave(true);
        }
    }, [edit, loadedWithdrawsKey, withdraws]);

    useEffect(() => {
        setStoreWithdraws(withdraws);
    }, [setStoreWithdraws, withdraws]);

    // Returns the sum of all nth elements in heads[key]
    function verify(key, rowIndex) {
        if (!heads[key] || heads[key].length === 0) return false;
        // Get the nth element from each array in heads[key] and sum them
        const sum = heads[key].reduce((sum, arr) => sum + Number(arr[rowIndex]), 0);
        return equalsRounded(sum, editColumn[rowIndex]);
    }

    function roundTo(value, decimals = 2) {
        const factor = 10 ** decimals;
        return Math.round(value * factor) / factor;
    }

    function equalsRounded(value, expected) {
        const numericExpected = Number(expected);
        if (Number.isNaN(numericExpected)) return false;

        return roundTo(value, 1) === numericExpected || roundTo(value, 2) === numericExpected;
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
        const col = getEditColumn(index)
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

    function getEditColumn(index) {
        const col = recapRows.map((row) => row[index])
        col.splice(1, 0, null)
        return col
    }

    function getInitialMultiCLO() {
        if (edit && Array.isArray(cloSheetData)) {
            return cloSheetData
        }

        const arr = recapRows.map(row => Array.isArray(row) ? row.slice(0, 3) : [row])
        arr.splice(1, 0, [null, null, null]) // Insert an empty row for CLO selection;
        return arr
    }

    function getHeadsFromMultiCLO(rows) {
        if (!Array.isArray(rows) || rows.length < 3 || !Array.isArray(rows[0])) {
            return {}
        }

        return rows[0].slice(3).reduce((acc, head, columnOffset) => {
            if (head === null || head === undefined || head === '') {
                return acc
            }

            const columnIndex = columnOffset + 3
            const values = rows.map((row) => Array.isArray(row) ? row[columnIndex] : undefined)
            const key = values[0]
            acc[key] = [...(acc[key] || []), values]
            return acc
        }, {})
    }

    function getStatusFromHeads(initialHeads) {
        return Object.keys(initialHeads).reduce((acc, key) => {
            acc[key] = initialHeads[key].length > 0
            return acc
        }, {})
    }

    const readClipboardItems = async (e) => {
        e.preventDefault();
        if (!clipboardAvailable) {
            // alert('Clipboard API not available in this environment. Please ensure HTTPS is enabled.');
            notify.error('Clipboard API not available in this environment. Please ensure HTTPS is enabled.', 'Error', { position: 'top-center', dismissible: true });
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
                        arr = arr.map(v => (isNaN(Number(v)) ? v : Number(v).toFixed(2)));
                        const exceeding = arr.find(a => Number(a) > Number(total));
                        if (exceeding !== undefined) {
                            notify.error(`Some marks exceed the total of ${total}. Please adjust before pasting.`, 'Error', { position: 'top-center', dismissible: true });
                            return;
                        }
                        setClipboardArray(arr);
                        setClipboardCache(arr.map(a => Number(a)));
                        setClipboardActive(true);
                    }
                }
            }
        } catch (err) {
            notify.error(`Failed to read clipboard: ${err.message}`, 'Error', { position: 'top-center', dismissible: true });
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
            // alert(msg);
            notify.error(msg, 'Validation Error', { position: 'top-center', dismissible: true });
            return;
        }
        let saveCache = clipboardCache;
        if (clipboardCache.length === 0) {
            saveCache = editColumn.slice(3);
        }
        const key = editColumn[0];
        const existingHeadRows = heads[key] || [];
        const rows = multiCLO.map((row, index) => [
            ...row,
            index === 0 ? existingHeadRows.length === 0 ? key : null
                : index === 1 ? Number(selCLO)
                    : index === 2 ? Number(total)
                        : index > 2 ? saveCache[index - 3]
                            : null
        ])
        setMultiCLO(rows)
        // console.log(rows)
        // Assign the last element of rows to heads[editColumn[0]]

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
                    if (!equalsRounded(sum, val)) {
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
                        if (!equalsRounded(sum, val)) {
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

        if (cloArr[0][delLoc[0]] !== null && cloArr[0][delLoc[0] + 1] === null) {
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

    /**
     * Compare regardless of order (shallow)
     */
    const isSameContent = (a, b) => {
        if (a.length !== b.length) return false;
        const count = (arr) => arr.reduce((acc, val) => (acc[val] = (acc[val] || 0) + 1, acc), {});
        const countA = count(a);
        const countB = count(b);
        return Object.keys(countA).every(key => countA[key] === countB[key]);
    };

    function markWithdraw(regNo) {
        return () => {
            let nextWithdraws;
            if (withdraws.includes(regNo)) {
                nextWithdraws = withdraws.filter(r => r !== regNo);
            } else {
                nextWithdraws = [...withdraws, regNo];
            }
            setWithdraws(nextWithdraws);
            setSave(!isSameContent(nextWithdraws, cloSheetWithdraws));
        }
    }

    return (
        <section>
            {/* Hidden input to capture Ctrl+V and onPaste events */}
            {/* <pre>{JSON.stringify({ edit, rid, cloSid })}</pre> */}
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
            <h3>CLOApply {`rid: ${rid}`} | {`Offid: ${storeCsOffid === undefined ? 'null' : storeCsOffid}`}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                <div style={{ flex: '0 0 auto', }}>

                    <table id="course" style={{ border: '1px solid #c8d8e8' }}>
                        <tbody>
                            <tr>
                                <th style={{ textAlign: 'right' }}>Batch :</th>
                                <td style={{ width: '500px' }}>{recap.batch}</td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'right' }}>Fcuity :</th>
                                <td>{recap.faculty}</td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'right' }}>Course :</th>
                                <td>{recap.course}</td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'right' }}>Semester : </th>
                                <td>{recap.semester} {recap.year}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '1150px',
                    overflow: 'auto',
                    alignItems: 'start'
                }}>
                    {cloRows.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', margin: '12px 0' }}>
                            {cloRows.map((cloRow, i) => (
                                <div key={`clo-card-${i}`} style={{
                                    border: '1px solid #c8d8e8',
                                    borderRadius: '8px',
                                    padding: '5px 7px',
                                    width: '180px',
                                    // background: '#f0f6ff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    wordWrap: 'break-word',
                                }}>
                                    {/* {JSON.stringify(cloRow)} */}
                                    <span style={{ fontWeight: 700, fontSize: '13px' }}>CLO {cloRow.clo}</span>
                                    {/* {cloRow.plo && <span style={{ fontSize: '12px', color: '#555' }}>PLO {cloRow.plo}</span>} */}
                                    {cloRow.statment && <span style={{ fontSize: '13px', color: '#666' }}>{cloRow.statment}</span>}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
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
                                            const content = formatRecapCell(cell)
                                            const isFailGrade = cellIndex === row.length - 2 && String(content).trim() === 'F'
                                            return rowIndex === 0 || rowIndex === 1
                                                ? <th key={`cell-${rowIndex}-${cellIndex}`}>
                                                    {edit && cellIndex > 2 && cellIndex < firstEmptyCellIndex
                                                        ? (<a href="#!" onClick={() => handleEditableHead(cellIndex)}>{content}</a>)
                                                        : content}
                                                </th>
                                                : <td key={`cell-${rowIndex}-${cellIndex}`}
                                                    style={{ color: withdraws.includes(row[2]) && cellIndex > 2 ? 'red' : '' }}>{cellIndex === row.length - 2 ? (<a href='#!' onClick={markWithdraw(row[2])} style={{ color: isFailGrade ? 'red' : undefined }}>{withdraws.includes(row[2]) && isFailGrade ? 'W' : content}</a>) : content}</td>
                                        })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editableIndex !== -1 && (
                        <>
                            <span style={{ display: 'none' }} id="show-logs">
                                <pre style={{ marginTop: '12px' }}>{JSON.stringify(recapRows.map((row) => row[editableIndex]))}</pre>
                                <pre style={{ marginTop: '12px' }}>
                                    {printObject({ withdraws, editableIndex, total, editColumn, clipboardArray, clipboardCache, selCLO, heads, status, save })}
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
                            marginTop: '10px',
                            display: 'inline-block',
                        }}
                        title={clipboardAvailable ? 'Paste from clipboard' : 'Clipboard API not available'}>
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
                                                                            title={clipboardAvailable ? 'Paste from clipboard' : 'Clipboard API not available'}>

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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1', marginTop: '50px' }}>
                            {multiCLO.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        // height: '50px',
                                        border: '0px solid #d3d3d3',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // gap: '12px',
                                        position: 'fixed',
                                        top: '130px',
                                        right: '12px',
                                        zIndex: 1100,
                                        background: 'white',
                                        // padding: '8px 10px',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)'
                                    }}>

                                        <a href='#!' onClick={save ? saveCLOSheet : undefined}
                                            style={{
                                                opacity: save ? 1 : 0.5,
                                                cursor: save ? 'pointer' : 'not-allowed',
                                                textDecoration: 'none',
                                                margin: '8px 8px',
                                            }}
                                            title={save ? 'Sheet Synchroinized' : 'Sheet not Synchroinized'}>
                                            {save ? (
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
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="#000000">
                                                    <g fill="none" stroke="#979797" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                                                        <path d="M42.5 11c0 4.418-8.283 8-18.5 8S5.5 15.418 5.5 11M43 24.205C43 28.51 34.493 32 24 32S5 28.51 5 24.205M11.5 24a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1" />
                                                        <path d="M5.5 11c0-4.418 8.283-8 18.5-8s18.5 3.582 18.5 8c0 0 .5 5 .5 13s-.5 13-.5 13c0 4.418-8.283 8-18.5 8S5.5 41.418 5.5 37c0 0-.5-5-.5-13s.5-13 .5-13" />
                                                        <path d="M11.5 37a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1M18 25.75a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1m0 14a.5.5 0 0 0 0-1m0 1a.5.5 0 0 1 0-1" />
                                                    </g>
                                                </svg>
                                            )}
                                        </a>
                                        {/* {save ? <span style={{ color: 'green', fontWeight: 'bold' }}>Marks Reconciliation Verified</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Marks Reconciliation Not Verified</span>} */}
                                    </div>
                                    <div>
                                        <table style={{
                                            // marginLeft: '20px' 
                                        }}>
                                            <tbody>
                                                {multiCLO.map((row, i) => (
                                                    <tr key={`multi-${i}`} style={{ height: '30px' }}>
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
                                {Object.keys(cloRows[0]).slice(1, 3).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cloRows.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).slice(1, 3).map((val, j) => (
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
