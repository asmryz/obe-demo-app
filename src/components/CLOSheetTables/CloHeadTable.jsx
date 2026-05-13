import { Fragment } from 'react'

export default function CloHeadTable({ data, cloHdr, withdraws, kpi, setKpi }) {
    return (
        <>
            <h2>CLOs wise Head</h2>
            <form action="">
                <label htmlFor="kpi">Set KPI Threshold (%): </label>
                <input
                    type="number"
                    id="kpi"
                    name="kpi"
                    value={kpi}
                    onChange={(e) => setKpi(Number(e.target.value))}
                    style={{ width: '50px' }}
                />
            </form>
            <div style={{ overflowX: 'auto' }}>
            <table id="clo-head">
                <thead>
                    <tr>
                        <th colSpan={3}>CLO</th>
                        {cloHdr.map(([cloKey, items]) => (
                            <th key={`clo-${cloKey}`} colSpan={items.length + 2}>{cloKey}</th>
                        ))}
                    </tr>
                    <tr>
                        <th colSpan={3}>Heads</th>
                        {cloHdr.map(([cloKey, items]) => (
                            <Fragment key={`heads-${cloKey}`}>
                                {items.map((item, index) => (
                                    <th key={`clo-${cloKey}-item-${index}`}>{item.head}</th>
                                ))}
                                <th key={`clo-${cloKey}-total`}>Total</th>
                                <th key={`clo-${cloKey}-achieved`}>Achieved</th>
                            </Fragment>
                        ))}
                    </tr>
                    <tr>
                        <th>SNo</th>
                        <th>Name</th>
                        <th>Reg.No</th>
                        {cloHdr.map(([cloKey, items]) => (
                            <Fragment key={`totals-${cloKey}`}>
                                {items.map((item, index) => (
                                    <th key={`clo-${cloKey}-item-${index}`}>{item.total}</th>
                                ))}
                                <th key={`clo-${cloKey}-total-blank`}>
                                    {items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}
                                </th>
                                <th key={`clo-${cloKey}-achieved-blank`}>{kpi}</th>
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
                            const achieved = cloTotal ? (stdTotal / cloTotal * 100).toFixed(2) + '%' : '0%'
                            const color = parseFloat(achieved) < kpi ? 'red' : 'black'
                            const fontWeight = parseFloat(achieved) < kpi ? 'bold' : 'normal'
                            const isWithdrawn = withdraws.includes(row[2]) || withdraws.includes(String(row[2]))
                            const backgroundColor = isWithdrawn ? 'transparent' : (parseFloat(achieved) < kpi ? '#dadada' : 'transparent')
                            return [
                                ...items.map((item, index) => (
                                    <td key={`cell-${rowIndex}-${cloKey}-${index}`} >
                                        {safeRow[item.sno + 2] == null ? '' : Number(safeRow[item.sno + 2]).toString()}
                                    </td>
                                )),
                                <td
                                    key={`cell-${rowIndex}-${cloKey}-total`}
                                    style={{ color, fontWeight, backgroundColor }}>
                                    {stdTotal}
                                </td>,
                                <td
                                    key={`cell-${rowIndex}-${cloKey}-achieved`}
                                    style={{ color, fontWeight, backgroundColor }}>
                                    {achieved}
                                </td>
                            ]
                        })
                        return (
                            <tr key={`row-${rowIndex}`}>
                                <td>{safeRow[0] ?? ''}</td>
                                <td style={{ textAlign: 'left', whiteSpace : 'nowrap' }}>{safeRow[1] ?? ''}</td>
                                <td>{safeRow[2] ?? ''}</td>
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
