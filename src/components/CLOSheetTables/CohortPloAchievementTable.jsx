import { grades } from './CLOSheetHelpers'

export default function CohortPloAchievementTable({ cohort, cohortPloColumns, totals, kpi }) {
    return (
        <>
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
                        const { regno: _regno, name: _name, ...stdPLOTotal } = student;
                        const stdTotal = Math.round(Object.values(stdPLOTotal).reduce((sum, val) => sum + (Number(val) || 0), 0))
                        const grade = grades.find(({ start, end }) => stdTotal >= start && stdTotal <= end)?.grade ?? ''
                        const sumPLOs = Object.fromEntries(cohortPloColumns.map((ploKey) => [ploKey, 0]))

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
        </>
    )
}
