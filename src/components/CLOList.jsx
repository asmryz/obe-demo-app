
import React, { use } from 'react';
import { useSheetStore } from '../store/sheetStore';

function CLOList() {
    const { getCLOList } = useSheetStore();
    const data = use(getCLOList());

    if (!data || data.length === 0) return <div>No CLOs found.</div>;

    return (
        <div>
            <h2>CLO List</h2>
            <ul>
                {data.map((clo, idx) => (
                    <li key={clo.id || idx}>{clo.name || JSON.stringify(clo)}</li>
                ))}
            </ul>
        </div>
    );
}

export default CLOList;