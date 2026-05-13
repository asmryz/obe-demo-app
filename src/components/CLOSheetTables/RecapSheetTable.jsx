import { grades } from './CLOSheetHelpers'

export default function RecapSheetTable({ data, recapHeads, recapHeadRanges, withdraws }) {
    return (
        <>
            <h2>Recap Sheet</h2>
            <table id="recapsheet">
                <tbody>
                    {data.map((row, rowIndex) => (
                        rowIndex === 1 || rowIndex === 2 ? null : rowIndex === 0 ? (
                            <tr key={`row-${rowIndex}`}>
                                <th>SNo</th>
                                <th>Name</th>
                                <th>Reg.No</th>
                                {recapHeads.map((h, index) => (
                                    <th key={`cell-${rowIndex}-${index}`}>{h.head}</th>
                                ))}
                                <th>100%</th>
                                <th>Total</th>
                                <th>Grade</th>
                            </tr>
                        ) : (() => {
                            const isWithdrawn = withdraws.includes(row[2])
                                || withdraws.includes(String(row[2]))
                            const style = isWithdrawn ? { color: 'red', fontWeight: 'bold' } : undefined
                            return (
                                <tr key={`row-${rowIndex}`}>
                                    <td>{row[0] ?? ''}</td>
                                    <td style={{ textAlign: 'left' }}>{row[1] ?? ''}</td>
                                    <td >{row[2] ?? ''}</td>
                                    {recapHeadRanges.map(({ head, start, end }) => {
                                        const sum = row
                                            .slice(start, end)
                                            .reduce((total, mark) => total + (Number(mark) || 0), 0)
                                        return <td key={`recap-${rowIndex}-${head}`} style={style}>{sum.toString().length > 5 ? Number(sum.toFixed(2)) : sum}</td>
                                    })}
                                    <td style={style}>{row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2)}</td>
                                    <td style={style}>{Math.round(row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2))}</td>
                                    <td style={style}>{(() => {
                                        const total = Math.round(row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2))
                                        const gradeObj = grades.find(({ start, end }) => total >= start && total <= end)
                                        const gradeName = gradeObj?.grade ?? ''
                                        return isWithdrawn && gradeName === 'F' ? 'W' : gradeName
                                    })()}</td>
                                </tr>
                            )
                        })()
                    ))}
                </tbody>
            </table>
        </>
    )
}
