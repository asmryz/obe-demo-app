import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Info, Search, HelpCircle, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { store, useStore } from '../store';

function Courses() {
    const { setIsRightPanelOpen, setRightPanelArgs } = useOutletContext();
    const courses = useStore((state) => state.courses) || [];
    const getCourses = useStore((state) => state.getCourses);
    const programId = useStore((state) => state.programId);

    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage, setCoursesPerPage] = useState(10);

    useEffect(() => {
        // Always use programId 2 for this page (BSCS)
        // const activeId = 2;
        // if (programId !== 2) {
        //     store.setState({ programId: 2 });
        // }
        getCourses(programId);
    }, [programId, getCourses]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Filter by search query
    const filteredCourses = (courses || []).filter(course => {
        const query = searchQuery.toLowerCase();
        return !query ||
            (course.code && course.code.toLowerCase().includes(query)) ||
            (course.title && course.title.toLowerCase().includes(query));
    });

    const totalCourses = filteredCourses.length;
    const totalPages = Math.ceil(totalCourses / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = Math.min(startIndex + coursesPerPage, totalCourses);
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return (
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header Row */}
            <div className="max-w-7xl w-full flex flex-row items-center justify-between pb-4 mb-4">
                <h2 className="text-3xl font-normal text-gray-900">Courses</h2>
            </div>

            {/* Display Content Area */}
            <div className="max-w-7xl w-full flex-1 flex flex-col">
                <div className="bg-white">
                    {/* Filter Bar */}
                    <div className="flex items-center justify-between p-1 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Search size={18} className="text-gray-800" />
                                <span className="text-sm font-semibold text-gray-900">Search</span>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="code or title"
                                className="text-sm text-gray-600 bg-transparent outline-none w-64 placeholder-gray-500"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <HelpCircle size={18} className="text-gray-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto border-t border-gray-200">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-14">ID</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-32">Code</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-[55%]">Course Title</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-24 text-center">Theory</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-24 text-center">Lab</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-32 text-center">Total Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCourses.length > 0 ? (
                                    paginatedCourses.map((course, idx) => {
                                        const theoryCredits = course.theory ?? 0;
                                        const labCredits = course.lab ?? 0;
                                        const totalCredits = theoryCredits + labCredits;
                                        return (
                                            <tr key={course.cid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="py-1.5 px-3 text-sm text-gray-600 font-medium">
                                                    #{(currentPage - 1) * coursesPerPage + idx + 1}
                                                </td>
                                                <td className="py-1.5 px-3 text-sm font-semibold text-gray-800">
                                                    {course.code}
                                                </td>
                                                <td
                                                    className="py-1.5 px-3 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate"
                                                    title={course.title}
                                                    onClick={() => {
                                                        setRightPanelArgs({ course });
                                                        setIsRightPanelOpen(true);
                                                    }}
                                                >
                                                    {course.title}
                                                </td>
                                                <td className="py-1.5 px-3 text-sm text-gray-600 text-center">
                                                    {course.theory !== null ? course.theory : '-'}
                                                </td>
                                                <td className="py-1.5 px-3 text-sm text-gray-600 text-center">
                                                    {course.lab !== null ? course.lab : '-'}
                                                </td>
                                                <td className="py-1.5 px-3 text-sm text-gray-800 font-semibold text-center">
                                                    {course.theory !== null || course.lab !== null ? totalCredits : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-sm text-gray-500 italic">
                                            No courses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalCourses > 0 && (
                        <div className="flex items-center justify-end p-3 gap-6 text-sm text-gray-600 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <span>courses per page:</span>
                                <div className="flex items-center gap-1 font-medium text-gray-900 relative">
                                    <select
                                        value={coursesPerPage}
                                        onChange={(e) => {
                                            setCoursesPerPage(parseInt(e.target.value, 10));
                                            setCurrentPage(1);
                                        }}
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
                                {startIndex + 1} – {endIndex} of {totalCourses}
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default Courses;
