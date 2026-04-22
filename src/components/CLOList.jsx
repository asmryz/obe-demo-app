
import React, { use } from 'react';
import { useSheetStore } from '../store/sheetStore';

function CLOList() {
    const { getCLOList } = useSheetStore();
    const data = use(getCLOList());

    if (!data || data.length === 0) return <div>No CLOs found.</div>;

    const columns = Array.from(
        data.reduce((keys, clo) => {
            if (clo && typeof clo === 'object' && !Array.isArray(clo)) {
                Object.keys(clo).forEach((key) => keys.add(key));
            }
            return keys;
        }, new Set())
    );

    const displayValue = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
    };

    return (
        <div>
            <h2>CLO List</h2>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((clo, idx) => (
                        <tr key={clo?.id || idx}>
                            {columns.map((column) => (
                                <td key={column}>{displayValue(clo?.[column])}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CLOList;
