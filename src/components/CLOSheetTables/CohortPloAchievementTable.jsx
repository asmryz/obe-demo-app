import { grades } from './CLOSheetHelpers'

export default function CohortPloAchievementTable({ cohort, cohortPloColumns, totals, kpi, withdraws = [] }) {
    if (!cohort || cohort.length === 0 || !cohortPloColumns || cohortPloColumns.length === 0) {
        return (
            <div className="w-full text-center py-10 text-gray-500 font-medium bg-white rounded-xl border border-gray-200 mt-8 shadow-sm">
                No PLO data available. Please verify your CLO-to-PLO mappings.
            </div>
        );
    }

    return (
        <div className="max-w-5xl w-full mx-auto">
            <div className="mt-8 mb-4 px-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-normal text-gray-900 font-sans">Cohort PLO Achievement</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed breakdown of student performance mapped to Program Learning Outcomes (PLOs).</p>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto border-t border-gray-200 custom-scrollbar">
                <table id="cohort-plo-achievement" className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-1.5 px-3 font-semibold text-sm text-gray-800 text-center w-16">SNo</th>
                            <th className="py-1.5 px-3 font-semibold text-sm text-gray-800 text-left min-w-[200px] whitespace-nowrap">Name</th>
                            <th className="py-1.5 px-3 font-semibold text-sm text-gray-800 text-center w-32">Reg.No</th>
                            {cohortPloColumns.map((ploKey) => (
                                <th key={`cohort-head-${ploKey}`} className="py-1.5 px-3 font-semibold text-sm text-gray-800 text-center w-28">{ploKey}</th>
                            ))}
                            <th className="py-1.5 px-3 font-semibold text-sm text-gray-800 text-center w-28">Total</th>
                            <th className="py-1.5 px-3 font-semibold text-sm text-gray-800 text-center w-28">Grade</th>
                        </tr>
                        <tr className="border-b border-gray-200 bg-white">
                            <th className="py-1.5 px-3 text-sm font-semibold text-gray-500 text-center"></th>
                            <th className="py-1.5 px-3 text-sm font-bold text-left" style={{ color: '#2563eb' }}>Total</th>
                            <th className="py-1.5 px-3 text-sm font-semibold text-gray-500 text-center"></th>
                            {cohortPloColumns.map((ploKey) => (
                                <th key={`cohort-total-${ploKey}`} className="py-1.5 px-3 text-md font-bold text-center" style={{ color: '#2563eb' }}>
                                    {totals[ploKey] ?? 0}
                                </th>
                            ))}
                            <th className="py-1.5 px-3 text-md font-bold text-center" style={{ color: '#2563eb' }}>
                                {Object.values(totals).reduce((sum, val) => sum + (Number(val) || 0), 0)}
                            </th>
                            <th className="py-1.5 px-3 text-sm font-semibold text-gray-500 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cohort.map((student, index) => {
                            const isWithdrawn = withdraws && (withdraws.includes(student.regno) || withdraws.includes(String(student.regno)));
                            const { regno: _regno, name: _name, ...stdPLOTotal } = student;
                            const stdTotal = Math.round(Object.values(stdPLOTotal).reduce((sum, val) => sum + (Number(val) || 0), 0))
                            const gradeObj = grades.find(({ start, end }) => stdTotal >= start && stdTotal <= end)
                            const gradeName = gradeObj?.grade ?? ''
                            const finalGrade = isWithdrawn && gradeName === 'F' ? 'W' : gradeName
                            const sumPLOs = Object.fromEntries(cohortPloColumns.map((ploKey) => [ploKey, 0]))

                            return (
                                <tr key={`cohort-row-${student.regno || index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-1.5 px-3 text-sm text-gray-600 text-center">{index + 1}</td>
                                    <td className="py-1.5 px-3 text-sm text-gray-950 font-medium text-left whitespace-nowrap">{student.name}</td>
                                    <td className="py-1.5 px-3 text-sm text-gray-600 text-center">{student.regno}</td>
                                    {cohortPloColumns.map((ploKey) => {
                                        const studentPlo = Number(student[ploKey]) || 0
                                        const ploTotal = Number(totals[ploKey]) || 0
                                        const achieved = ploTotal ? (studentPlo / ploTotal * 100) : 0
                                        sumPLOs[ploKey] = (finalGrade === 'F' || finalGrade === 'W') ? 0 : achieved < kpi ? 0 : 1

                                        const isRed = sumPLOs[ploKey] === 0;
                                        let cellBg = 'transparent';
                                        let textColor = '#4b5563'; // Tailwind text-gray-600
                                        let fontW = 400;

                                        if (isRed) {
                                            if (finalGrade !== 'F' && finalGrade !== 'W') {
                                                // Passed course but failed PLO: elegant modern soft lavender highlight with premium deep red
                                                cellBg = '#f3e8ff'; // Modern premium soft lavender
                                                textColor = '#be123c'; // Elegant rose-700 (premium deep red/rose)
                                                fontW = 600;
                                            } else {
                                                // Failed course overall: soft red warning color
                                                textColor = '#ef4444'; // Elegant red-500
                                                fontW = 700;
                                            }
                                        } else {
                                            // Achieved PLO: render in clean, dark slate gray
                                            textColor = '#1f2937'; // gray-800
                                            fontW = 500;
                                        }

                                        const isLavender = isRed && finalGrade !== 'F' && finalGrade !== 'W';
                                        let cellStyle = {
                                            // backgroundColor: cellBg,
                                            color: textColor,
                                            fontWeight: fontW

                                        };

                                        if (isLavender) {
                                            cellStyle = {
                                                ...cellStyle,
                                                // borderLeft: '3px solid #c084fc', // Elegant purple accent vertical line
                                                boxShadow: 'inset 0 1px 0 0 rgba(192, 132, 252, 0.05), inset 0 -1px 0 0 rgba(192, 132, 252, 0.05)',
                                            };
                                        }

                                        return (
                                            <td key={`cohort-cell-${student.regno || index}-${ploKey}`}
                                                className="py-1.5 px-3 text-sm text-center transition-all duration-200 relative group"
                                                style={cellStyle}
                                            >
                                                {isLavender && (
                                                    <span
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 transition-transform duration-200 group-hover:scale-125 cursor-help"
                                                        title="PLO not achieved (Course passed)"
                                                    />
                                                )}
                                                <span>{student[ploKey] == null ? '' : Number(student[ploKey]).toFixed(2)}</span>
                                            </td>
                                        )
                                    })}
                                    <td className="py-1.5 px-3 text-sm text-gray-900 font-semibold text-center">{stdTotal}</td>
                                    <td className="py-1.5 px-3 text-sm text-center">
                                        {(() => {
                                            let badgeColorClass = 'text-gray-700 bg-gray-50 border-gray-200';
                                            if (finalGrade.startsWith('A')) {
                                                badgeColorClass = 'text-green-700 bg-green-50 border-green-200';
                                            } else if (finalGrade.startsWith('B')) {
                                                badgeColorClass = 'text-blue-700 bg-blue-50 border-blue-200';
                                            } else if (finalGrade.startsWith('C')) {
                                                badgeColorClass = 'text-amber-700 bg-amber-50 border-amber-200';
                                            } else if (finalGrade === 'F' || finalGrade === 'W') {
                                                badgeColorClass = 'text-red-700 bg-red-50 border-red-200 font-bold';
                                            }
                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${badgeColorClass} shadow-2xs`}>
                                                    {finalGrade}
                                                </span>
                                            )
                                        })()}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
