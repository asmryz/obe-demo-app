import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CloAchievementCharts, CloHeadTable, CloSummaryTable, PlanTable, RecapSheetTable, GradeSummaryTable, GradeDistributionChart, HeadCloTable, CohortPloAchievementTable } from "../components/CLOSheetTables";
import { getArr, getClo, getHeadsCleaned, getPlan, ENUMS, getHdr, getRecapHeads, getRecapHeadRanges, grades, groupPlanByFirstWord } from "../components/CLOSheetTables/CLOSheetHelpers";
import Tabs from "../components/Tabs";
import { useStore } from "../store";
import { useRef } from "react";
import { MoreVertical, Trash2, MessageSquare, HelpCircle, Download, Share2, Settings, Printer } from "lucide-react";
import CRRReport from "../components/CLOSheetTables/CRRReport";
import { useReactToPrint } from 'react-to-print';
import CreatePlan from "../components/CLOSheetTables/CreatePlan";


if (typeof window !== 'undefined' && !window.customElements.get('leo-navdots')) {
    window.customElements.define('leo-navdots', class extends HTMLElement {
        static get observedAttributes() { return ['activedot', 'dotcount']; }
        constructor() {
            super();
            this.attachShadow({ mode: 'open', delegatesFocus: true });
        }
        attributeChangedCallback() {
            this.render();
        }
        connectedCallback() {
            this.render();
        }
        render() {
            const activeDot = parseInt(this.getAttribute('activedot') || '1', 10);
            const dotCount = parseInt(this.getAttribute('dotcount') || '2', 10);
            const currentDotIndex = activeDot - 1;

            const dotsHtml = Array.from({ length: dotCount }, (_, i) => {
                const isActive = i === currentDotIndex;
                return `<li class="svelte-1i791e4">
                    <button class="dot svelte-1i791e4 ${isActive ? 'active' : ''}" aria-current="${isActive ? 'true' : 'false'}" aria-label="Page ${i + 1}" data-index="${i}"></button>
                </li>`;
            }).join('');

            this.shadowRoot.innerHTML = `
                <style>
                    :root{--leo-direction:1}:root[dir=rtl]{--leo-direction:-1}:host{display:block}
                    .leo-navdots.svelte-1i791e4{
                        --dot-size: var(--leo-navdots-size, 8px);
                        --expanded-dot-size: var(--leo-navdots-expanded-size, calc(var(--dot-size) + var(--dot-spacing)));
                        --dot-spacing: var(--leo-navdots-spacing, 10px);
                        --dot-vertical-margin: var(--leo-navdots-vertical-margin, 1px);
                        --transition-duration: var(--leo-navdots-transition-duration, 0.2s);
                        --transition-easing: var(--leo-navdots-easing, ease-in-out);
                        --active-dot-color: var(--leo-navdots-active-color, #4f46e5);
                        --active-dot-color-hover: var(--leo-navdots-active-color-hover, #4338ca);
                        --dot-color: var(--leo-navdots-color, #e2e8f0);
                        --dot-color-hover: var(--leo-navdots-color-hover, #cbd5e1);
                        --current-dot: ${currentDotIndex};
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                    }
                    .leo-navdots.svelte-1i791e4 .dot-container.svelte-1i791e4{
                        display: flex;
                        flex-direction: row;
                        gap: var(--dot-spacing);
                        position: relative;
                        padding: 0 calc(var(--dot-spacing) / 2);
                        margin: 0;
                        list-style: none;
                    }
                    .leo-navdots.svelte-1i791e4 .dot-container.svelte-1i791e4>li.svelte-1i791e4{
                        display: flex;
                    }
                    .leo-navdots.svelte-1i791e4 .dot.svelte-1i791e4{
                        all: unset;
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                        margin: var(--dot-vertical-margin) 0;
                        width: var(--dot-size);
                        height: var(--dot-size);
                        border-radius: var(--dot-size);
                        background: var(--dot-color);
                        transition: background-color var(--transition-duration) var(--transition-easing), box-shadow var(--transition-duration) var(--transition-easing);
                    }
                    .leo-navdots.svelte-1i791e4 .dot.svelte-1i791e4:hover{
                        background-color: var(--dot-color-hover);
                    }
                    .leo-navdots.svelte-1i791e4 .active-dot.svelte-1i791e4{
                        cursor: pointer;
                        position: absolute;
                        transition: transform var(--transition-duration) var(--transition-easing), box-shadow var(--transition-duration) var(--transition-easing);
                        transform: translate(calc(((var(--dot-size) + var(--dot-spacing)) * var(--current-dot) - var(--dot-spacing) / 2) * var(--leo-direction, 1)), 0);
                        width: calc(var(--dot-size) + var(--dot-spacing));
                        height: calc(var(--dot-size) + var(--dot-vertical-margin) * 2);
                        border-radius: var(--dot-size);
                        background: var(--active-dot-color);
                    }
                    .leo-navdots.svelte-1i791e4 .active-dot.svelte-1i791e4:hover{
                        background: var(--active-dot-color-hover);
                    }
                </style>
                <nav class="leo-navdots svelte-1i791e4" aria-label="Pagination">
                    <ol class="dot-container svelte-1i791e4" style="--current-dot: ${currentDotIndex}">
                        ${dotsHtml}
                        <li aria-hidden="true" class="active-dot svelte-1i791e4"></li>
                    </ol>
                </nav>
            `;

            this.shadowRoot.querySelectorAll('.dot').forEach(button => {
                button.addEventListener('click', (e) => {
                    const idx = parseInt(button.getAttribute('data-index'), 10);
                    this.setAttribute('activedot', String(idx + 1));
                    this.dispatchEvent(new CustomEvent('dotchange', {
                        detail: { activeDot: idx + 1 },
                        bubbles: true,
                        composed: true
                    }));
                });
            });
        }
    });
}

