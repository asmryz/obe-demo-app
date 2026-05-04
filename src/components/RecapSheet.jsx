import rows from './recapsheet.json'

export default function RecapSheet() {
    return (
        <>
            <div className="bg-base-200/20 border-neutral/10 rounded-box not-prose flex w-full flex-[1_0_0] flex-wrap gap-3 border p-3 sm:p-4">
                <div className="text-base-content text-left text-lg font-semibold rtl:text-right select-none">
                    Users Info
                    <p className="text-base-content/80 mt-1 text-sm font-normal">
                        Browse a list of user information such as name, email, status, date & more.
                    </p>
                </div>
                <div className="thin-scrollbar w-full overflow-hidden" style={{ overflow: 'hidden', height: '280px' }} onMouseEnter={e => e.currentTarget.style.overflow = 'auto'} onMouseLeave={e => e.currentTarget.style.overflow = 'hidden'}>
                    <table className="table-xs table-pin-rows table" style={{ width: 'max-content', minWidth: '100%' }}>
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="whitespace-nowrap">Off ID</th>
                                <th className="whitespace-nowrap">CC ID</th>
                                <th className="whitespace-nowrap">Batch</th>
                                <th>Title</th>
                                <th className="whitespace-nowrap">Name</th>
                                <th className="whitespace-nowrap">Semester</th>
                                <th className="whitespace-nowrap">Year</th>
                                <th className="whitespace-nowrap">Clos ID</th>
                                <th className="whitespace-nowrap">RID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={`${row.rid}-${index}`}>
                                    <td className="whitespace-nowrap">{row.offid}</td>
                                    <td className="whitespace-nowrap">{row.ccid}</td>
                                    <td className="whitespace-nowrap">{row.batch}</td>
                                    <td>{row.title}</td>
                                    <td className="whitespace-nowrap">{row.name}</td>
                                    <td className="whitespace-nowrap">{row.semester}</td>
                                    <td className="whitespace-nowrap">{row.year}</td>
                                    <td className="whitespace-nowrap">{row.closid}</td>
                                    <td className="whitespace-nowrap">{row.rid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
