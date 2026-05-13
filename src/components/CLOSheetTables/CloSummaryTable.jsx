export default function CloSummaryTable({ cloSummaryRows }) {
    return (
        <>
            <h2>CLO Achievement Summary</h2>
            <table id="clo-summary">
                <thead>
                    <tr>
                        <th>CLO</th>
                        <th style={{width: '100px'}}>Achieved</th>
                        <th style={{width: '100px'}}>Not Achieved</th>
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
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}
