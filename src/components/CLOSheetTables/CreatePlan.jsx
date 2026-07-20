import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../store';
import { getArr, getClo, getHeadsCleaned, getPlan, ENUMS } from './CLOSheetHelpers';
import { PlusCircle } from 'lucide-react';

export default function CreatePlan({ closid, setMenu, getScheme }) {
    const closheet = useStore((state) => state.closheet);
    const getCLOSheet = useStore((state) => state.getCLOSheet);
    const setClosheet = useStore((state) => state.setClosheet);
    const [scheme, setScheme] = useState([])
    const [tableRows, setTableRows] = useState([]);

    window.scheme = scheme;

    useEffect(() => {
        if (closid) {
            getCLOSheet(closid);
        }
    }, [closid, getCLOSheet]);

    useEffect(() => {
        scheme.reduce((grandTotal, item) => grandTotal + item.total, 0) === 100
            ? (() => {
                setMenu(prev => ({ ...prev, upload: true, download: true }))
                getScheme(scheme, students);
            })()
            : setMenu(prev => ({ ...prev, upload: false, download: false }))
    }, [scheme])



    const rawData = closheet?.data;
    const CLOs = closheet?.clo || [];
    const students = rawData.slice(2).map(row => row.slice(0, 3));

    console.log(rawData)

    const getCreatePlan = (sheetData) => {
        if (!Array.isArray(sheetData) || sheetData.length < 3) return sheetData;
        const heads = sheetData[ENUMS.HEADS];
        let firstEmptyIndex = -1;
        for (let i = 3; i < heads.length; i++) {
            if (heads[i] === '' || heads[i] === null || heads[i] === undefined) {
                firstEmptyIndex = i;
                break;
            }
        }
        if (firstEmptyIndex !== -1) {
            return sheetData.map(row => row.slice(0, firstEmptyIndex));
        }
        return sheetData;
    };

    const data = useMemo(() => getCreatePlan(rawData), [rawData]);

    const hasSheetData = Array.isArray(data)
        && Array.isArray(data[ENUMS.HEADS])
        && Array.isArray(data[ENUMS.CLO])
        && Array.isArray(data[ENUMS.MAX]);

    const { clo, planByHeadAndClo, cloHdr, PLAN } = useMemo(() => {
        if (!hasSheetData) return { clo: [], planByHeadAndClo: {}, cloHdr: [], PLAN: [] };

        const arrVal = getArr(data);
        const cloVal = getClo(arrVal);
        const headsCleanedVal = getHeadsCleaned(data);
        const originalPLANVal = getPlan(headsCleanedVal, data);

        const planByHeadAndCloVal = originalPLANVal.reduce((acc, item) => {
            if (!acc[item.head]) acc[item.head] = {};
            const cloKey = Number(item.clo);
            if (!Number.isNaN(cloKey)) {
                acc[item.head][cloKey] = (acc[item.head][cloKey] ?? 0) + (Number(item.total) || 0);
            }
            return acc;
        }, {});

        const cloHdrVal = Object.entries(Object.groupBy(originalPLANVal, ({ clo }) => clo));

        const PLANVal = originalPLANVal.map(item => {
            const { clo, ...rest } = item;
            return {
                ...rest,
                total: clo
            };
        });

        return {
            clo: cloVal,
            planByHeadAndClo: planByHeadAndCloVal,
            cloHdr: cloHdrVal,
            PLAN: PLANVal
        };
    }, [data, hasSheetData]);

    window.PLAN = PLAN;

    useEffect(() => {
        if (PLAN && PLAN.length > 0) {
            setTableRows(PLAN.map(item => ({
                ...item,
                isCustom: false
            })));
        }
    }, [PLAN]);

    if (!closheet || !closheet.data) return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading Plan Table...</div>;
    if (!hasSheetData) return null;

    const addEmptyRow = (index, headName = '') => {
        const parentRow = tableRows[index];
        const parentSno = parentRow ? parentRow.sno : index + 1;
        const existingCustomCount = tableRows.filter(row => row.head === headName && row.isCustom).length;
        const newSno = Number(`${parentSno}.${existingCustomCount + 1}`);

        const newRow = {
            sno: newSno,
            head: headName,
            total: '',
            isCustom: true
        };
        const updatedRows = [...tableRows];

        let insertIndex = index;
        for (let i = tableRows.length - 1; i >= index; i--) {
            if (tableRows[i].head === headName) {
                insertIndex = i;
                break;
            }
        }

        updatedRows.splice(insertIndex + 1, 0, newRow);
        setTableRows(updatedRows);
    };

    const handleHeadNameChange = (sno, newHeadName) => {
        const rowToUpdate = tableRows.find(r => r.sno === sno);
        if (!rowToUpdate) return;
        const oldHeadName = rowToUpdate.head;

        setTableRows(prev => prev.map(row => {
            if (row.sno === sno) {
                return { ...row, head: newHeadName };
            }
            return row;
        }));

        if (oldHeadName) {
            setScheme(prevScheme => prevScheme.map((item, idx) => {
                const updatedItem = item.head === oldHeadName ? { ...item, head: newHeadName } : item;
                return { ...updatedItem, sno: idx + 1 };
            }));
        }
    };

    //console.log(data, PLAN, CLOs)
    // console.log(Object.entries(Object.groupBy(PLAN, ({ head }) => head)))

    return (
        <div className="mt-2 bg-white mx-auto">
            <div className="w-fit overflow-x-auto pr-8">
                <table className="w-auto text-left border-collapse min-w-max">
                    <caption className="caption-top text-left pb-4 px-1">
                        <h2 className="text-2xl font-normal text-gray-900">Create Plan</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed breakdown of marks mapped between assessment heads and course learning outcomes.</p>
                    </caption>
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-lg text-gray-800 whitespace-nowrap pr-8">Heads/CLOs</th>
                            {CLOs.map(clo => clo.clo).map((number, index) => (
                                <th key={`key-${index}`} className={`py-2 px-4 font-semibold text-lg text-gray-800 text-center ${index % 2 !== 0 ? 'bg-indigo-500/[0.04]' : ''}`}>{number}</th>
                            ))}
                            <th className="py-2 px-4 font-semibold text-lg text-gray-800 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((item, idx) => {
                            const { head, total, isCustom } = item;
                            const cleanHead = typeof head === 'string' ? head.replace(/\s*Paper\s*1/g, '') : head;
                            const displayTotal = isCustom ? '' : total;

                            return (
                                <tr key={item.sno} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-lg text-gray-900 font-semibold">
                                        <div className="flex items-center gap-2">
                                            {!isCustom && (
                                                <button
                                                    onClick={() => addEmptyRow(idx, head)}
                                                    className="text-gray-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95 focus:outline-none cursor-pointer shrink-0"
                                                    title="Add empty row below"
                                                >
                                                    <PlusCircle size={16} />
                                                </button>
                                            )}
                                            <span>{isCustom ? '' : cleanHead}</span>
                                        </div>
                                    </td>
                                    {CLOs.map(clo => clo.clo).map((number, index) => {
                                        const isMapped = isCustom
                                            ? (scheme.some(s => s.rowSno === item.sno && s.clo === number))
                                            : (number === Number(total));
                                        const schemeItem = scheme.find(s => s.rowSno === item.sno && s.clo === number);
                                        const currentVal = schemeItem
                                            ? schemeItem.total
                                            : (isMapped ? (data[ENUMS.MAX][item.sno + 2] ?? '') : '');

                                        const handleCellBlur = (e) => {
                                            const val = e.target.innerText.trim();
                                            const id = e.target.getAttribute('data');
                                            const targetHead = id.split(':')[0];
                                            const targetClo = Number(id.split(':')[1]);

                                            const headTotal = scheme.reduce((acc, s) => {
                                                if (s.rowSno === item.sno && s.clo === targetClo) {
                                                    return acc;
                                                }
                                                return s.head === targetHead ? acc + s.total : acc;
                                            }, 0);
                                            const planHeadTotal = PLAN.reduce((acc, item) => item.head === targetHead ? acc + item.total : acc, 0)

                                            if (planHeadTotal > 0 && (headTotal + Number(val) > planHeadTotal)) {
                                                alert(`Total of heads exceeds the total of plan,  ${targetHead}, `);
                                                e.target.innerText = schemeItem ? schemeItem.total : (isMapped ? (data[ENUMS.MAX][item.sno + 2] ?? '') : '');
                                                return;
                                            }

                                            // Filter out any existing item with the same rowSno and clo
                                            const filteredScheme = scheme.filter(s => s.rowSno !== item.sno || s.clo !== targetClo);

                                            const numVal = Number(val);
                                            if (val !== '' && !Number.isNaN(numVal) && numVal !== 0) {
                                                const newScheme = [...filteredScheme, { head: targetHead, clo: targetClo, total: numVal, rowSno: item.sno, isCustom: item.isCustom }];
                                                setScheme(newScheme.map((s, idx) => ({ ...s, sno: idx + 1 })));
                                            } else {
                                                setScheme(filteredScheme.map((s, idx) => ({ ...s, sno: idx + 1 })));
                                            }
                                        };

                                        const handleKeyDown = (e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.target.blur();
                                            }
                                        };

                                        return (
                                            <td key={`key-${number}`} className={`p-1 text-lg text-gray-600 font-medium text-center w-[56.5px] ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>
                                                <div
                                                    data={`${head}:${number}`}
                                                    contentEditable="true"
                                                    suppressContentEditableWarning={true}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    className="py-1.5 px-3 rounded hover:ring-1 hover:ring-blue-300 transition-all outline-none"
                                                >
                                                    {currentVal || '\u00A0'}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td className="py-2.5 px-4 text-lg text-gray-600 font-medium text-center">{displayTotal}</td>
                                </tr>
                            )
                        })}
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-4 text-lg text-gray-800 font-bold">Total</td>
                            {CLOs.map(clo => clo.clo).map((number, index) => {
                                // const group = cloHdr.find(([cloKey]) => Number(cloKey) === Number(number));
                                // const items = group ? group[1] : [];
                                const total = scheme.reduce((sum, item) => item.clo === number ? sum + item.total : sum, 0);

                                return (
                                    <td key={`clo-${number}-total`} className={`p-1 text-lg text-gray-800 font-bold text-center ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>
                                        <div className="py-1.5 px-3 rounded hover:ring-1 hover:ring-gray-300 transition-all">
                                            {total}
                                        </div>
                                    </td>
                                );
                            })}
                            <td className="py-2.5 px-4 text-lg text-gray-900 font-bold text-center">
                                {scheme.reduce((grandTotal, item) => grandTotal + item.total, 0)} /
                                {PLAN.map(item => Number(item.total)).reduce((grandTotal, number) => {
                                    return grandTotal + number;
                                }, 0)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* <pre style={{ fontSize: '12px' }}>{JSON.stringify({ scheme, PLAN }, null, 2)}</pre> */}
        </div>
    )
}
