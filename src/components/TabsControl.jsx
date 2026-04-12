import React from 'react'
import Tabs from './Tabs';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import CRRComponent from './CRRComponent'
import { RecapSheets } from './RecapSheets';
import { Suspense } from 'react';
import FileUpload from './FileUpload';
import CLOSheet from './CLOSheet';
import { useSheetStore } from '../store/sheetStore';

function TabsControl() {
    const ref = useRef();
    const sheetData = useSheetStore((state) => state.sheetData);
    const handlePrint = useReactToPrint({
        contentRef: ref,
        documentTitle: "My Document",
    });

    const tabData = [
        {
            label: "Recap Sheets",
            content: (
                <div>
                    <RecapSheets />
                </div>
            ),
        },
        {
            label: "OBE",
            content: (
                <div>
                    <FileUpload />
                    {sheetData ? (
                        <Suspense fallback={<p>Loading student marks...</p>}>
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <CLOSheet data={sheetData} />
                            </div>
                        </Suspense>
                    ) : (
                        <p>Please upload an Excel file to view marks.</p>
                    )}
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
        {
            label: "CRR",
            content: (
                <>
                    <button onClick={handlePrint}>Print</button>
                    <div ref={ref}>
                        <CRRComponent />
                    </div>
                </>
            ),
        }

    ];

    return (
        <Tabs tabs={tabData} />
    )
}

export default TabsControl