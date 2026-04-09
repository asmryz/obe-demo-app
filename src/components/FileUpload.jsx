import { useState } from 'react'
import * as XLSX from 'xlsx'

function formatSheetsSingleLineRows(allSheets) {
    const sheetBlocks = Object.entries(allSheets).map(([sheetName, rows]) => {
        const rowLines = rows.map((row) => {
            const values = row
                .map((cell) => JSON.stringify(typeof cell === 'string' ? cell.trim() : cell))
                .join(', ')
            return `    [ ${values} ]`
        })

        return `"${sheetName}": [\n${rowLines.join(',\n')}\n  ]`
    })

    return `{\n  ${sheetBlocks.join(',\n  ')}\n}`
}

function FileUpload({ onDataLoaded }) {
    const [formattedOutput, setFormattedOutput] = useState('')

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }

        const reader = new FileReader()

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const allSheets = workbook.SheetNames.reduce((result, sheetName) => {
                const sheet = workbook.Sheets[sheetName]
                result[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null })
                return result
            }, {})

            const formatted = formatSheetsSingleLineRows(allSheets)
            setFormattedOutput(formatted)

            if (onDataLoaded) {
                onDataLoaded(allSheets)
            }
        }

        reader.readAsArrayBuffer(file)
    }

    return (
        <section>
            <label htmlFor="file">Upload Excel File: </label>
            <input id="file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            {formattedOutput && (
                <pre style={{ overflowY: 'auto', textAlign: 'left' }}>{formattedOutput}</pre>
            )}
        </section>
    )
}

export default FileUpload
