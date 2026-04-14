import React from 'react'
import { use } from 'react'
import { useState } from 'react'
import { api } from '../api/index.js'
import { ToggleButton } from './ToggleButton'

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

    const [editableIndex, setEditableIndex] = useState(-1)
    const [editColumn, setEditColumn] = useState([])
    //const [inputValues, setInputValues] = useState([])
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
        setEditColumn(recapRows.map((row) => row[index]))

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
                    }
                }
            }
        } catch (err) {
            alert(`Failed to read clipboard: ${err.message}`);
        }
    };

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
                        <pre style={{ marginTop: '12px' }}>{JSON.stringify(recapRows.map((row) => row[editableIndex]))}</pre>
                    )}
                    {/* {recap && (
                        <pre>{JSON.stringify(recap, null, 2)}</pre>
                    )} */}
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
                    <table style={{ marginTop: '12px' }}>
                        <tbody>
                            {recapRows.map((erow, rowIndex) => {
                                const cells = [...erow.slice(0, 3), editColumn[rowIndex]]

                                if (rowIndex === 1) {
                                    return (
                                        <React.Fragment key={`row-${rowIndex}`}>
                                            <tr>
                                                {cells.map((_, cellIndex) => (
                                                    <td key={`extra-cell-${rowIndex}-${cellIndex}`}>{cellIndex === 1 ? 'CLO': null}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                {cells.map((cell, cellIndex) => {
                                                    const cellContent = cell === null ? '' : typeof cell === 'object' ? JSON.stringify(cell) : cell;
                                                    return <td key={`cell-${rowIndex}-${cellIndex}`}>{cellContent}</td>
                                                })}
                                            </tr>
                                        </React.Fragment>
                                    );
                                }

                                return (
                                    <tr key={`row-${rowIndex}`}>
                                        {cells.map((cell, cellIndex) => {
                                            const cellContent = cell === null ? '' : typeof cell === 'object' ? JSON.stringify(cell) : cell;
                                            return <td key={`cell-${rowIndex}-${cellIndex}`}>{cellContent}</td>
                                        })}
                                        <td style={{width: '45px'}}>
                                            {/* <input
                                                type="text"
                                                value={inputValues[rowIndex] || ''}
                                                onChange={(e) => handleInputChange(rowIndex, e.target.value)}
                                            /> */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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

