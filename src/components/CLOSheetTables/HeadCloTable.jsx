export default function HeadCloTable({ data, hdr }) {
    // Calculate column ranges and alternate indices for each header
    let currentColIndex = 0;
    const headerColumns = hdr.map((h, index) => {
        const startIdx = currentColIndex;
        currentColIndex += h.span;
        const endIdx = currentColIndex; // exclusive

        // Alternate actual assessment heads (index >= 3 in hdr)
        const isAssessmentHead = index >= 3;
        const assessmentIndex = index - 3;
        const isShaded = isAssessmentHead && (assessmentIndex % 2 !== 0);

        return {
            ...h,
            startIdx,
            endIdx,
            isShaded
        };
    });

    const getColumnBg = (cellIndex) => {
        const matchingHeader = headerColumns.find(h => cellIndex >= h.startIdx && cellIndex < h.endIdx);
        if (matchingHeader && matchingHeader.isShaded) {
            return 'bg-indigo-50/50'; // soft indigo shade for alternate head columns
        }
        return '';
    };

    const getHeaderBg = (h) => {
        if (h.isShaded) {
            return 'bg-indigo-500/[0.04]'; // soft indigo tint for alternate head headers
        }
        return '';
    };

    return (
        <>
            <div className="mt-8 mb-4 px-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-normal text-gray-900">CLO's Distibution</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed assessment mapping of Course Learning Outcomes (CLOs) grouped by primary evaluation heads.</p>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-x-auto border-t border-gray-200">
                <table id="head-clo" className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            {headerColumns.map((h, index) => {
                                const bgClass = getHeaderBg(h);
                                return (
                                    <th
                                        key={`cell-0-${index}`}
                                        colSpan={h.span}
                                        className={`py-2 px-4 font-semibold text-sm text-gray-800 text-center ${bgClass}`}
                                    >
                                        {h.head}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(1).map((row, rowIndex) => (
                            <tr
                                key={`row-${rowIndex + 1}`}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                {row.map((cell, cellIndex) => {
                                    const bgClass = getColumnBg(cellIndex);
                                    const isSecondRow = rowIndex === 1;
                                    const textColorClass = isSecondRow ? 'text-blue-600 font-bold text-md' : 'text-gray-600 text-sm';
                                    return (
                                        <td
                                            key={`cell-${rowIndex + 1}-${cellIndex}`}
                                            className={`py-1.5 px-3 ${textColorClass} ${bgClass}`}
                                            style={{
                                                textAlign: cellIndex === 1 ? 'left' : 'center',
                                                fontWeight: isSecondRow ? '700' : (cellIndex === 1 ? '600' : 'normal'),
                                                color: isSecondRow ? '#2563eb' : (cellIndex === 1 ? '#111827' : '#4b5563')
                                            }}
                                        >
                                            {cellIndex > 2 ? Number(cell).toString() : cell ?? ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
