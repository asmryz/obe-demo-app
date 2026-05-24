import { grades } from './CLOSheetHelpers'

export default function RecapSheetTable({ data, recapHeads, recapHeadRanges, withdraws }) {
    return (
        <>
            <div className="mt-8 mb-4 px-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-normal text-gray-900">Recap Sheet</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed summary of assessment scores, weighted totals, and final grades calculated across all heads.</p>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto border-t border-gray-200 custom-scrollbar">
                <table id="recapsheet" className="w-full text-left border-collapse">
                    <tbody>
                        {data.map((row, rowIndex) => (
                            rowIndex === 1 || rowIndex === 2 ? null : rowIndex === 0 ? (
                                <tr key={`row-${rowIndex}`} className="bg-gray-100 border-b border-gray-200">
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center">SNo</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-left">Name</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center">Reg.No</th>
                                    {recapHeads.map((h, index) => (
                                        <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center" key={`cell-${rowIndex}-${index}`}>{h.head}</th>
                                    ))}
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center">100%</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center">Total</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center">Grade</th>
                                </tr>
                            ) : (() => {
                                const isWithdrawn = withdraws.includes(row[2])
                                    || withdraws.includes(String(row[2]))
                                const style = isWithdrawn ? { color: 'red', fontWeight: 'bold' } : undefined
                                return (
                                    <tr key={`row-${rowIndex}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="py-1.5 px-3 text-sm text-gray-600 text-center">{row[0] ?? ''}</td>
                                        <td className="py-1.5 px-3 text-sm text-gray-950 font-medium text-left">{row[1] ?? ''}</td>
                                        <td className="py-1.5 px-3 text-sm text-gray-600 text-center">{row[2] ?? ''}</td>
                                        {recapHeadRanges.map(({ head, start, end }) => {
                                            const sum = row
                                                .slice(start, end)
                                                .reduce((total, mark) => total + (Number(mark) || 0), 0)
                                            return (
                                                <td key={`recap-${rowIndex}-${head}`} className="py-1.5 px-3 text-sm text-gray-600 text-center" style={style}>
                                                    {sum.toString().length > 5 ? Number(sum.toFixed(2)) : sum}
                                                </td>
                                            )
                                        })}
                                        <td className="py-1.5 px-3 text-sm text-gray-900 font-semibold text-center" style={style}>
                                            {row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2)}
                                        </td>
                                        <td className="py-1.5 px-3 text-sm text-gray-900 font-semibold text-center" style={style}>
                                            {Math.round(row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2))}
                                        </td>
                                        <td className="py-1.5 px-3 text-sm text-center" style={style}>
                                            {(() => {
                                                const total = Math.round(row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2))
                                                const gradeObj = grades.find(({ start, end }) => total >= start && total <= end)
                                                const gradeName = gradeObj?.grade ?? ''
                                                const finalGrade = isWithdrawn && gradeName === 'F' ? 'W' : gradeName

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
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${badgeColorClass}`}>
                                                        {finalGrade}
                                                    </span>
                                                )
                                            })()}
                                        </td>
                                    </tr>
                                )
                            })()
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
