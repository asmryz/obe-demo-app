import { Fragment } from 'react'

export default function CloHeadTable({ data, cloHdr, withdraws, kpi, setKpi }) {
    return (
        <>
            <div className="mt-8 mb-4 px-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-normal text-gray-900">CLO Analysis</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed student achievement metrics per Course Learning Outcome (CLO), calculated across all assessment heads.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-gray-200">
                        <label htmlFor="kpi" className="text-sm font-medium text-gray-700">KPI Threshold:</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="kpi"
                                name="kpi"
                                value={kpi}
                                onChange={(e) => setKpi(Number(e.target.value))}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <span className="absolute right-6 top-1.5 text-gray-400 text-xs">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="w-full overflow-y-auto overflow-x-auto border-t border-gray-200 custom-scrollbar"
                style={{ height: '500px' }}
            >
                <table id="clo-head" className="w-full text-left border-separate border-spacing-0 relative [&_th]:border-b [&_th]:border-gray-200 [&_td]:border-b [&_td]:border-gray-200">

                    <thead className="sticky top-0 z-30 bg-white">
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-md text-gray-800 text-center border-r border-gray-200 sticky left-0 z-20 bg-gray-100" colSpan={3}>CLO</th>
                            {cloHdr.map(([cloKey, items]) => (
                                <th className="py-2 px-4 font-semibold text-md text-gray-800 text-center border-r border-gray-200 bg-gray-100" key={`clo-${cloKey}`} colSpan={items.length + 2}>{cloKey}</th>
                            ))}
                        </tr>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-md text-gray-700 text-left border-r border-gray-200 sticky left-0 z-20 bg-gray-50" colSpan={3}>Heads</th>
                            {cloHdr.map(([cloKey, items]) => (
                                <Fragment key={`heads-${cloKey}`}>
                                    {items.map((item, index) => (
                                        <th className="py-2 px-4 font-semibold text-sm text-gray-700 whitespace-nowrap text-center bg-gray-50" key={`clo-${cloKey}-item-${index}`}>{item.head}</th>
                                    ))}
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-700 whitespace-nowrap bg-gray-100 text-center" key={`clo-${cloKey}-total`}>Total</th>
                                    <th className="py-2 px-4 font-semibold text-sm text-gray-700 whitespace-nowrap border-r border-gray-200 bg-gray-100 text-center" key={`clo-${cloKey}-achieved`}>Achieved</th>
                                </Fragment>
                            ))}
                        </tr>
                        <tr className="bg-white border-b border-gray-200 shadow-sm">
                            <th className="py-2 px-4 font-semibold text-sm text-gray-900 uppercase tracking-wider text-left sticky left-0 z-20 bg-white w-[60px] min-w-[60px] max-w-[60px]">SNo</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-900 uppercase tracking-wider text-left sticky left-[60px] z-20 bg-white w-[260px] min-w-[260px] max-w-[260px]">Name</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-900 uppercase tracking-wider text-center border-r border-gray-200 sticky left-[320px] z-20 bg-white w-[110px] min-w-[110px] max-w-[110px]">Reg.No</th>
                            {cloHdr.map(([cloKey, items]) => (
                                <Fragment key={`totals-${cloKey}`}>
                                    {items.map((item, index) => (
                                        <th className="py-2 px-4 font-bold text-md text-blue-500 text-center bg-white" key={`clo-${cloKey}-item-${index}`}>{item.total}</th>
                                    ))}
                                    <th className="py-2 px-4 font-semibold text-sm text-amber-600 bg-gray-50 text-center" key={`clo-${cloKey}-total-blank`}>
                                        {items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}
                                    </th>
                                    <th className="py-2 px-4 font-semibold text-sm text-amber-600 border-r border-gray-200 bg-gray-50 text-center" key={`clo-${cloKey}-achieved-blank`}>{kpi}</th>
                                </Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(3).map((row, rowIndex) => {
                            const safeRow = Array.isArray(row) ? row : []
                            const cloCells = cloHdr.flatMap(([cloKey, items]) => {
                                const stdTotal = items.reduce((sum, item) => sum + (Number(safeRow[item.sno + 2]) || 0), 0).toFixed(2)
                                const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
                                const achievedPct = cloTotal ? (stdTotal / cloTotal * 100) : 0;
                                const achievedText = achievedPct.toFixed(0) + '%';
                                const color = achievedPct < kpi ? 'red' : 'black'
                                const fontWeight = achievedPct < kpi ? 'bold' : 'normal'
                                const isWithdrawn = withdraws.includes(row[2]) || withdraws.includes(String(row[2]))
                                const backgroundColor = isWithdrawn ? 'transparent' : (achievedPct < kpi ? '#fef2f2' : 'transparent')
                                const textColorClass = color === 'red' ? 'text-red-600' : 'text-gray-900'
                                const fontWeightClass = fontWeight === 'bold' ? 'font-bold' : 'font-semibold'

                                let barBg = 'bg-gray-200';
                                let barColor = 'bg-red-500';
                                if (achievedPct >= kpi) {
                                    if (achievedPct < 70) {
                                        barBg = 'bg-gray-100';
                                        barColor = 'bg-green-400';
                                    } else if (achievedPct < 85) {
                                        barBg = 'bg-gray-200';
                                        barColor = 'bg-green-500';
                                    } else {
                                        barBg = 'bg-gray-200';
                                        barColor = 'bg-green-600';
                                    }
                                }

                                return [
                                    ...items.map((item, index) => (
                                        <td className="py-1.5 px-3 text-sm text-gray-600 font-medium text-center" key={`cell-${rowIndex}-${cloKey}-${index}`} >
                                            {safeRow[item.sno + 2] == null ? '' : Number(safeRow[item.sno + 2]).toString()}
                                        </td>
                                    )),
                                    <td
                                        className={`py-1.5 px-3 text-sm text-center ${textColorClass} ${fontWeightClass}`}
                                        key={`cell-${rowIndex}-${cloKey}-total`}
                                        style={{ backgroundColor }}>
                                        {stdTotal}
                                    </td>,
                                    <td
                                        className={`py-1.5 px-3 text-sm text-left border-r border-gray-200 ${textColorClass} ${fontWeightClass}`}
                                        key={`cell-${rowIndex}-${cloKey}-achieved`}
                                        style={{ backgroundColor }}>
                                        <div className="flex items-center">
                                            <span className="mr-2 min-w-[32px] text-right">{achievedText}</span>
                                            <div className="relative w-full min-w-[40px]">
                                                <div className={`overflow-hidden h-2 text-xs flex rounded ${barBg}`}>
                                                    <div style={{ width: achievedText }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                ]
                            })
                            return (
                                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors group" key={`row-${rowIndex}`}>
                                    <td className="py-1.5 px-3 text-sm text-black-600 font-medium text-center sticky left-0 z-10 bg-white group-hover:bg-gray-50 w-[60px] min-w-[60px] max-w-[60px] truncate">{safeRow[0] ?? ''}</td>
                                    <td className="py-1.5 px-3 text-sm text-black-500 text-left sticky left-[60px] z-10 bg-white group-hover:bg-gray-50 w-[260px] min-w-[260px] max-w-[260px] truncate" title={safeRow[1] ?? ''}>{safeRow[1] ?? ''}</td>
                                    <td className="py-1.5 px-3 text-sm text-black-500 border-r border-gray-200 text-center sticky left-[320px] z-10 bg-white group-hover:bg-gray-50 w-[110px] min-w-[110px] max-w-[110px] truncate">{safeRow[2] ?? ''}</td>
                                    {cloCells}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
