/* eslint-disable no-unused-vars */

import { Fragment, useState, use, useEffect } from 'react'
import PLOChart from './PLOChart'
import { useSheetStore } from '../store/sheetStore.js'
import { useRecapStore } from '../store/recapStore.js'
import './CLOSheet.css'

const ENUMS = Object.freeze({
    HEADS: 0,
    CLO: 1,
    // QUESTIONS: 2,
    MAX: 2
})

const grades = [
    { "start": 90, "end": 100, "grade": "A+", "gpa": 4 },
    { "start": 85, "end": 89, "grade": "A", "gpa": 3.75 },
    { "start": 80, "end": 84, "grade": "A-", "gpa": 3.5 },
    { "start": 75, "end": 79, "grade": "B+", "gpa": 3.25 },
    { "start": 70, "end": 74, "grade": "B", "gpa": 3 },
    { "start": 66, "end": 69, "grade": "B-", "gpa": 2.75 },
    { "start": 63, "end": 65, "grade": "C+", "gpa": 2.5 },
    { "start": 60, "end": 62, "grade": "C", "gpa": 2 },
    { "start": 55, "end": 59, "grade": "C-", "gpa": 1.5 },
    { "start": 0, "end": 54, "grade": "F", "gpa": 0 }
]


function CLOSheet({ closid, rid }) {

    // Group and sum marks by first word for display
    const { getCLOSheet } = useSheetStore()
    const { getRecapResource } = useRecapStore()
    const { recap } = use(getRecapResource(rid))

    const incomingData = use(getCLOSheet(closid))
    const [kpi, setKpi] = useState(50)
    console.log(incomingData)
    const { data: rawData, clo: cloRows = [], withdraws = [], report: savedReport = {}, error } = incomingData ?? {}
    const hasSheetData = Array.isArray(rawData)
        && Array.isArray(rawData[ENUMS.HEADS])
        && Array.isArray(rawData[ENUMS.CLO])
        && Array.isArray(rawData[ENUMS.MAX])
    const data = hasSheetData ? rawData : [[], [], []]

    // console.log(recap)

    const arr = data[ENUMS.CLO].slice(3)
    // const clo = [...new Set(arr.filter((x) => typeof x === 'number'))]

    // Access gradeChart and setter from zustand store
    const {
        gradeChart,
        setGradeChart,
        recap: globalRecap,
        setRecap,
        groupedPlanTotals: globalGroupedPlanTotals,
        setGroupedPlanTotals,
        calCLOs: globalCalCLOs,
        setCalCLOs,
        aggPLOs: globalAggPLOs,
        setAggPLOs,
        cloSid,
        setCLOSid,
        report: globalReport,
        
        cloSummary
    } = useSheetStore(state => state)
    // setGradeChart(localGradeChart)

    // unique numeric CLOs sorted ascending
    const clo = Array.from(new Set(arr.map((x) => {
        const n = Number(x)
        return Number.isNaN(n) ? null : n
    }).filter((x) => x !== null))).sort((a, b) => a - b)


    function groupPlanByFirstWord(planRows) {
        const result = {};
        planRows.forEach(row => {
            if (typeof row.head !== 'string' || !row.head) return;
            const key = row.head.split(' ')[0]; // Split by non-breaking space and take the first part

            const mark = Number(row.total) || 0;
            result[key] = (result[key] || 0) + mark;
        });

        return result;
    }

    const headsCleaned = data[ENUMS.HEADS].map(h =>
        typeof h === 'string' ? h.replace(/\s*Paper\s*1/g, '') : h
    )

    let sno = 1
    let previousHead = ''

    const PLAN = headsCleaned.slice(3).map((head, index) => {
        const currentHead = headsCleaned[index + 3]
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

    // console.log(PLAN)

    // Now safe to calculate groupedPlanTotals
    const groupedPlanTotals = groupPlanByFirstWord(PLAN);
    const groupedPlanTotalsKey = JSON.stringify(groupedPlanTotals)
    const globalGroupedPlanTotalsKey = JSON.stringify(globalGroupedPlanTotals)
    sno = 1
    const cloHdr = Object.entries(Object.groupBy(PLAN, ({ clo }) => clo))
    const calCLOs = data.slice(3).map((row) => {
        const studentCLOs = {
            regno: row[2]?.toString() ?? '',
            name: row[1]
        }

        cloHdr.forEach(([cloKey, items]) => {
            const isWithdrawn = withdraws.includes(row[2])
                || withdraws.includes(String(row[2]))
            const stdTotal = items.reduce((sum, item) => sum + (Number(row[item.sno + 2]) || 0), 0);
            const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
            const achieved = cloTotal ? (stdTotal / cloTotal * 100) : 0
            studentCLOs[`CLO${cloKey}`] = isWithdrawn ? 0 : achieved < kpi ? 0 : 1
        })

        return studentCLOs
    })

    // console.log(calCLOs)
    console.log(cloSummary(calCLOs, clo))

    const ploMap = (recap?.clo ?? []).reduce((acc, cloRow) => {
        const cloNo = Number(cloRow.clo)
        const ploNo = Number(cloRow.plo)
        if (!Number.isNaN(cloNo) && !Number.isNaN(ploNo)) {
            acc[cloNo] = ploNo
        }
        return acc
    }, {})
    // console.log(ploMap)
    const totals = {};
    const cohort = data.slice(3).map((row) => {
        const stdPLOs = {
            regno: row[2]?.toString() ?? '',
            name: row[1]
        }
        const cohort = { ...stdPLOs }
        //const plos = [...new Set(recap.clo.map(c => c.plo).sort((a, b) => a - b))]

        cloHdr.forEach(([cloKey, items]) => {
            const stdTotal = items.reduce((sum, item) => sum + (Number(row[item.sno + 2]) || 0), 0);
            const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
            //stdPLOs[`PLO${cloKey}`] = [stdTotal, cloTotal]
            // Map CLO to PLO using ploMap
            const ploKey = ploMap[cloKey]
            if (!ploKey) {
                return
            }

            stdPLOs[`PLO${ploKey}`] = stdPLOs[`PLO${ploKey}`] || [0, 0]
            stdPLOs[`PLO${ploKey}`][0] += stdTotal
            stdPLOs[`PLO${ploKey}`][1] += cloTotal
            cohort[`PLO${ploKey}`] = stdPLOs[`PLO${ploKey}`][0]
            totals[`PLO${ploKey}`] = stdPLOs[`PLO${ploKey}`][1]

        })
        // console.log(stdPLOs)
        return cohort
    })
    //console.log([...new Set(recap.clo.map(c => c.plo).sort((a, b) => a - b))])
    // console.log(cohort);

    const cohortPloColumns = Array.from(
        new Set(cohort.flatMap((student) => Object.keys(student).filter((key) => key.startsWith('PLO'))))
    ).sort((a, b) => Number(a.replace('PLO', '')) - Number(b.replace('PLO', '')))

    const aggPLOs = cohort.reduce((acc, student) => {
        const { regno, name, ...stdPLOTotal } = student
        const stdTotal = Math.round(Object.values(stdPLOTotal).reduce((sum, val) => sum + (Number(val) || 0), 0))
        const grade = grades.find(({ start, end }) => stdTotal >= start && stdTotal <= end)?.grade ?? ''

        cohortPloColumns.forEach((ploKey) => {
            const studentPlo = Number(student[ploKey]) || 0
            const ploTotal = Number(totals[ploKey]) || 0
            const achieved = ploTotal ? (studentPlo / ploTotal * 100) : 0
            const achievedFlag = grade === 'F' ? 0 : achieved < kpi ? 0 : 1

            acc[ploKey] = acc[ploKey] || { achieved: 0, notAchieved: 0, students: [] }
            acc[ploKey].achieved += achievedFlag
            acc[ploKey].notAchieved += grade !== 'F' && achievedFlag === 0 ? 1 : 0
            grade !== 'F' && achievedFlag === 0 && acc[ploKey].students.push({
                regno: student.regno,
                name: student.name,
            })
        })

        return acc
    }, {})
    const aggPLOsKey = JSON.stringify(aggPLOs)
    const globalAggPLOsKey = JSON.stringify(globalAggPLOs ?? {})
    const globalCalCLOsKey = JSON.stringify(globalCalCLOs ?? [])
    const calCLOsKey = JSON.stringify(calCLOs)
    const cloSummaryRows = cloSummary(calCLOs, clo)
    const calculatedGradeChart = Object.fromEntries(grades.map((g) => [g.grade, 0]))
    data.forEach((row, rowIndex) => {
        if (rowIndex > 2) {
            const total = Math.round(row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2))
            const gradeObj = grades.find(({ start, end }) => total >= start && total <= end)
            const gradeName = gradeObj?.grade
            if (gradeName) {
                calculatedGradeChart[gradeName] = (calculatedGradeChart[gradeName] || 0) + 1
            }
        }
    })
    const savedReportKey = JSON.stringify(savedReport ?? {})
    const globalReportKey = JSON.stringify(globalReport ?? {})

    // Update gradeChart in zustand store after rendering recap sheet
    useEffect(() => {
        // Calculate localGradeChart only when data changes
        const safeGradeChart = gradeChart || {}
        // Only update if changed
        const chartChanged = JSON.stringify(calculatedGradeChart) !== JSON.stringify(safeGradeChart)
        if (chartChanged) {
            setGradeChart(calculatedGradeChart)
        }

        // Update recap in store if changed
        if (recap && JSON.stringify(recap) !== JSON.stringify(globalRecap)) {
            setRecap(recap)
        }

        if (groupedPlanTotalsKey !== globalGroupedPlanTotalsKey) {
            setGroupedPlanTotals(groupedPlanTotals)
        }

        if (calCLOsKey !== globalCalCLOsKey) {
            setCalCLOs(calCLOs)
        }

        if (aggPLOsKey !== globalAggPLOsKey) {
            setAggPLOs(aggPLOs)
        }

        if (closid !== null && closid !== undefined && closid !== cloSid) {
            setCLOSid(closid)
        }

    }, [data, gradeChart, calculatedGradeChart, setGradeChart, recap, globalRecap, setRecap, groupedPlanTotals, groupedPlanTotalsKey, globalGroupedPlanTotalsKey, setGroupedPlanTotals, calCLOs, calCLOsKey, globalCalCLOsKey, setCalCLOs, aggPLOs, aggPLOsKey, globalAggPLOsKey, setAggPLOs, closid, cloSid, setCLOSid, savedReport, savedReportKey, globalReportKey])

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
    // Clean head names in hdr as well
    const hdr = Object.values(
        data[ENUMS.HEADS].reduce((acc, item) => {
            let cleanItem = (typeof item === 'string') ? item.replace(/\s*Paper\s*1/g, '') : item;
            if (cleanItem !== null) {
                key = cleanItem
                acc[key] = { head: key, span: 1 }
            } else if (key) {
                acc[key].span += 1
            }
            return acc
        }, {})
    )
    const recapHeads = hdr.slice(3)
    const recapHeadRanges = recapHeads.reduce((acc, head) => {
        const lastEnd = acc.length ? acc[acc.length - 1].end : 3
        acc.push({ head: typeof head.head === 'string' ? head.head.replace(/\s*Paper\s*1/g, '') : head.head, start: lastEnd, end: lastEnd + head.span })
        return acc
    }, [])

    if (!hasSheetData) {
        return (
            <div className="marks-list">
                <p>{error || 'No CLO sheet data available.'}</p>
            </div>
        )
    }

    return (
        <div className="marks-list">
            {/* rid = {rid} closid = {closid} */}
            <h3>Grouped PLAN Totals pnm </h3>
            <table id="grouped-plan-totals">
                <thead>
                    <tr>
                        <th>Group</th>
                        <th>Total Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedPlanTotals).map(([group, total]) => (
                        <tr key={group}>
                            <td>{group}</td>
                            <td>{total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>PLAN</h2>

            <table id="plan">
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
                        // Clean head for display
                        const cleanHead = typeof h === 'string' ? h.replace(/\s*Paper\s*1/g, '') : h;
                        //console.log(cleanHead)
                        return (
                            <tr key={h}>
                                <th style={{ textAlign: 'left' }}>{cleanHead}</th>
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
            <table id="head-clo">
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
                                    <td key={`cell-${rowIndex}-${cellIndex}`} style={{ textAlign: cellIndex === 1 && 'left' }}>{cellIndex > 2 ? Number(cell).toString() : cell ?? ''}</td>
                                ))}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
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
                                        return <td key={`recap-${rowIndex}-${head}`} style={style}>{sum}</td>
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
                                    <td key={`cell-${rowIndex}-${cloKey}-${index}`}>
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
                                <td style={{ textAlign: 'left' }}>{safeRow[1] ?? ''}</td>
                                <td>{safeRow[2] ?? ''}</td>
                                {cloCells}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <h2>CLO Achievement Summary</h2>
            <table id="clo-summary">
                <thead>
                    <tr>
                        <th>CLO</th>
                        <th style={{width: '100px'}}>Achieved</th>
                        <th style={{width: '100px'}}>Not Achieved</th>
                        {/* <th>Achieved %</th> */}
                    </tr>
                </thead>
                <tbody>
                    {cloSummaryRows.map(([cloKey, [achievedCount, notAchievedCount]]) => {
                        const totalCount = achievedCount + (notAchievedCount)
                        const achievedPct = totalCount ? ((achievedCount / totalCount) * 100).toFixed(2) : '0.00'
                        const notAchievedPct = totalCount ? ((notAchievedCount / totalCount) * 100).toFixed(2) : '0.00'
                        return (
                            <tr key={`cal-${cloKey}`}>
                                <td>{cloKey}</td>
                                <td>{achievedCount}
                                    <span style={{  
                                        border: '1px solid #028c0040', 
                                        borderRadius: '4px', 
                                        fontSize: '12px',
                                        marginLeft: '10px', padding: '2px 4px'}}>
                                        {achievedPct}%
                                    </span> </td>
                                <td>{notAchievedCount}
                                    <span style={{  
                                        border: '1px solid #4b444440', 
                                        borderRadius: '4px', 
                                        fontSize: '12px',
                                        marginLeft: '10px', padding: '2px 4px'}}>
                                        {notAchievedPct}%
                                    </span> </td>
                                {/* <td>{achievedPct}%</td> */}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <h2>CLO Achievement Charts</h2>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '16px', overflowX: 'auto', alignItems: 'flex-start' }}>
                {cloSummaryRows.map(([cloKey, [achievedCount, notAchievedCount]]) => {
                    const totalCount = achievedCount + notAchievedCount
                    const achievedPct = totalCount ? ((achievedCount / totalCount) * 100).toFixed(2) : '0.00'
                    const notAchievedPct = totalCount ? ((notAchievedCount / totalCount) * 100).toFixed(2) : '0.00'
                    return (
                        <div
                            key={`cal-${cloKey}`}
                            style={{ flex: '0 0 320px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '13px' }}>Achieved: {achievedCount} | {achievedPct}%</span>
                            <span style={{ fontSize: '13px' }}>Not Achieved: {notAchievedCount} | {notAchievedPct}%</span>
                            <PLOChart label={`${cloKey} Achievement`} achieved={Number(achievedPct)} notAchieved={100 - Number(achievedPct)} />
                        </div>
                    )
                })}
            </div>
            <h2>Cohort PLO Achievement</h2>
            <table id="cohort-plo-achievement">
                <thead>
                    <tr>
                        <th>SNo</th>
                        <th>Name</th>
                        <th>Reg.No</th>
                        {cohortPloColumns.map((ploKey) => (
                            <th key={`cohort-head-${ploKey}`}>{ploKey}</th>
                        ))}
                        <th>Total</th>
                        <th>Grade</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        {Object.entries(totals).map((total, index) => (
                            <th key={`cohort-total-${index}`}>{total[1]}</th>
                        ))}
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cohort.map((student, index) => {
                        // console.log(student)
                        const { regno, name, ...stdPLOTotal } = student;
                        const stdTotal = Math.round(Object.values(stdPLOTotal).reduce((sum, val) => sum + (Number(val) || 0), 0))
                        const grade = grades.find(({ start, end }) => stdTotal >= start && stdTotal <= end)?.grade ?? ''
                        const sumPLOs = Object.fromEntries(cohortPloColumns.map((ploKey) => [ploKey, 0]))

                        // console.log(sumPLOs)
                        return (
                            <tr key={`cohort-row-${student.regno || index}`}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: 'left' }}>{student.name}</td>
                                <td>{student.regno}</td>
                                {cohortPloColumns.map((ploKey) => {
                                    const studentPlo = Number(student[ploKey]) || 0
                                    const ploTotal = Number(totals[ploKey]) || 0
                                    const achieved = ploTotal ? (studentPlo / ploTotal * 100) : 0
                                    sumPLOs[ploKey] = grade === 'F' ? 0 : achieved < kpi ? 0 : 1
                                    return (
                                        <td key={`cohort-cell-${student.regno || index}-${ploKey}`}
                                            style={{
                                                color: sumPLOs[ploKey] === 0 ? 'red' : 'black',
                                                fontWeight: sumPLOs[ploKey] === 0 ? 700 : 400,
                                                backgroundColor: grade !== 'F' && sumPLOs[ploKey] === 0 ? '#CCC1DA' : 'transparent'
                                            }}
                                        >
                                            {student[ploKey] == null ? '' : Number(student[ploKey]).toFixed(2)}
                                        </td>
                                    )
                                })}
                                <td>{stdTotal}</td>
                                <td>{grade}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {/* {console.log(aggPLOs)} */}

            {/* <h2>Summary</h2>
            <table id="summary">
                <tbody>
                    {data[ENUMS.HEADS].slice(3).map((head, index) => {
                        const currentHead = data[ENUMS.HEADS][index + 3]
                        if (currentHead !== null) {
                            previousHead = currentHead
                        }
                        // Clean chead for display
                        const chead = typeof previousHead === 'string' ? previousHead.replace(/\s*Paper\s*1/g, '') : previousHead

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
            </table> */}

        </div>
    )
}

export default CLOSheet
