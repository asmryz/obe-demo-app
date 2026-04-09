import { Fragment, useState } from 'react'
import PLOChart from './PLOChart'
import './MarksList.css'

const ENUMS = Object.freeze({
    HEADS: 0,
    CLO: 1,
    QUESTIONS: 2,
    MAX: 3
})

function MarksList({ data: incomingData }) {
    const [kpi, setKpi] = useState(50)
    const data = incomingData

    const arr = data[ENUMS.CLO].slice(3)
    const clo = [...new Set(arr.filter((x) => typeof x === 'number'))]

    let sno = 1
    let previousHead = ''

    const PLAN = data[ENUMS.HEADS].slice(3).map((head, index) => {
        const currentHead = data[ENUMS.HEADS][index + 3]
        if (currentHead !== null) {
            previousHead = currentHead
        }
        const chead = previousHead

        return {
            sno: sno++,
            head: chead,
            clo: data[ENUMS.CLO][index + 3] ?? '',
            total: data[ENUMS.MAX][index + 3] ?? ''
        }
    })

    const planByHeadAndClo = PLAN.reduce((acc, item) => {
        if (!acc[item.head]) {
            acc[item.head] = {}
        }

        const cloKey = Number(item.clo)
        if (!Number.isNaN(cloKey)) {
            acc[item.head][cloKey] = (acc[item.head][cloKey] ?? 0) + (Number(item.total) || 0)
        }

        return acc
    }, {})

    previousHead = ''
    let key = ''
    const hdr = Object.values(
        data[ENUMS.HEADS].reduce((acc, item) => {
            if (item !== null) {
                key = item
                acc[key] = { head: key, span: 1 }
            } else if (key) {
                acc[key].span += 1
            }
            return acc
        }, {})
    )

    sno = 1
    const cloHdr = Object.entries(Object.groupBy(PLAN, ({ clo }) => clo))
    let calCLOs = []
    let stdCLOs = {}

    function cloSummary(localCalCLOs) {
        return Object.entries(
            localCalCLOs.reduce((acc, cloObj) => {
                clo.forEach((cloNo) => {
                    const cloKey = `CLO${cloNo}`
                    if (!acc[cloKey]) {
                        acc[cloKey] = [0, 0]
                    }
                    if (cloObj[cloKey] === 1) {
                        acc[cloKey][0] += 1
                    } else if (cloObj[cloKey] === 0) {
                        acc[cloKey][1] += 1
                    }
                })
                return acc
            }, {})
        )
    }

    return (
        <div className="marks-list">
            <h2>PLAN</h2>

            <table>
                <tbody>
                    <tr>
                        <th>Heads/CLOs</th>
                        {clo.map((number, index) => (
                            <th key={`key-${index}`}>{number}</th>
                        ))}
                        <th>Total</th>
                    </tr>
                    {Object.entries(Object.groupBy(PLAN, ({ head }) => head)).map(([h]) => {
                        let sumCLO = 0
                        return (
                            <tr key={h}>
                                <th style={{ textAlign: 'left' }}>{h}</th>
                                {clo.map((number) => {
                                    const val = planByHeadAndClo[h]?.[number] ?? 0
                                    sumCLO += val
                                    return <td key={`key-${number}`}>{val || ''}</td>
                                })}
                                <td>{sumCLO}</td>
                            </tr>
                        )
                    })}
                    <tr>
                        <th style={{ textAlign: 'left' }}>Total</th>
                        {cloHdr.map(([cloKey, items]) => (
                            <th key={`clo-${cloKey}-total`}>
                                {items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)}
                            </th>
                        ))}
                        <th>
                            {cloHdr.reduce(
                                (grandTotal, [, items]) => grandTotal + items.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                                0
                            )}
                        </th>
                    </tr>
                </tbody>
            </table>
            <h2>Head wise CLOs</h2>
            <table>
                <tbody>
                    {data.map((row, rowIndex) => (
                        rowIndex === 0 ? (
                            <tr key={`row-${rowIndex}`}>
                                {hdr.map((h, index) => (
                                    <th key={`cell-${rowIndex}-${index}`} colSpan={h.span}>{h.head}</th>
                                ))}
                            </tr>
                        ) : (
                            <tr key={`row-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`cell-${rowIndex}-${cellIndex}`} style={{ textAlign: cellIndex === 1 && 'left' }}>{cell ?? ''}</td>
                                ))}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
            <h2>Recap Sheet</h2>
            <table>
                <tbody>
                    {data.map((row, rowIndex) => (
                        rowIndex === 1 || rowIndex === 2 ? null : rowIndex === 0 ? (
                            <tr key={`row-${rowIndex}`}>
                                <th>SNo</th>
                                <th>Name</th>
                                <th>Reg.No</th>
                                {hdr.splice(1).map((h, index) => (
                                    <th key={`cell-${rowIndex}-${index}`} colSpan={h.span}>{h.head}</th>
                                ))}
                            </tr>
                        ) : (
                            <tr key={`row-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                    <td key={`cell-${rowIndex}-${cellIndex}`} style={{ textAlign: cellIndex === 1 && 'left' }}>{cell ?? ''}</td>
                                ))}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
            {console.log(Object.entries(Object.groupBy(PLAN, ({ head }) => head)))}
            {console.log(hdr)}
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
            <table>
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
                    {data.slice(4).map((row, rowIndex) => {
                        stdCLOs.regno = row[2].toString()
                        stdCLOs.name = row[1]
                        const cloCells = cloHdr.flatMap(([cloKey, items]) => {
                            const stdTotal = items.reduce((sum, item) => sum + (Number(row[item.sno + 2]) || 0), 0)
                            const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
                            const achieved = cloTotal ? (stdTotal / cloTotal * 100).toFixed(2) + '%' : '0%'
                            stdCLOs[`CLO${cloKey}`] = parseFloat(achieved) <= kpi ? 0 : 1
                            return [
                                ...items.map((item, index) => (
                                    <td key={`cell-${rowIndex}-${cloKey}-${index}`}>
                                        {row[item.sno + 2] ?? ''}
                                    </td>
                                )),
                                <td
                                    key={`cell-${rowIndex}-${cloKey}-total`}
                                    style={{ color: parseFloat(achieved) <= kpi ? 'red' : 'black', fontWeight: parseFloat(achieved) <= kpi ? 'bold' : 'normal' }}
                                >
                                    {stdTotal}
                                </td>,
                                <td
                                    key={`cell-${rowIndex}-${cloKey}-achieved`}
                                    style={{ color: parseFloat(achieved) <= kpi ? 'red' : 'black', fontWeight: parseFloat(achieved) <= kpi ? 'bold' : 'normal' }}
                                >
                                    {achieved}
                                </td>
                            ]
                        })
                        calCLOs.push({ ...stdCLOs })
                        return (
                            <tr key={`row-${rowIndex}`}>
                                <td>{row[0]}</td>
                                <td style={{ textAlign: 'left' }}>{row[1]}</td>
                                <td>{row[2]}</td>
                                {cloCells}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <h2>CLO Achievement Summary</h2>
            <table>
                <thead>
                    <tr>
                        <th>CLO</th>
                        <th>Achieved</th>
                        <th>Not Achieved</th>
                        <th>Achieved %</th>
                    </tr>
                </thead>
                <tbody>
                    {cloSummary(calCLOs).map(([cloKey, [achievedCount, notAchievedCount]]) => {
                        const totalCount = achievedCount + notAchievedCount
                        const achievedPct = totalCount ? ((achievedCount / totalCount) * 100).toFixed(2) : '0.00'
                        return (
                            <tr key={`cal-${cloKey}`}>
                                <td>{cloKey}</td>
                                <td>{achievedCount}</td>
                                <td>{notAchievedCount}</td>
                                <td>{achievedPct}%</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <h2>CLO Achievement Charts</h2>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '16px', overflowX: 'auto', alignItems: 'flex-start' }}>
                {cloSummary(calCLOs).map(([cloKey, [achievedCount, notAchievedCount]]) => {
                    const totalCount = achievedCount + notAchievedCount
                    const achievedPct = totalCount ? ((achievedCount / totalCount) * 100).toFixed(2) : '0.00'
                    const notAchievedPct = totalCount ? ((notAchievedCount / totalCount) * 100).toFixed(2) : '0.00'
                    return (
                        <div
                            key={`cal-${cloKey}`}
                            style={{ flex: '0 0 320px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                        >
                            <span style={{ fontSize: '13px' }}>Achieved: {achievedCount} | {achievedPct}%</span>
                            <span style={{ fontSize: '13px' }}>Not Achieved: {notAchievedCount} | {notAchievedPct}%</span>
                            <PLOChart label={`${cloKey} Achievement`} achieved={Number(achievedPct)} notAchieved={100 - Number(achievedPct)} />
                        </div>
                    )
                })}
            </div>

            <h2>Summary</h2>
            <table>
                <tbody>
                    {data[ENUMS.HEADS].slice(3).map((head, index) => {
                        const currentHead = data[ENUMS.HEADS][index + 3]
                        if (currentHead !== null) {
                            previousHead = currentHead
                        }
                        const chead = previousHead

                        return (
                            <tr key={`row-cells-${index}`}>
                                <td>{sno++}</td>
                                <td>{chead}</td>
                                <td>{data[ENUMS.CLO][index + 3] ?? ''}</td>
                                <td>{data[ENUMS.MAX][index + 3] ?? ''}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </div>
    )
}

export default MarksList
