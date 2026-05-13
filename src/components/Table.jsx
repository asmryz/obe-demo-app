import React, { useState, useEffect } from 'react';
import { ListFilter, HelpCircle, ArrowDown, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Dropdown from './Dropdown';
import { Search } from 'lucide-react';
import { store, useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Table = ({ data = [], onSearch }) => {
    const navigate = useNavigate();
    // console.log(data);
    const renderBatchTag = (batch) => {
        if (batch.includes("Elective")) {
            return <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">Elective</span>;
        }
        if (batch.includes("Open")) {
            return <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-100">Open</span>;
        }
        const match = batch.match(/BEME\s+(\d+)\s+-\s+Section\s+([A-Z])/);
        if (match) {
            return <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">{`${match[1]} ${match[2]}`}</span>;
        }
        return <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">{batch}</span>;
    };

    const { recapPgNo, setRecapPgNo } = useStore();
    const {
        recapsPerPage = 10,
        currentPage = 1,
        selectedSemester = 'All',
        selectedYear = 'All',
        searchQuery = ''
    } = recapPgNo || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                onSearch(searchQuery);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    const uniqueSemesters = ['All', ...new Set(data.map(item => item.semester))];
    const uniqueYears = ['All', ...new Set(data.map(item => item.year.toString()))].sort((a, b) => b === 'All' ? -1 : a.localeCompare(b));

    const filteredData = data.filter(item => {
        const semesterMatch = selectedSemester === 'All' || item.semester === selectedSemester;
        const yearMatch = selectedYear === 'All' || item.year.toString() === selectedYear;

        const query = searchQuery.toLowerCase();
        const searchMatch = !query ||
            (item.code && item.code.toLowerCase().includes(query)) ||
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.name && item.name.toLowerCase().includes(query));

        return semesterMatch && yearMatch && searchMatch;
    });

    const totalrecaps = filteredData.length;
    const totalPages = Math.ceil(totalrecaps / recapsPerPage);
    const startIndex = (currentPage - 1) * recapsPerPage;
    const endIndex = Math.min(startIndex + recapsPerPage, totalrecaps);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handlerecapsPerPageChange = (e) => {
        setRecapPgNo({ recapsPerPage: parseInt(e.target.value, 10), currentPage: 1 });
    };

    const handleSelectCourse = (recap) => {
        console.log(recap);
        store.getState().setRecap(recap);
        if (recap.closid) {
            navigate(`/closheet/${recap.closid}`);
        }
    };

    return (
        <div className="mt-12 bg-white">
            {/* Filter Bar */}
            <div className="flex items-center justify-between p-1 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Search size={18} className="text-gray-800" />
                        <span className="text-sm font-semibold text-gray-900">Search</span>
                    </div>
                    <input
                        type="text"
                        name="search"
                        value={searchQuery}
                        onChange={(e) => {
                            setRecapPgNo({ searchQuery: e.target.value, currentPage: 1 });
                        }}
                        placeholder="code, title or faculty"
                        className="text-sm text-gray-600 bg-transparent outline-none w-64 placeholder-gray-500"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Semester:</span>
                        <Dropdown
                            options={uniqueSemesters}
                            value={selectedSemester}
                            onChange={(val) => {
                                setRecapPgNo({ selectedSemester: val, currentPage: 1 });
                            }}
                            showRoundedOutline={false}
                            className="min-w-[80px]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Year:</span>
                        <Dropdown
                            options={uniqueYears}
                            value={selectedYear}
                            onChange={(val) => {
                                setRecapPgNo({ selectedYear: val, currentPage: 1 });
                            }}
                            showRoundedOutline={false}
                            className="min-w-[60px]"
                        />
                    </div>
                    <HelpCircle size={18} className="text-gray-600 cursor-pointer" />
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto border-t border-gray-200">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-14">ID</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-24">Batch</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-24">Code</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-[40%]">Course Title</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-[20%]">Instructor</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-28">Semester</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-20">Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((recap, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="py-2.5 px-4 text-sm text-gray-600 font-medium">#{(currentPage - 1) * recapsPerPage + idx + 1}</td>
                                <td className="py-2.5 px-4 text-sm">
                                    {renderBatchTag(recap.batch)}
                                </td>
                                <td className={`py-2.5 px-4 text-sm font-semibold truncate ${recap.ccid === null ? "text-gray-400 italic" : recap.closid !== null ? "text-green-600" : "text-amber-600"}`} title={recap.title}>
                                    {recap.code}
                                </td>
                                <td className={`py-2.5 px-4 text-sm font-semibold truncate cursor-pointer ${recap.ccid === null ? "text-gray-400 italic" : recap.closid !== null ? "text-green-600" : "text-amber-600"}`} title={recap.title}
                                    onClick={() => {
                                        handleSelectCourse(recap);
                                    }}
                                >
                                    {recap.title}
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-600 truncate" title={recap.name}>{recap.name}</td>
                                <td className="py-2.5 px-4 text-sm">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${recap.semester === 'Spring' ? 'bg-green-100 text-green-700' :
                                        recap.semester === 'Fall' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {recap.semester}
                                    </span>
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-600">{recap.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end p-3 gap-6 text-sm text-gray-600 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span>recaps per page:</span>
                    <div className="flex items-center gap-1 font-medium text-gray-900 relative">
                        <select
                            value={recapsPerPage}
                            onChange={handlerecapsPerPageChange}
                            className="appearance-none bg-transparent pr-5 outline-none cursor-pointer"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <ChevronDown size={14} className="text-gray-900 absolute right-0 pointer-events-none" />
                    </div>
                </div>
                <div>
                    {startIndex + 1} – {endIndex} of {totalrecaps}
                </div>
                <div className="flex items-center gap-4 ml-2">
                    <button
                        onClick={() => setRecapPgNo({ currentPage: Math.max(currentPage - 1, 1) })}
                        disabled={currentPage === 1}
                        className={`p-1 rounded hover:bg-gray-100 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 cursor-pointer'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setRecapPgNo({ currentPage: Math.min(currentPage + 1, totalPages) })}
                        disabled={currentPage === totalPages}
                        className={`p-1 rounded hover:bg-gray-100 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 cursor-pointer'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            {/* <pre>
                {JSON.stringify(data, null, 2)}
            </pre> */}
        </div>
    );
};

export default Table;
