import Tabs from './Tabs';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useRef } from 'react';
import CRRComponent from './CRRComponent'
import { RecapSheets } from './RecapSheets';
import { Suspense } from 'react';
import FileUpload from './FileUpload';
import CLOSheet from './CLOSheet';
import { useSheetStore } from '../store/sheetStore';
import CLOList from './CLOList';
import { CLOApply } from './CLOApply';

function TabsControl() {
    const ref = useRef();
    const { cloSid, rid, setRID, setCLOSid, setRecap, setActiveTabIndex, report } = useSheetStore()
    const sheetData = useSheetStore((state) => state.sheetData);
    const hasSelectedRecap = Boolean(rid);
    const handlePrint = useReactToPrint({
        contentRef: ref,
        documentTitle: "My Document",
    });

    useEffect(() => {
        const handlePrintShortcut = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
                event.preventDefault()
                handlePrint()
            }
        }

        window.addEventListener('keydown', handlePrintShortcut)

        return () => {
            window.removeEventListener('keydown', handlePrintShortcut)
        }
    }, [handlePrint])

    const tabData = [
        {
            label: "Recap Sheets",
            content: (
                <div>
                    <RecapSheets />
                </div>
            ),
        },
        ...(hasSelectedRecap && cloSid ? [
            {
                label: "OBE",
                content: (
                    <div>
                        {/* <FileUpload /> */}
                        {sheetData ? (
                            <Suspense fallback={<p>Loading student marks...</p>}>
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <CLOSheet closid={cloSid} rid={rid} />
                                </div>
                            </Suspense>
                        ) : (
                            <p>Please upload an Excel file to view marks.</p>
                        )}
                    </div>
                ),
            },
        ] : []),
        ...(hasSelectedRecap ? [
        {
            label: "CLO Sheet",
            content: (
                <>
                    <CLOApply rid={rid} closid={cloSid} edit={true}/>
                </>
            ),
        },
        ] : []),
        ...(hasSelectedRecap && cloSid ? [
            {
                label: "CRR",
                content: (
                    <>
                        {Object.keys(report || {}).length > 0 && (
                        <button onClick={handlePrint}>Print</button>
                        )}
                        <div ref={ref}>
                            <CRRComponent />
                        </div>
                    </>
                ),
            },
        ] : []),
        {
            label: "CLO List",
            content: (
                <>
                    
                    <div ref={ref}>
                        <CLOList />
                    </div>
                </>
            ),
        }        

    ];

    const handleTabSelect = (index) => {
        if (index === 0) {
            setRID(null);
            setCLOSid(null);
            setRecap(null);
            setActiveTabIndex(0);
        }
    };

    return (
        <Tabs tabs={tabData} onTabSelect={handleTabSelect} />
    )
}

export default TabsControl
