import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CloHeadTable, CloSummaryTable, PlanTable } from "../components/CLOSheetTables";
import { getArr, getClo, getHeadsCleaned, getPlan, ENUMS } from "../components/CLOSheetTables/CLOSheetHelpers";
import Tabs from "../components/Tabs";
import { useStore } from "../store";
import { useRef } from "react";
import { MoreVertical } from "lucide-react";
import { Trash2 } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Download } from "lucide-react";
import { Share2 } from "lucide-react";
import { Settings } from "lucide-react";
import { useMemo } from "react";

export default function CLOSheet() {
    const { closid } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const moreMenuRef = useRef(null);
    const tabs = ['Plan', 'CLO Sheet']
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [kpi, setKpi] = useState(50);

    const { closheet, getCLOSheet } = useStore();

    useEffect(() => {
        if (closid) {
            getCLOSheet(closid);
        }
        setIsVisible(true);
    }, [closid, getCLOSheet]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setIsMoreMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: rawData, withdraws = [] } = closheet ?? {};
    const hasSheetData = Array.isArray(rawData)
        && Array.isArray(rawData[ENUMS.HEADS])
        && Array.isArray(rawData[ENUMS.CLO])
        && Array.isArray(rawData[ENUMS.MAX]);
    const data = hasSheetData ? rawData : [[], [], []];

    const arr = getArr(data);
    const clo = getClo(arr);
    const headsCleaned = getHeadsCleaned(data);
    const PLAN = getPlan(headsCleaned, data);
    const cloHdr = Object.entries(Object.groupBy(PLAN, ({ clo }) => clo));

    const cloSummaryRows = useMemo(() => {
        if (!cloHdr.length || !data.length) return [];

        return cloHdr.map(([cloKey, items]) => {
            let achievedCount = 0;
            let notAchievedCount = 0;

            data.slice(3).forEach(row => {
                const isWithdrawn = withdraws.includes(row[2]) || withdraws.includes(String(row[2]));
                if (isWithdrawn) return;

                const stdTotal = items.reduce((sum, item) => sum + (Number(row[item.sno + 2]) || 0), 0);
                const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
                const achievedPct = cloTotal ? (stdTotal / cloTotal * 100) : 0;

                if (achievedPct >= kpi) {
                    achievedCount++;
                } else {
                    notAchievedCount++;
                }
            });

            return [cloKey, [achievedCount, notAchievedCount]];
        });
    }, [cloHdr, data, withdraws, kpi]);
    return (
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-full w-full flex-1 flex flex-col">
                <h2 className="text-3xl font-normal text-gray-900 mb-8">OBE</h2>
                {/* Apps content goes here */}
                {closid}

                <div className="flex items-center justify-between mb-6">

                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                    <div className="flex items-center gap-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                            Start building &rarr;
                        </button>
                        <div className="relative" ref={moreMenuRef}>
                            <button
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                className={`p-1.5 rounded-full transition-all duration-200 ${isMoreMenuOpen ? 'bg-gray-100 text-gray-900 shadow-inner' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                            >
                                <MoreVertical size={20} />
                            </button>

                            {isMoreMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-md z-50 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Playground Actions
                                    </div>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <Settings size={18} className="text-gray-400" />
                                        <span>View settings</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <Share2 size={18} className="text-gray-400" />
                                        <span>Share playground</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <Download size={18} className="text-gray-400" />
                                        <span>Export configuration</span>
                                    </button>

                                    <div className="h-px bg-gray-100 my-2" />

                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Support
                                    </div>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <HelpCircle size={18} className="text-gray-400" />
                                        <span>Help & documentation</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <MessageSquare size={18} className="text-gray-400" />
                                        <span>Send feedback</span>
                                    </button>

                                    <div className="h-px bg-gray-100 my-2" />

                                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                        <Trash2 size={18} className="text-red-400" />
                                        <span>Reset to default</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative flex-1">
                    {/* Models Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[0]
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-8 opacity-0 pointer-events-none absolute inset-0'
                            }`}
                    >
                        <div className="flex justify-center"><PlanTable closid={closid} /></div>
                        {/* <ModelCards /> */}
                        {/* <Table /> */}
                    </div>

                    {/* Agents Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[1]
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0'
                            }`}
                    >
                        <div className="flex justify-center flex-col">
                            <CloHeadTable data={data} cloHdr={cloHdr} withdraws={withdraws} kpi={kpi} setKpi={setKpi} />
                            <CloSummaryTable cloSummaryRows={cloSummaryRows} />
                        </div>
                        {/* <AgentCards onOpenModal={() => setIsAgentModalOpen(true)} /> */}
                    </div>
                </div>



            </div>
        </div>
    );
}