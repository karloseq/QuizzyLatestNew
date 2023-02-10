import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export function SteppedLineChart({ config }) {
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
  
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          font: {
            size: 17,
            weight: 600,
            family: "Plus Jakarta Sans",
          },
          usePointStyle: true,
          padding: 20,
          filter: function (item, chart) {
            return !item.text.includes("NaN");
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(112, 112, 112, 0.24)",
          lineWidth: 3,
          borderWidth: 0,
        },
        ticks: {
          font: {
            size: 18,
            weight: 600,
            family: "Plus Jakarta Sans",
          },
          maxTicksLimit: 8,
          stepSize: 25,
          color: "#919191",
          padding: 30,
        
          callback: function (val, index) {
            // Hide the label of every 2nd dataset
            return val + "%";
            
            
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 18,
            weight: 600,
            family: "Plus Jakarta Sans",
          },
          color: "#919191",
          padding: 20,
          
        },
      },
    },
  };
  const getData = () => {
    if (config.hideXTicks) {
      options.scales.x.ticks.display = false 
    }
    else { 
      options.scales.x.ticks.display = true 
    }

    if (config.yTicksCallback) {
      options.scales.y.ticks.callback = config.yTicksCallback;
    }
    var datasets = [
      {
        label: config.fillTitle || "NaN",
        data: config.fillData || [],
        backgroundColor: config.dotColor || "#8358E8",
        borderColor: config.dotColor || "#8358E8",
        borderWidth: 5,
        tension: 0.4,
        radius: 4,
      },
      
    ]
    if (config.dashTitle && config.dashData) {
      datasets.push({
        label: config.dashTitle || "",
        data: config.dashData || [],
        backgroundColor: "rgba(112, 112, 112, 0.4)",
        borderColor: "rgba(112, 112, 112, 0.4)",
        borderDash: [20, 20],
        tension: 0.4,
        radius: 0,
      })
    }
    return {
      labels: config.labels,
      datasets: datasets 
    };
  };

  const data = getData();

  return <Line options={options} data={data} height={83}/>;
}
