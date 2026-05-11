import React, { useState } from 'react';
import data from "../RecapSheets.json";
import { ListFilter, HelpCircle, ArrowDown, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const RegionTable = () => {
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

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);



    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const paginatedData = data.slice(startIndex, endIndex);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    return (
        <div className="mt-12 bg-white">
            {/* Filter Bar */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <ListFilter size={18} className="text-gray-800" />
                        <span className="text-sm font-semibold text-gray-900">Filter</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter property name or value"
                        className="text-sm text-gray-600 bg-transparent outline-none w-64 placeholder-gray-500"
                    />
                </div>
                <HelpCircle size={18} className="text-gray-600 cursor-pointer" />
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto border-t border-gray-200">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-12">ID</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-20">Batch</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-1/2">Course Title</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-1/4">Instructor</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-24">Semester</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-16">Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="py-2.5 px-4 text-sm text-gray-600 font-medium">#{row.offid}</td>
                                <td className="py-2.5 px-4 text-sm">
                                    {renderBatchTag(row.batch)}
                                </td>
                                <td className={`py-2.5 px-4 text-sm font-semibold truncate ${row.ccid === null ? "text-gray-400 italic" : row.closid !== null ? "text-green-600" : "text-amber-600"}`} title={row.title}>
                                    {row.title}
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-600 truncate" title={row.name}>{row.name}</td>
                                <td className="py-2.5 px-4 text-sm">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${row.semester === 'Spring' ? 'bg-green-100 text-green-700' :
                                        row.semester === 'Fall' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {row.semester}
                                    </span>
                                </td>
                                <td className="py-2.5 px-4 text-sm text-gray-600">{row.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end p-3 gap-6 text-sm text-gray-600 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <div className="flex items-center gap-1 font-medium text-gray-900 relative">
                        <select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
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
                    {startIndex + 1} – {endIndex} of {totalRows}
                </div>
                <div className="flex items-center gap-4 ml-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-1 rounded hover:bg-gray-100 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 cursor-pointer'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-1 rounded hover:bg-gray-100 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 cursor-pointer'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegionTable;
