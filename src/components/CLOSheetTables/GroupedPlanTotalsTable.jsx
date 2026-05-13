export default function GroupedPlanTotalsTable({ groupedPlanTotals }) {
    return (
        <>
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
        </>
    )
}
