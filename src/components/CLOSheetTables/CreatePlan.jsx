import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../store';
import { getArr, getClo, getHeadsCleaned, getPlan, ENUMS } from './CLOSheetHelpers';

export default function CreatePlan({ closid }) {
    const closheet = useStore((state) => state.closheet);
    const getCLOSheet = useStore((state) => state.getCLOSheet);
    const setClosheet = useStore((state) => state.setClosheet);
    const [scheme, setScheme] = useState([])



    useEffect(() => {
        if (closid) {
            getCLOSheet(closid);
        }
    }, [closid, getCLOSheet]);

    if (!closheet || !closheet.data) return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading Plan Table...</div>;

    const rawData = closheet.data;
    const CLOs = closheet.clo || [];

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

    if (!hasSheetData) return null;

    const { clo, planByHeadAndClo, cloHdr, PLAN } = useMemo(() => {
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
    }, [data]);

    window.PLAN = PLAN;



    //console.log(data, PLAN, CLOs)
    // console.log(Object.entries(Object.groupBy(PLAN, ({ head }) => head)))

    return (
        <div className="mt-12 bg-white mx-auto">
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
                        {PLAN.map((item) => {
                            const { head, total, ...rest } = item;
                            let sumCLO = 0;
                            // console.log(head, total, rest)
                            const cleanHead = typeof head === 'string' ? head.replace(/\s*Paper\s*1/g, '') : head;
                            return (
                                <tr key={head} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-lg text-gray-900 font-semibold">{cleanHead}</td>
                                    {CLOs.map(clo => clo.clo).map((number, index) => {
                                        const isMapped = number === Number(total);
                                        const currentVal = isMapped ? (data[ENUMS.MAX][item.sno + 2] ?? '') : '';

                                        const handleCellBlur = (e) => {
                                            const val = e.target.innerText.trim();
                                            const id = e.target.id;
                                            const targetHead = id.split(':')[0];
                                            const targetClo = Number(id.split(':')[1]);

                                            const headTotal = scheme.reduce((acc, item) => item.head === targetHead ? acc + item.total : acc, 0)
                                            const planHeadTotal = PLAN.reduce((acc, item) => item.head === targetHead ? acc + item.total : acc, 0)
                                            if (headTotal + Number(val) > planHeadTotal) {
                                                //scheme = scheme.filter(item => item.head !== targetHead || item.clo !== targetClo);
                                                alert(`Total of heads exceeds the total of plan,  ${targetHead}, `);
                                                e.target.innerText = isMapped ? currentVal : '';
                                                return;
                                            }

                                            // Filter out any existing item with the same head and clo
                                            setScheme(scheme.filter(item => item.head !== targetHead || item.clo !== targetClo));

                                            const numVal = Number(val);
                                            if (val !== '' && !Number.isNaN(numVal) && numVal !== 0) {
                                                setScheme([...scheme, { head: targetHead, clo: targetClo, total: numVal }]);
                                            }
                                            console.log(scheme);
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
                                                    id={`${head}:${number}`}
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
                                    <td className="py-2.5 px-4 text-lg text-gray-600 font-medium text-center">{total}</td>
                                </tr>
                            )
                        })}
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-4 text-lg text-gray-800 font-bold">Total</td>
                            {CLOs.map(clo => clo.clo).map((number, index) => {
                                // const group = cloHdr.find(([cloKey]) => Number(cloKey) === Number(number));
                                // const items = group ? group[1] : [];
                                const total = scheme.reduce((sum, item) => item.clo === number ? sum + item.total : sum, 0);
                                console.log(number, total)
                                return (
                                    <td key={`clo-${number}-total`} className={`p-1 text-lg text-gray-800 font-bold text-center ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>
                                        <div className="py-1.5 px-3 rounded hover:ring-1 hover:ring-gray-300 transition-all">
                                            {total}
                                        </div>
                                    </td>
                                );
                            })}
                            <td className="py-2.5 px-4 text-lg text-gray-900 font-bold text-center">
                                {CLOs.map(clo => clo.clo).reduce((grandTotal, number) => {
                                    const group = cloHdr.find(([cloKey]) => Number(cloKey) === Number(number));
                                    const items = group ? group[1] : [];
                                    return grandTotal + items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
                                }, 0)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
