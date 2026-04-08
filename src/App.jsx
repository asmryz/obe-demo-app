import { Suspense, useState } from 'react'
import './App.css'
import MarksList from './components/MarksList'
import FileUpload from './components/FileUpload'
import { useEffect } from 'react'
import Tabs from './components/Tabs'
import CRRComponent from './components/CRRComponent'


function App() {
    const [sheetData, setSheetData] = useState(null)

    // useEffect(() => {
    //     setSheetData([
    //         ["Heads", null, null, "Quiz 1", "Quiz 2", "Midterm", null, null, null, "Quiz 3", "CEP", "Final Exam", null, null, null],
    //         ["CLO", null, null, 1, 2, 1, 1, 2, 2, 3, 4, 1, 2, 3, 4],
    //         ["Questions", null, null, null, null, "Q1", "Q2", "Q3", "Q4", null, null, "Q1", "Q2", "Q3", "Q4"],
    //         ["SNo", "Name", "Reg.No", 10, 10, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10],
    //         [1, "Muhammad Huzaifa Ghafoor", 1945116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //         [2, "Muhammad Azaan Mirza", 2045115, 10, 9, 1, 2, 4, 1.5, 8, 7, 4, 8, 4, 9],
    //         [3, "Sher Bahadur", 2045154, 6.5, 6, 1, 2, 3, 0, 6.5, 5, 1, 1, 1, 3],
    //         [4, "Abdul Mueed Shaikh", 2145120, 10, 9, 3, 2, 3, 1, 10, 7, 1, 5, 3, 1],
    //         [5, "Hassin Sikander", 2245102, 10, 7.5, 5, 4, 4, 3, 10, 9, 6.5, 6, 7, 8],
    //         [6, "Hussain Hasnain", 2245103, 10, 7.5, 5, 4, 5, 4.5, 9, 9, 7, 10, 9, 10],
    //         [7, "Mohammad Shabbir Tarwari", 2245104, 10, 8.5, 4, 4, 5, 4.5, 9, 9, 6, 10, 7, 8],
    //         [8, "Ahmad Foad", 2245110, 10, 6, 3, 3, 4, 1, 7, 7, 4, 7, 7, 9],
    //         [9, "Ali Khan Mashori", 2245111, 10, 8, 0, 2.5, 2, 4, 9, 6, 3, 3, 5, 8],
    //         [10, "Jawwad Raza", 2245115, 10, 8.5, 2, 2.5, 0, 1, 9, 6, 1.5, 2, 6, 8],
    //         [11, "Rayyan Ahmed Thakur", 2245118, 10, 10, 1, 4, 4, 3, 8, 7, 10, 5, 9, 9],
    //         [12, "Syed Faaiz Raza Zaidi", 2245120, 10, 8.5, 0, 2, 3, 3, 7, 6, 0, 7, 4, 7],
    //         [13, "Zain Ul Abedien Raza", 2245123, 8.5, 6, 5, 2, 3, 2, 6, 6, 0, 0, 0, 0],
    //         [14, "Um E Abiha", 2245124, 4.5, 7.5, 4, 4, 4, 0, 10, 7, 0, 2, 5, 8],
    //         [15, "Hunain Muhammad Iqbal", 2245126, 7.5, 6, 5, 4, 4, 4, 4.5, 7, 10, 10, 8, 10]
    //     ]) // Clear previous data when the component mounts
    // }, [])


    const tabData = [
        {
            label: "Home",
            content: (
                <div>
                    <h2>🏠 Home</h2>
                    <p>Welcome to the home page.</p>
                </div>
            ),
        },
        {
            label: "Profile",
            content: (
                <div>
                    <h2>👤 Profile</h2>
                    <p>This is your profile information.</p>
                </div>
            ),
        },
        {
            label: "Settings",
            content: (
                <div>
                    <h2>⚙️ Settings</h2>
                    <p>Manage your preferences here.</p>
                </div>
            ),
        },
    ];



    const handleDataLoaded = (allSheets) => {
        const firstSheetName = Object.keys(allSheets)[0]
        const rows = firstSheetName ? allSheets[firstSheetName] : null
        setSheetData(rows)
    }

    return (
        <main>
            <h1>OBE Demo</h1>
            <div style={{ padding: "20px" }}>
                <Tabs tabs={tabData} />
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
            {sheetData ? (
                <Suspense fallback={<p>Loading student marks...</p>}>
                    <MarksList data={sheetData} />
                </Suspense>
            ) : (
                <p>Please upload an Excel file to view marks.</p>
            )}
            <CRRComponent />

        </main>
    )
}

export default App
