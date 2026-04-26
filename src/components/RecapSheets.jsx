import React from 'react'
import { Suspense } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './RecapSheets.css';
import { useRecapStore } from '../store/recapStore';
import { CLOApply } from './CLOApply';
import CLOSheet from './CLOSheet';
import { useSheetStore } from '../store/sheetStore';


export const RecapSheets = () => {
    const { rid, setRID, cloSid, setCLOSid, setRecap } = useSheetStore()
    // const [selectedRid, setSelectedRid] = useState(null);
    // const [cloSid, setCloSid] = useState(null);
    const recapsByQuery = useRecapStore((state) => state.recapsByQuery);
    const lastQuery = useRecapStore((state) => state.lastQuery);
    const isLoading = useRecapStore((state) => state.isLoading);
    const error = useRecapStore((state) => state.error);
    const fetchRecaps = useRecapStore((state) => state.fetchRecaps);
    const getRecapResource = useRecapStore((state) => state.getRecapResource);
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

    const handleRecapClick = (event, selectedRecap) => {
        event.preventDefault();
        const rid = selectedRecap.rid;
        const closid = selectedRecap.closid;
        setRecap({
            ...selectedRecap,
            course: selectedRecap.course ?? selectedRecap.title ?? '',
            faculty: selectedRecap.faculty ?? selectedRecap.name ?? '',
            data: Array.isArray(selectedRecap.data) ? selectedRecap.data : [],
            clo: Array.isArray(selectedRecap.clo) ? selectedRecap.clo : []
        });
        setRID(rid);
        setCLOSid(closid);

        getRecapResource(rid).then(({ recap }) => {
            if (recap) {
                setRecap(recap);
            }
        });
    };

    // console.log(recapList)

    if (rid !== null) {
        return (
            <>
                <a href="#" onClick={() => { setRID(null); setCLOSid(null); setRecap(null); }}>
                    Back to <b>Recap Sheets</b>
                </a>

                {!cloSid && <CLOApply rid={rid} />
                                  
                    // <CLOSheet closid={cloSid} rid={rid} />
                }

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

                ? <>
                    {recapList.length}
                    <table>
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Course</th>
                                <th>Faculty</th>
                                <th>Semester</th>
                                <th>Year</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recapList.map((recap, index) => (
                                <tr key={`${recap.rid}-${recap.code ?? 'nocode'}-${index}`} style={{ backgroundColor: recap.ccid !== null ? (recap.closid !== null ? 'lightgreen' : 'lightyellow') : 'transparent' }}>
                                    <td>{recap.batch}</td>
                                    <td style={{ width: '650px' }}>
                                        {recap.ccid !== null ? (
                                            <a href="#!" onClick={(event) => handleRecapClick(event, recap)}>
                                                {recap.title}
                                            </a>

                                        ) : recap.title}
                                    </td>
                                    <td style={{ width: '200px' }}>{recap.name}</td>
                                    <td>{recap.semester}</td>
                                    <td>{recap.year}</td>
                                    <td>{recap.closid} | {recap.rid }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
                : <p>No recap sheets available.</p>}
        </>

    )
}
