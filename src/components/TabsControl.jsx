import React from 'react'
import Tabs from './Tabs';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import CRRComponent from './CRRComponent'
import { RecapSheets } from './RecapSheets';

function TabsControl() {
    const ref = useRef();
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