import React from 'react'
import { useState } from 'react';
import { api } from '../../api';
import { useEffect } from 'react';
import './RecapSheets.css';


export const RecapSheets = () => {
    const [recaps, setRecaps] = useState([]);
    useEffect(() => {
        api.get('/api/recaps').then(({ data }) => setRecaps(data));
    }, []);

    return (
        <div>
            {recaps.length > 0
                ? <table>
                    <thead>
                        <tr>
                            <th>Batch</th>
                            <th>Course</th>
                            <th>Faculty</th>
                            <th>Semester</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recaps && recaps.map((recap) => (
                            <tr key={recap.rid}>
                                <td>{recap.batch}</td>
                                <td>{recap.course}</td>
                                <td>{recap.faculty}</td>
                                <td>{recap.semester}</td>
                                <td>{recap.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                : <p>No recap sheets available.</p>}
        </div>


    )
}

