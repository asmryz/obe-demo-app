import React from "react";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function CloAchievementCharts({ cloSummaryRows }) {
    if (!cloSummaryRows || cloSummaryRows.length === 0) return null;

    const labels = cloSummaryRows.map(([cloKey]) => `CLO${cloKey}`);
    const achievedData = cloSummaryRows.map(([_, [achievedCount, notAchievedCount]]) => {
        const totalCount = achievedCount + notAchievedCount;
        return totalCount ? ((achievedCount / totalCount) * 100).toFixed(1) : 0;
    });
    const notAchievedData = cloSummaryRows.map(([_, [achievedCount, notAchievedCount]]) => {
        const totalCount = achievedCount + notAchievedCount;
        return totalCount ? ((notAchievedCount / totalCount) * 100).toFixed(1) : 0;
    });

    const data = {
        labels: labels,
        datasets: [
            {
                label: '% Achieved',
                data: achievedData,
                backgroundColor: "#52ed69",
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.6,
            },
            {
                label: '% Not Achieved',
                data: notAchievedData,
                backgroundColor: "#149fef",
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.6,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 12, weight: '600' }
                }
            },
            title: {
                display: true,
                text: 'Visual Summary',
                font: { size: 18, weight: "bold", family: "'Inter', sans-serif" },
                color: '#111827',
                padding: { bottom: 30 },
            },
            datalabels: {
                anchor: "end",
                align: "top",
                formatter: (value) => value + "%",
                color: "#374151",
                font: { weight: "bold", size: 11 },
                offset: -2
            },
            tooltip: {
                backgroundColor: '#bfcfe5ff',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 120,
                grid: { color: '#f3f4f6' },
                ticks: {
                    stepSize: 10,
                    callback: (value) => value + "%",
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
        <div className="bg-white p-8 shadow-sm">
            <div className="h-[450px] w-full">
                <Bar data={data} options={options} />
            </div>
            <div className="mt-6 text-center border-t border-gray-50 pt-4">
                <p className="text-sm text-gray-500 italic">Comparative analysis of student success rates across all Course Learning Outcomes</p>
            </div>
        </div>
    );
}
