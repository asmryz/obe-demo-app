export default function CloSummaryTable({ cloSummaryRows }) {
    if (!cloSummaryRows || cloSummaryRows.length === 0) return null;

    return (
        <div className="mt-12 bg-white">
            {/* <div className="mt-8 mb-4 px-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                    </div>
                </div>
            </div> */}

            <div className="w-1/4 overflow-x-auto">
                <table id="clo-summary" className="w-full text-left border-separate border-spacing-0 relative [&_th]:border-b [&_th]:border-gray-200 [&_td]:border-b [&_td]:border-gray-200">
                    <caption className="caption-top text-left pb-4 px-1">
                        <h2 className="text-2xl font-normal text-gray-900">CLO Achievement Summary</h2>
                        <p className="text-sm text-gray-500 mt-1">Aggregate count and percentage of students who achieved each Course Learning Outcome (CLO) based on the current KPI threshold.</p>
                    </caption>
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800">CLO</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-[180px] text-center">Achieved</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 w-[180px] text-center">Not Achieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cloSummaryRows.map(([cloKey, [achievedCount, notAchievedCount]]) => {
                            const totalCount = achievedCount + notAchievedCount;
                            const achievedPct = totalCount ? ((achievedCount / totalCount) * 100).toFixed(1) : '0.0';
                            const notAchievedPct = totalCount ? ((notAchievedCount / totalCount) * 100).toFixed(1) : '0.0';

                            return (
                                <tr key={`cal-${cloKey}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors group">
                                    <td className="py-2.5 px-4 text-sm text-gray-900 font-semibold">{cloKey}</td>
                                    <td className="py-2.5 px-4 text-sm text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="font-medium text-gray-900">{achievedCount}</span>
                                            <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100 min-w-[50px]">
                                                {achievedPct}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-sm text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="font-medium text-gray-900">{notAchievedCount}</span>
                                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200 min-w-[50px]">
                                                {notAchievedPct}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
