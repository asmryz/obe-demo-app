import { Suspense, useState } from 'react'
import './App.css'
import MarksList from './components/MarksList'
import FileUpload from './components/FileUpload'

function App() {
    const [sheetData, setSheetData] = useState(null)

    const handleDataLoaded = (allSheets) => {
        const firstSheetName = Object.keys(allSheets)[0]
        const rows = firstSheetName ? allSheets[firstSheetName] : null
        setSheetData(rows)
    }

    return (
        <main>
            <h1>OBE Demo</h1>
            <FileUpload onDataLoaded={handleDataLoaded} />
            {sheetData ? (
                <Suspense fallback={<p>Loading student marks...</p>}>
                    <MarksList data={sheetData} />
                </Suspense>
            ) : (
                <p>Please upload an Excel file to view marks.</p>
            )}
        </main>
    )
}

export default App
