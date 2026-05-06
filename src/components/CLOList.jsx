
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

    let toggle = false;
    const rowColors = data.map((clo) => {
        // eslint-disable-next-line react-hooks/immutability
        if (clo.clo === 1) toggle = !toggle;
        return toggle;
    });

    return (
        <div>
            <h2>CLO List</h2>
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={`column-${index}`} style={{width: index === 1 ? '65px': ''}}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((clo, idx) => {
                        return (
                        <tr key={clo?.id || idx} style={{backgroundColor: rowColors[idx] ? `#f3f4f6`: `white`}}>
                            {columns.map((column, colIndex) => (
                                <td key={`cell-${idx}-${colIndex}`}>{displayValue(clo?.[column])}</td>
                            ))}
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
}

export default CLOList;
