export default function HeadCloTable({ data, hdr }) {
    return (
        <>
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
        </>
    )
}
