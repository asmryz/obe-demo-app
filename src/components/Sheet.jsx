/* eslint-disable no-unused-vars */

import { useState, use, useEffect } from 'react'
import { useSheetStore } from '../store/sheetStore.js'
import { useRecapStore } from '../store/recapStore.js'
import './CLOSheet.css'
import {
    GroupedPlanTotalsTable,
    PlanTable,
    HeadCloTable,
    RecapSheetTable,
    CloHeadTable,
    CloSummaryTable,
    CloAchievementCharts,
    CohortPloAchievementTable,
    grades,
    groupPlanByFirstWord,
    ENUMS,
    getArr,
    getClo,
    getHeadsCleaned,
    getPlan
} from './CLOSheetTables/index.js';


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

    const arr = getArr(data)
    const clo = getClo(arr)
    const headsCleaned = getHeadsCleaned(data)
    const PLAN = getPlan(headsCleaned, data)

    // console.log(PLAN)

    // Now safe to calculate groupedPlanTotals
    const groupedPlanTotals = groupPlanByFirstWord(PLAN);
    const groupedPlanTotalsKey = JSON.stringify(groupedPlanTotals)
    const globalGroupedPlanTotalsKey = JSON.stringify(globalGroupedPlanTotals)
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

    // Clean head names in hdr as well
    const hdrObj = data[ENUMS.HEADS].reduce((acc, item) => {
        let cleanItem = (typeof item === 'string') ? item.replace(/\s*Paper\s*1/g, '') : item;
        if (cleanItem !== null) {
            acc.lastKey = cleanItem
            acc.result[cleanItem] = { head: cleanItem, span: 1 }
        } else if (acc.lastKey) {
            acc.result[acc.lastKey].span += 1
        }
        return acc
    }, { lastKey: '', result: {} })
    const hdr = Object.values(hdrObj.result)
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
            <GroupedPlanTotalsTable groupedPlanTotals={groupedPlanTotals} />
            <PlanTable clo={clo} PLAN={PLAN} planByHeadAndClo={planByHeadAndClo} cloHdr={cloHdr} />
            <HeadCloTable data={data} hdr={hdr} />
            <RecapSheetTable data={data} recapHeads={recapHeads} recapHeadRanges={recapHeadRanges} withdraws={withdraws} />
            <CloHeadTable data={data} cloHdr={cloHdr} withdraws={withdraws} kpi={kpi} setKpi={setKpi} />
            <CloSummaryTable cloSummaryRows={cloSummaryRows} />
            <CloAchievementCharts cloSummaryRows={cloSummaryRows} />
            <CohortPloAchievementTable cohort={cohort} cohortPloColumns={cohortPloColumns} totals={totals} kpi={kpi} />
        </div>
    )
}

export default CLOSheet
