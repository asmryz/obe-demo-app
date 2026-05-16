import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { getArr, getClo, getHeadsCleaned, getPlan, ENUMS } from './CLOSheetHelpers';

export default function PlanTable({ closid }) {
    const { closheet, getCLOSheet } = useStore();

    useEffect(() => {
        if (closid) {
            getCLOSheet(closid);
        }
    }, [closid, getCLOSheet]);

    if (!closheet || !closheet.data) return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading Plan Table...</div>;

    const data = closheet.data;
    const hasSheetData = Array.isArray(data)
        && Array.isArray(data[ENUMS.HEADS])
        && Array.isArray(data[ENUMS.CLO])
        && Array.isArray(data[ENUMS.MAX]);

    if (!hasSheetData) return null;

    const arr = getArr(data);
    const clo = getClo(arr);
    const headsCleaned = getHeadsCleaned(data);
    const PLAN = getPlan(headsCleaned, data);

    const planByHeadAndClo = PLAN.reduce((acc, item) => {
        if (!acc[item.head]) acc[item.head] = {};
        const cloKey = Number(item.clo);
        if (!Number.isNaN(cloKey)) {
            acc[item.head][cloKey] = (acc[item.head][cloKey] ?? 0) + (Number(item.total) || 0);
        }
        return acc;
    }, {});

    const cloHdr = Object.entries(Object.groupBy(PLAN, ({ clo }) => clo));

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
                                        return <td key={`key-${number}`} className={`py-2.5 px-4 text-lg text-gray-600 font-medium text-center ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>{val || ''}</td>
                                    })}
                                    <td className="py-2.5 px-4 text-lg text-gray-600 font-medium text-center">{sumCLO}</td>
                                </tr>
                            )
                        })}
                        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-4 text-lg text-gray-800 font-bold">Total</td>
                            {cloHdr.map(([cloKey, items], index) => (
                                <td key={`clo-${cloKey}-total`} className={`py-2.5 px-4 text-lg text-gray-800 font-bold text-center ${index % 2 !== 0 ? 'bg-indigo-50/50' : ''}`}>
                                    {items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}
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
