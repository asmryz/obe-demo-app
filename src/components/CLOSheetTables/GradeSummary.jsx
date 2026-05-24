import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { grades } from './CLOSheetHelpers';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export function GradeSummaryTable({ chartData, totalStudents }) {
    if (!chartData || totalStudents === 0) return null;

    // Define all grades in descending order for the table, including W
    const allGradeKeys = [...grades.map(g => g.grade), 'W'];

    return (
        <div className="mt-12 bg-white">
            <div className="overflow-x-auto w-full">
                <table id="grade-summary" className="w-full text-left border-separate border-spacing-0 relative [&_th]:border-b [&_th]:border-gray-200 [&_td]:border-b [&_td]:border-gray-200">
                    <caption className="caption-top text-left pb-4 px-1">
                        <h2 className="text-2xl font-normal text-gray-900">Grade Summary</h2>
                        <p className="text-sm text-gray-500 mt-1">Aggregate count and percentage of students achieving each letter grade.</p>
                    </caption>
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800">Grade</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center w-[120px]">Count</th>
                            <th className="py-2 px-4 font-semibold text-sm text-gray-800 text-center w-[120px]">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allGradeKeys.map((grade) => {
                            const count = chartData[grade] || 0;
                            const percentage = totalStudents ? ((count / totalStudents) * 100).toFixed(1) : '0.0';

                            let badgeColorClass = 'text-gray-700 bg-gray-50 border-gray-200';
                            if (grade.startsWith('A')) {
                                badgeColorClass = 'text-green-700 bg-green-50 border-green-200';
                            } else if (grade.startsWith('B')) {
                                badgeColorClass = 'text-blue-700 bg-blue-50 border-blue-200';
                            } else if (grade.startsWith('C')) {
                                badgeColorClass = 'text-amber-700 bg-amber-50 border-amber-200';
                            } else if (grade === 'F' || grade === 'W') {
                                badgeColorClass = 'text-red-700 bg-red-50 border-red-200';
                            }

                            return (
                                <tr key={`grade-row-${grade}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors group">
                                    <td className="py-2.5 px-4 text-sm font-semibold text-gray-900">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${badgeColorClass}`}>
                                            {grade}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-4 text-sm text-center text-gray-900 font-semibold">{count}</td>
                                    <td className="py-2.5 px-4 text-sm text-center">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200 min-w-[50px] inline-block">
                                            {percentage}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function GradeDistributionChart({ chartData }) {
    if (!chartData) return null;

    // Define all grades for the chart, including W
    const allGradeKeys = [...grades.map(g => g.grade), 'W'];
    const frequencies = allGradeKeys.map(g => chartData[g] || 0);
    const maxVal = Math.max(...frequencies, 0) + 1;

    const backgroundColors = [
        "#059669", // A+ (Emerald 600)
        "#10b981", // A (Emerald 500)
        "#34d399", // A- (Emerald 400)
        "#1d4ed8", // B+ (Blue 700)
        "#3b82f6", // B (Blue 500)
        "#60a5fa", // B- (Blue 400)
        "#b45309", // C+ (Amber 700)
        "#f59e0b", // C (Amber 500)
        "#fbbf24", // C- (Amber 400)
        "#ef4444", // F (Red 500)
        "#ef4444", // W (Red 500)
    ];

    const hoverBackgroundColors = [
        "#047857", // A+
        "#059669", // A
        "#10b981", // A-
        "#1e40af", // B+
        "#2563eb", // B
        "#3b82f6", // B-
        "#92400e", // C+
        "#d97706", // C
        "#f59e0b", // C-
        "#dc2626", // F
        "#dc2626", // W
    ];

    const data = {
        labels: allGradeKeys,
        datasets: [
            {
                label: 'Students',
                data: frequencies,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverBackgroundColors,
                borderRadius: 6,
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                maxBarThickness: 50,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                anchor: "end",
                align: "top",
                formatter: (value) => value > 0 ? value : '',
                color: (context) => {
                    const bg = context.dataset.backgroundColor;
                    return Array.isArray(bg) ? bg[context.dataIndex] : '#4f46e5';
                },
                font: { weight: "bold", size: 12 },
                offset: -2
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                titleColor: '#111827',
                bodyColor: '#4b5563',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                boxPadding: 6,
                usePointStyle: true,
                titleFont: { size: 13, weight: 'bold', family: "'Inter', sans-serif" },
                bodyFont: { size: 12, family: "'Inter', sans-serif" },
                callbacks: {
                    label: function (context) {
                        return ` ${context.parsed.y} Student(s)`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                max: maxVal,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    color: '#6b7280',
                },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#374151', font: { weight: '600' } },
            },
        },
    };

    return (
        <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm h-full flex flex-col mt-12">
            <div className="mb-6 px-1 text-left">
                <h2 className="text-2xl font-normal text-gray-900">Grade Distribution Chart</h2>
                <p className="text-sm text-gray-500 mt-1">Graphical representation of student performance frequency across letter grades.</p>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar flex-1">
                <div className="h-[380px] min-w-[500px]">
                    <Bar data={data} options={options} />
                </div>
            </div>
            <div className="mt-6 text-center border-t border-gray-50 pt-4">
                <p className="text-sm text-gray-500 italic">Frequency and density distribution of final marks</p>
            </div>
        </div>
    );
}