export default function CLOSheet() {
    const { closid } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const moreMenuRef = useRef(null);
    const [kpi, setKpi] = useState(50);
    const [activeDot, setActiveDot] = useState(1);
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        // documentTitle: "My Document",
    });


    const navdotsRef = useCallback((node) => {
        if (node) {
            const handleDotChange = (e) => {
                setActiveDot(e.detail.activeDot);
            };
            node.addEventListener('dotchange', handleDotChange);
            // Store the listener on the node to allow clean up
            node._handleDotChange = handleDotChange;
        }
    }, []);

    const closheet = useStore((state) => state.closheet);
    const getCLOSheet = useStore((state) => state.getCLOSheet);
    const recap = useStore((state) => state.recap);
    const recaps = useStore((state) => state.recaps);
    const getRecaps = useStore((state) => state.getRecaps);
    const setGradeChart = useStore((state) => state.setGradeChart);
    const setRecap = useStore((state) => state.setRecap);
    const setGroupedPlanTotals = useStore((state) => state.setGroupedPlanTotals);
    const setCalCLOs = useStore((state) => state.setCalCLOs);
    const setAggPLOs = useStore((state) => state.setAggPLOs);
    const setCLOSid = useStore((state) => state.setCLOSid);
    const setWithdraws = useStore((state) => state.setWithdraws);
    const globalGradeChart = useStore((state) => state.gradeChart);
    const globalRecap = useStore((state) => state.recap);
    const globalGroupedPlanTotals = useStore((state) => state.groupedPlanTotals);
    const globalCalCLOs = useStore((state) => state.calCLOs);
    const globalAggPLOs = useStore((state) => state.aggPLOs);
    const globalCloSid = useStore((state) => state.cloSid);
    const globalWithdraws = useStore((state) => state.withdraws);

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


    useEffect(() => {
        if (closid) {
            getCLOSheet(closid);
        }
        setIsVisible(true);
    }, [closid, getCLOSheet]);

    useEffect(() => {
        if (!recaps || recaps.length === 0) {
            getRecaps();
        }
    }, [recaps, getRecaps]);

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

    const { data: rawData, withdraws = [], clo: sheetClo = [] } = closheet ?? {};

    const currentRecap = useMemo(() => {
        let r = null;
        if (recap && String(recap.closid) === String(closid)) {
            r = recap;
        } else {
            r = recaps.find(r => String(r.closid) === String(closid));
        }
        if (r) {
            return {
                ...r,
                clo: sheetClo && sheetClo.length > 0 ? sheetClo : (r.clo ?? [])
            };
        }
        return null;
    }, [recap, recaps, closid, sheetClo]);

    const tabs = useMemo(() => {
        if (currentRecap?.status === 0) {
            return ['Plan'];
        }
        return ['Plan', 'CLO Sheet', 'Recap Sheet', 'PLO (Cohort)', 'CRR Report'];
    }, [currentRecap]);

    const [activeTab, setActiveTab] = useState('Plan');
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
    const hdr = getHdr(data);
    const recapHeads = getRecapHeads(hdr);
    const recapHeadRanges = getRecapHeadRanges(recapHeads);

    const groupedPlanTotals = useMemo(() => {
        return groupPlanByFirstWord(PLAN);
    }, [PLAN]);

    const calCLOs = useMemo(() => {
        if (!hasSheetData || !data || data.length <= 3) return [];
        return data.slice(3).map((row) => {
            const studentCLOs = {
                regno: row[2]?.toString() ?? '',
                name: row[1]
            };

            cloHdr.forEach(([cloKey, items]) => {
                const isWithdrawn = withdraws.includes(row[2])
                    || withdraws.includes(String(row[2]));
                const stdTotal = items.reduce((sum, item) => sum + (Number(row[item.sno + 2]) || 0), 0);
                const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
                const achieved = cloTotal ? (stdTotal / cloTotal * 100) : 0;
                studentCLOs[`CLO${cloKey}`] = isWithdrawn ? 0 : achieved < kpi ? 0 : 1;
            });

            return studentCLOs;
        });
    }, [hasSheetData, data, cloHdr, withdraws, kpi]);

    const cohortData = useMemo(() => {
        if (!hasSheetData || !data || data.length <= 3) {
            return { cohort: [], cohortPloColumns: [], totals: {} };
        }

        const cloList = sheetClo && sheetClo.length > 0 ? sheetClo : (currentRecap?.clo ?? []);
        const ploMap = cloList.reduce((acc, cloRow) => {
            const cloNo = Number(cloRow.clo);
            const ploNo = Number(cloRow.plo);
            if (!Number.isNaN(cloNo) && !Number.isNaN(ploNo)) {
                acc[cloNo] = ploNo;
            }
            return acc;
        }, {});

        const totals = {};
        const cohort = data.slice(3).map((row) => {
            const stdPLOs = {
                regno: row[2]?.toString() ?? '',
                name: row[1]
            };
            const cohortItem = { ...stdPLOs };

            cloHdr.forEach(([cloKey, items]) => {
                const stdTotal = items.reduce((sum, item) => sum + (Number(row[item.sno + 2]) || 0), 0);
                const cloTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
                const ploKey = ploMap[cloKey];
                if (!ploKey) {
                    return;
                }

                stdPLOs[`PLO${ploKey}`] = stdPLOs[`PLO${ploKey}`] || [0, 0];
                stdPLOs[`PLO${ploKey}`][0] += stdTotal;
                stdPLOs[`PLO${ploKey}`][1] += cloTotal;
                cohortItem[`PLO${ploKey}`] = stdPLOs[`PLO${ploKey}`][0];
                totals[`PLO${ploKey}`] = stdPLOs[`PLO${ploKey}`][1];
            });
            return cohortItem;
        });

        const cohortPloColumns = Array.from(
            new Set(cohort.flatMap((student) => Object.keys(student).filter((key) => key.startsWith('PLO'))))
        ).sort((a, b) => Number(a.replace('PLO', '')) - Number(b.replace('PLO', '')));

        return { cohort, cohortPloColumns, totals };
    }, [hasSheetData, data, sheetClo, currentRecap, cloHdr]);

    const aggPLOs = useMemo(() => {
        const { cohort, cohortPloColumns, totals } = cohortData;
        if (!cohort || cohort.length === 0) return {};

        return cohort.reduce((acc, student) => {
            const { regno, name, ...stdPLOTotal } = student;
            const stdTotal = Math.round(Object.values(stdPLOTotal).reduce((sum, val) => sum + (Number(val) || 0), 0));
            const grade = grades.find(({ start, end }) => stdTotal >= start && stdTotal <= end)?.grade ?? '';

            cohortPloColumns.forEach((ploKey) => {
                const studentPlo = Number(student[ploKey]) || 0;
                const ploTotal = Number(totals[ploKey]) || 0;
                const achieved = ploTotal ? (studentPlo / ploTotal * 100) : 0;
                const achievedFlag = grade === 'F' ? 0 : achieved < kpi ? 0 : 1;

                acc[ploKey] = acc[ploKey] || { achieved: 0, notAchieved: 0, students: [] };
                acc[ploKey].achieved += achievedFlag;
                acc[ploKey].notAchieved += grade !== 'F' && achievedFlag === 0 ? 1 : 0;
                if (grade !== 'F' && achievedFlag === 0) {
                    acc[ploKey].students.push({
                        regno: student.regno,
                        name: student.name,
                    });
                }
            });

            return acc;
        }, {});
    }, [cohortData, kpi]);

    const gradeSummaryData = useMemo(() => {
        if (!hasSheetData || !data || data.length <= 3) return { chartData: {}, totalStudents: 0 };

        const chartData = Object.fromEntries(grades.map((g) => [g.grade, 0]));
        chartData['W'] = 0; // Support withdrawn students

        let totalStudents = 0;

        data.slice(3).forEach((row) => {
            if (!row || row.length < 3) return;
            totalStudents++;
            const isWithdrawn = withdraws.includes(row[2]) || withdraws.includes(String(row[2]));
            const totalScore = Math.round(row.slice(3).reduce((total, mark) => total + (Number(mark) || 0), 0).toFixed(2));
            const gradeObj = grades.find(({ start, end }) => totalScore >= start && totalScore <= end);
            const gradeName = gradeObj?.grade;
            const finalGrade = isWithdrawn && gradeName === 'F' ? 'W' : gradeName;
            if (finalGrade) {
                chartData[finalGrade] = (chartData[finalGrade] || 0) + 1;
            }
        });

        return { chartData, totalStudents };
    }, [data, hasSheetData, withdraws]);

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

    // Sync calculated local states to zustand store so they are available globally (e.g. for CRR Report)
    useEffect(() => {
        if (!hasSheetData) return;

        const calculatedGradeChart = gradeSummaryData.chartData;

        if (JSON.stringify(calculatedGradeChart) !== JSON.stringify(globalGradeChart)) {
            setGradeChart(calculatedGradeChart);
        }

        if (currentRecap && JSON.stringify(currentRecap) !== JSON.stringify(globalRecap)) {
            setRecap(currentRecap);
        }

        if (JSON.stringify(groupedPlanTotals) !== JSON.stringify(globalGroupedPlanTotals)) {
            setGroupedPlanTotals(groupedPlanTotals);
        }

        if (JSON.stringify(calCLOs) !== JSON.stringify(globalCalCLOs)) {
            setCalCLOs(calCLOs);
        }

        if (JSON.stringify(aggPLOs) !== JSON.stringify(globalAggPLOs)) {
            setAggPLOs(aggPLOs);
        }

        if (closid && closid !== globalCloSid) {
            setCLOSid(closid);
        }

        if (JSON.stringify(withdraws) !== JSON.stringify(globalWithdraws)) {
            setWithdraws(withdraws);
        }
    }, [
        hasSheetData,
        gradeSummaryData.chartData,
        globalGradeChart,
        setGradeChart,
        currentRecap,
        globalRecap,
        setRecap,
        groupedPlanTotals,
        globalGroupedPlanTotals,
        setGroupedPlanTotals,
        calCLOs,
        globalCalCLOs,
        setCalCLOs,
        aggPLOs,
        globalAggPLOs,
        setAggPLOs,
        closid,
        globalCloSid,
        setCLOSid,
        withdraws,
        globalWithdraws,
        setWithdraws
    ]);

    return (
        <div className={`h-full overflow-y-auto px-16 py-6 custom-scrollbar flex flex-col transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-full w-full flex-1 flex flex-col">
                <h2 className="text-3xl font-normal text-gray-900 mb-8">OBE</h2>

                <div className="flex items-start justify-between align-top mb-6">

                    {/* Card and Tabs on Left */}
                    <div className="flex items-start gap-8">
                        {currentRecap ? (
                            <div className="flex flex-col justify-center bg-linear-to-r from-slate-50 to-indigo-50/20 border border-slate-200/60 rounded-2xl px-6 min-h-24 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 min-w-[460px]">
                                {/* Row 1: Code & Title on left, Semester on right */}
                                <div className="flex items-start justify-between gap-8">
                                    <div className="flex items-start gap-3">
                                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold tracking-wide shadow-sm shadow-indigo-100 shrink-0">
                                            {currentRecap.code}
                                        </span>
                                        <span className="font-extrabold text-slate-800 text-base inline-block max-w-[280px] whitespace-normal leading-snug" title={currentRecap.title}>
                                            {currentRecap.title}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600 whitespace-nowrap bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/50 shrink-0">
                                        {currentRecap.semester} {currentRecap.year}
                                    </span>
                                </div>

                                {/* Row 2: Instructor on left (below Title), Batch on right (below Semester) */}
                                <div className="flex items-center justify-between gap-8 mt-3">
                                    {currentRecap.name ? (
                                        <span className="text-sm text-slate-600 font-semibold truncate max-w-[280px]" title={currentRecap.name}>
                                            {currentRecap.name}
                                        </span>
                                    ) : (
                                        <span />
                                    )}
                                    {currentRecap.batch ? (
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200/50 whitespace-nowrap shrink-0">
                                            {currentRecap.batch}
                                        </span>
                                    ) : (
                                        <span />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-24 w-[460px] bg-slate-100 border border-slate-200/60 rounded-2xl animate-pulse" />
                        )}

                        <Tabs
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {/* More Menu on Right */}
                    <div className="flex items-center gap-4">
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

                                    {activeTab === tabs[4] && (
                                        <>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Options
                                            </div>
                                            <button onClick={() => { handlePrint(); setIsMoreMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Printer size={18} className="text-gray-400" />
                                                <span>Print Report</span>
                                            </button>

                                        </>
                                    )}

                                    {activeTab !== tabs[4] && (
                                        <>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                OBE Assessment Actions
                                            </div>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Settings size={18} className="text-gray-400" />
                                                <span>Modify Attainment KPI</span>
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Share2 size={18} className="text-gray-400" />
                                                <span>Share Attainment Sheet</span>
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                <Download size={18} className="text-gray-400" />
                                                <span>Export OBE Layout</span>
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
                                                <span>Reset Attainment Mappings</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative flex-1">
                    {/* Plan Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[0]
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-8 opacity-0 pointer-events-none absolute inset-0 invisible h-0 overflow-hidden'
                            }`}
                    >

                        <div className="flex justify-center">
                            {currentRecap?.status === 0
                                ? <CreatePlan closid={closid} />
                                : <PlanTable closid={closid} />}
                        </div>
                        {/* <ModelCards /> */}
                        {/* <Table /> */}
                    </div>

                    {/* CLO Sheet Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[1]
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0 invisible h-0 overflow-hidden'
                            }`}
                    >
                        <div className="flex justify-center flex-col ">
                            <CloHeadTable data={data} cloHdr={cloHdr} withdraws={withdraws} kpi={kpi} setKpi={setKpi} />

                            <div className="flex flex-col 2xl:flex-row gap-12 items-stretch">
                                <div className="w-full 2xl:w-1/3">
                                    <CloSummaryTable cloSummaryRows={cloSummaryRows} />
                                </div>
                                <div className="w-full 2xl:w-2/3">
                                    <CloAchievementCharts cloSummaryRows={cloSummaryRows} />
                                </div>
                            </div>
                        </div>
                        {/* <AgentCards onOpenModal={() => setIsAgentModalOpen(true)} /> */}
                    </div>
                    {/* Recap Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[2]
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0 invisible h-0 overflow-hidden'
                            }`}
                    >
                        <style>{`
                            .carousel-viewport {
                                width: 100%;
                                overflow: hidden;
                                position: relative;
                            }
                            .carousel-track {
                                display: flex;
                                width: 200%;
                                transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
                            }
                            .carousel-slide {
                                width: 50%;
                                flex-shrink: 0;
                                transition: opacity 0.4s ease-in-out;
                            }
                        `}</style>
                        <div className="flex justify-center flex-col ">
                            {/* recap navigation dots */}
                            <div className="flex justify-center my-2">
                                <leo-navdots
                                    ref={navdotsRef}
                                    dotcount="2"
                                    activedot={activeDot}
                                    style={{
                                        '--leo-navdots-active-color': '#4f46e5',
                                        '--leo-navdots-active-color-hover': '#4338ca',
                                        '--leo-navdots-color': '#e2e8f0',
                                        '--leo-navdots-color-hover': '#cbd5e1'
                                    }}
                                />
                            </div>

                            <div className="carousel-viewport">
                                <div
                                    className="carousel-track"
                                    style={{ transform: `translate3d(${activeDot === 1 ? '0%' : '-50%'}, 0, 0)` }}
                                >
                                    {/* Slide 1: Recap Sheet */}
                                    <div
                                        className="carousel-slide px-1"
                                        style={{ opacity: activeDot === 1 ? 1 : 0, pointerEvents: activeDot === 1 ? 'auto' : 'none' }}
                                    >
                                        <RecapSheetTable data={data} recapHeads={recapHeads} recapHeadRanges={recapHeadRanges} withdraws={withdraws} />

                                        <div className="flex flex-col 2xl:flex-row gap-12 items-stretch mt-6">
                                            <div className="w-full 2xl:w-1/3">
                                                <GradeSummaryTable chartData={gradeSummaryData.chartData} totalStudents={gradeSummaryData.totalStudents} />
                                            </div>
                                            <div className="w-full 2xl:w-2/3">
                                                <GradeDistributionChart chartData={gradeSummaryData.chartData} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Slide 2: CLOwise Heads */}
                                    <div
                                        className="carousel-slide px-1"
                                        style={{ opacity: activeDot === 2 ? 1 : 0, pointerEvents: activeDot === 2 ? 'auto' : 'none' }}
                                    >
                                        <HeadCloTable data={data} hdr={hdr} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PLO (Cohort) Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[3]
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0 invisible h-0 overflow-hidden'
                            }`}
                    >
                        <div className="flex justify-center flex-col">
                            <CohortPloAchievementTable
                                cohort={cohortData.cohort}
                                cohortPloColumns={cohortData.cohortPloColumns}
                                totals={cohortData.totals}
                                kpi={kpi}
                                withdraws={withdraws}
                            />
                        </div>
                    </div>


                    {/* CRR Report Content */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${activeTab === tabs[4]
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0 pointer-events-none absolute inset-0 invisible h-0 overflow-hidden'
                            }`}
                    >
                        <div className="flex justify-center flex-col" ref={printRef}>
                            {/* <Printer
                                size={20}
                                onClick={handlePrint}
                                className="no-print cursor-pointer "
                                title="Print Report"
                            /> */}
                            <CRRReport />
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}