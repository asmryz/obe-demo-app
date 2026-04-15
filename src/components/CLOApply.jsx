import React from 'react'
import { use } from 'react'
import { useState } from 'react'
import { api } from '../api/index.js'
import { ToggleButton } from './ToggleButton'
import { useEffect } from 'react'

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
    const [heads, setHeads] = useState({})

    const [multiCLO, setMultiCLO] = useState(() => {
        // Each row should only have its first 3 elements
        let arr = recapRows.map(row => Array.isArray(row) ? row.slice(0, 3) : [row]);
        arr.splice(1, 0, [null, null, null]) // Insert an empty row for CLO selection;
        return arr;
    })
    const [selCLO, setSelCLO] = useState(0)


    const [editableIndex, setEditableIndex] = useState(-1)
    const [editColumn, setEditColumn] = useState([])
    const [total, setTotal] = useState(editColumn[2])
    //const [inputValues, setInputValues] = useState([])
    const [clipboardCache, setClipboardCache] = useState([])
    const [clipboardArray, setClipboardArray] = useState([])
    const clipboardAvailable = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.read === 'function'
    console.log(recap)
    // const handleInputChange = (rowIndex, value) => {
    //     const newValues = [...inputValues]
    //     newValues[rowIndex] = value
    //     setInputValues(newValues)
    // }

    const firstRow = Array.isArray(recapRows[0]) ? recapRows[0] : []
    const firstEmptyCellIndex = firstRow.findIndex((cell) => cell === '')
    const lastThreeColumnsStartIndex = Math.max(firstRow.length - 3, 0)
    const canHideMiddleColumns = firstEmptyCellIndex !== -1 && firstEmptyCellIndex + 1 < lastThreeColumnsStartIndex


    useEffect(() => {
        console.log('clipboardCache updated:', clipboardCache);
    }, [clipboardCache]);

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
        setHeads({[col[0]]:[]})
        setTotal(col[2])
        console.log(editColumn)
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
        if (clipboardCache.length === 0) {
            setClipboardCache(editColumn.slice(3));
        }
        let rowsCopy = [...multiCLO]
        //rowsCopy.splice(1, 0, [null, null, null])
        const rows = rowsCopy.map((row, index) => [...row.slice(0, rowsCopy.length),
        index === 0 ? editColumn[index]
            : index === 1 ? Number(selCLO)
                : index === 2 ? total
                    : index > 2 ? clipboardCache[index - 3]
                        : null])
        setMultiCLO(rows)
        console.log(rows)
        // Assign the last element of rows to heads[editColumn[0]]
        setHeads(prev => ({
            ...prev,
            [editColumn[0]]: [...heads[editColumn[0]],[editColumn[0], Number(selCLO), total, ...editColumn.slice(3)]]
        }))
        setClipboardCache([])
    }

    return (
        <section>
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
                            <pre style={{ marginTop: '12px' }}>{JSON.stringify({ total, editColumn: editColumn, clipboardArray, selCLO, heads })}</pre>
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

                    <div style={{ display: 'flex' }}>
                        <div>
                            <table style={{ marginTop: '12px' }}>
                                <tbody>
                                    <tr style={{ border: '1px solid white' }}>
                                        <td colSpan={multiCLO.length - 1} style={{ textAlign: 'right', border: 'none' }}>
                                            <a href="#!" onClick={handleSaveCLO} >
                                                <svg className="w-[31px] h-[31px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" d="M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z" />
                                                </svg>
                                            </a>
                                            {editColumn.length}
                                        </td>
                                    </tr>
                                    {multiCLO.map((erow, rowIndex) => {
                                        let cells;

                                        if (erow.length > 3) {
                                            // Insert editColumn[rowIndex] at index 3, shift the rest
                                            cells = [
                                                ...erow.slice(0, 3),
                                                editColumn[rowIndex],
                                                ...erow.slice(3)
                                            ];
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
                                                        width: cellIndex === 3 ? '45px' : 'auto'
                                                    }}>{rowIndex === 1 && cellIndex === 1 ? 'CLO' : cellContent}</td>
                                                })}
                                                <td style={{ width: '45px' }}>
                                                    {rowIndex === 0
                                                        ? editColumn[rowIndex]
                                                        : rowIndex === 1
                                                            ? (<select value={selCLO} onChange={(e) => setSelCLO(e.target.value)}>
                                                                <option value=""></option>
                                                                {cloRows.map((clo, cloIndex) => (
                                                                    <option key={`clo-option-${cloIndex}`} value={clo.clo}>{clo.clo}</option>
                                                                ))}
                                                            </select>)
                                                            : rowIndex === 2 ? (<input type="text" value={total} onChange={handleTotalChange} style={{ width: '30px' }} />)
                                                                // Copy total value to all rows if total is changed, otherwise show original values or clipboard values
                                                                : rowIndex > 2 && Number(total) === editColumn[2]
                                                                    ? editColumn[rowIndex]
                                                                    : clipboardCache.length !== 0
                                                                        ? clipboardCache[rowIndex - 3] : null}
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

