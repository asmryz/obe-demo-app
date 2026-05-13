import PLOChart from '../PLOChart'

export default function CloAchievementCharts({ cloSummaryRows }) {
    return (
        <>
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
        </>
    )
}
