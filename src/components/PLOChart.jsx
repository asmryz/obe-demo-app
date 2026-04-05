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

// Register components + plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const PLOChart = ({label, achieved, notAchieved}) => {
  const data = {
    labels: ["% Achieved", "% Not Achieved"],
    datasets: [
      {
        data: [achieved, notAchieved],
        backgroundColor: "#4e79a7",
        borderRadius: 4,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: label,
        font: { size: 18, weight: "bold" },
      },

      // ⭐ Data Labels config
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => value + "%",
        color: "#000",
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + "%",
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "260px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PLOChart;