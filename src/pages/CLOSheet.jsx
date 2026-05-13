import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlanTable } from "../components/CLOSheetTables";

export default function CLOSheet() {
    const { closid } = useParams();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);
    return (
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
                <h2 className="text-3xl font-normal text-gray-900 mb-8">CLO Sheet</h2>
                {/* Apps content goes here */}
                {closid}
                <PlanTable closid={closid} />

            </div>
        </div>
    );
}