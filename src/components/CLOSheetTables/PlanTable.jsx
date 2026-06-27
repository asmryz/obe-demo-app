import React, { useEffect, useMemo } from 'react';
import { useStore } from '../../store';
import { getArr, getClo, getHeadsCleaned, getPlan, ENUMS } from './CLOSheetHelpers';

export default function PlanTable({ closid }) {
    const closheet = useStore((state) => state.closheet);
    const getCLOSheet = useStore((state) => state.getCLOSheet);

    useEffect(() => {
        if (closid) {
            getCLOSheet(closid);
        }
    }, [closid, getCLOSheet]);

    if (!closheet || !closheet.data) return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading Plan Table...</div>;

    const data = closheet.data;
    // console.log(`data >> ${JSON.stringify(data)}`)
    const hasSheetData = Array.isArray(data)
        && Array.isArray(data[ENUMS.HEADS])
        && Array.isArray(data[ENUMS.CLO])
        && Array.isArray(data[ENUMS.MAX]);

    if (!hasSheetData) return null;

    const { clo, planByHeadAndClo, cloHdr, PLAN } = useMemo(() => {
        const arrVal = getArr(data);
        const cloVal = getClo(arrVal);
        const headsCleanedVal = getHeadsCleaned(data);
        const PLANVal = getPlan(headsCleanedVal, data);

        const planByHeadAndCloVal = PLANVal.reduce((acc, item) => {
            if (!acc[item.head]) acc[item.head] = {};
            const cloKey = Number(item.clo);
            if (!Number.isNaN(cloKey)) {
                acc[item.head][cloKey] = (acc[item.head][cloKey] ?? 0) + (Number(item.total) || 0);
            }
            return acc;
        }, {});

        const cloHdrVal = Object.entries(Object.groupBy(PLANVal, ({ clo }) => clo));

        return {
            clo: cloVal,
            planByHeadAndClo: planByHeadAndCloVal,
            cloHdr: cloHdrVal,
            PLAN: PLANVal
        };
    }, [data]);

    console.log(PLAN)
    // console.log(Object.entries(Object.groupBy(PLAN, ({ head }) => head)))

    return (
        <div className="mt-12 bg-white mx-auto">
            <div className="w-fit overflow-x-auto pr-8">
                <table className="w-auto text-left border-collapse min-w-max">
                    <caption className="caption-top text-left pb-4 px-1">
                        <h2 className="text-2xl font-normal text-gray-900">Plan</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed breakdown of marks mapped between assessment heads and course learning outcomes.</p>
                    </caption>
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-lg text-gray-800 whitespace-nowrap pr-8">Heads/CLOs</th>
                            {clo.map((number, index) => (
                                <th key={`key-${index}`} className={`py-2 px-4 font-semibold text-lg text-gray-800 text-center ${index % 2 !== 0 ? 'bg-indigo-500/[0.04]' : ''}`}>{number}</th>
                            ))}
                            <th className="py-2 px-4 font-semibold text-lg text-gray-800 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(Object.groupBy(PLAN, ({ head }) => head)).map(([h]) => {
                            let sumCLO = 0;
                            const cleanHead = typeof h === 'string' ? h.replace(/\s*Paper\s*1/g, '') : h;
                            return (
                                <tr key={h} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-2.5 px-4 text-lg text-gray-900 font-semibold">{cleanHead}</td>
                                    {clo.map((number, index) => {
                                        const val = planByHeadAndClo[h]?.[number] ?? 0;
                                        sumCLO += val;
                                        return (
                                            <td key={`key-${number}`} className={`p-1 text-lg text-gray-600 font-medium text-center ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>
                                                <div className="py-1.5 px-3 rounded hover:ring-1 hover:ring-gray-300 transition-all">
                                                    {val || '\u00A0'}
                                                </div>
                                            </td>
                                        )
                                    })}
                                    <td className="py-2.5 px-4 text-lg text-gray-600 font-medium text-center">{sumCLO}</td>
                                </tr>
                            )
                        })}
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-4 text-lg text-gray-800 font-bold">Total</td>
                            {cloHdr.map(([cloKey, items], index) => (
                                <td key={`clo-${cloKey}-total`} className={`p-1 text-lg text-gray-800 font-bold text-center ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>
                                    <div className="py-1.5 px-3 rounded hover:ring-1 hover:ring-gray-300 transition-all">
                                        {items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}
                                    </div>
                                </td>
                            ))}
                            <td className="py-2.5 px-4 text-lg text-gray-900 font-bold text-center">
                                {cloHdr.reduce(
                                    (grandTotal, [, items]) => grandTotal + items.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                                    0
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
