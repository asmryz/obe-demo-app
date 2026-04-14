import React from 'react'
import { Suspense } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './RecapSheets.css';
import { useRecapStore } from '../store/recapStore';
import { CLOApply } from './CLOApply';


export const RecapSheets = () => {
    const [selectedRid, setSelectedRid] = useState(null);
    const recapsByQuery = useRecapStore((state) => state.recapsByQuery);
    const lastQuery = useRecapStore((state) => state.lastQuery);
    const isLoading = useRecapStore((state) => state.isLoading);
    const error = useRecapStore((state) => state.error);
    const fetchRecaps = useRecapStore((state) => state.fetchRecaps);
    const [search, setSearch] = useState(lastQuery);
    const normalizedSearch = search.trim().length >= 3 ? search.trim() : '';
    const hasCachedRecaps = Object.prototype.hasOwnProperty.call(recapsByQuery, normalizedSearch);
    const recaps = recapsByQuery[normalizedSearch] ?? [];
    const recapList = Array.isArray(recaps) ? recaps : [];

    useEffect(() => {
        if (hasCachedRecaps) {
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchRecaps(normalizedSearch);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [normalizedSearch, hasCachedRecaps, fetchRecaps]);

    const handleRecapClick = (event, rid) => {
        event.preventDefault();
        setSelectedRid(rid);
    };

    if (selectedRid !== null) {
        return (
            <>
                
                <a href="#!" onClick={() => setSelectedRid(null)}>
                    Back to <b>Recap Sheets</b>
                </a>
                <Suspense fallback={<p>Loading recap JSONB data...</p>}>
                    <CLOApply rid={selectedRid} />
                </Suspense>
            </>
        );
    }

    return (
        <>
            <input type="text" name="search" id="" placeholder='Search course, faculty, semester or year' value={search} onChange={(e) => setSearch(e.target.value)} style={{
                borderRadius: '6px',
                padding: '6px',
                width: '60ch',
                display: 'block',
                margin: '0 auto 12px auto'
            }} />
            {isLoading && <p>Loading recap sheets...</p>}
            {error && <p>{error}</p>}
            {recapList.length > 0
                ? <table>
                    <thead>
                        <tr>
                            <th>Batch</th>
                            <th>Course</th>
                            <th>Faculty</th>
                            <th>Semester</th>
                            <th>Year</th>
                            {/* <th></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {recapList.map((recap, index) => (
                            <tr key={`${recap.rid}-${recap.code ?? 'nocode'}-${index}`} style={{backgroundColor: recap.code !== null ? 'lightyellow' : 'transparent'}}>
                                <td>{recap.batch}</td>
                                <td>

                                    <a href="#!" onClick={(event) => handleRecapClick(event, recap.rid)}>
                                        {recap.course}
                                    </a>
                                </td>
                                <td>{recap.faculty}</td>
                                <td>{recap.semester}</td>
                                <td>{recap.year}</td>
                                {/* <td>{recap.code}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>

                : <p>No recap sheets available.</p>}
        </>

    )
}

