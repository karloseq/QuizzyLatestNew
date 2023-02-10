/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "./LineChart.scss";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";

function LineChart({ width, height, data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          font: {
            size: 18,
            weight: 500,
            family: "Plus Jakarta Sans"
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        bodyFont: {
          size: 18,
          family: "Plus Jakarta Sans",
        },
        displayColors: false,

        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} mins`;
          },
          title: function () {},
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
            weight: 500,
            family: "Plus Jakarta Sans",
          },
          color: "#919191",
          padding: 15,

          callback: function (val, index) {
            // Hide the label of every 2nd dataset
            return val + "m";
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
          padding: 15,
          color: "#919191",
        },
      },
    },
  };

  return (
    <Line data={data} width={width} height={height} options={options}></Line>
  );
}

export default LineChart;
