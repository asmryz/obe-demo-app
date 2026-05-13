import React, { useState, useEffect, use, Suspense } from 'react';
import Table from '../components/Table';
import { store, useStore } from '../store';

function RecapSheets() {
    const { recaps, getRecaps } = useStore();
    // console.log(recaps);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        getRecaps();
        setIsVisible(true);
    }, []);

    return (
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
                <h2 className="text-3xl font-normal text-gray-900 mb-8">Recap Sheets</h2>
                <div className="flex flex-col gap-4">
                    <Suspense fallback={<div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading recaps...</div>}>
                        <Table data={recaps} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default RecapSheets;