import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function DoughnutChart({ config}) {
  const textInside = config.textInside; 
  const plugins = [
    {
      /*beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize * 1.25 + "em Dubai, sans-serif";
        ctx.textBaseline = "top";
        var text = chart.config._config.options.textInside || "NONE",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / config.divider;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },*/
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          var ctx = chart.ctx;
          var height = chart.height;
          // Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'Open Sans';
          var txt = centerConfig.text;
          var color = centerConfig.color || '#000';
          var maxFontSize = centerConfig.maxFontSize || 55;
          var sidePadding = centerConfig.sidePadding || 20;
          var innerRadius = 90
          var fontWeight = centerConfig.fontWeight ? (centerConfig.fontWeight + " ") : "";

          var sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2)
          // Start with a base font of 30px
          ctx.font = "30px " + fontStyle;
    
          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = (innerRadius * 2) - sidePaddingCalculated;
    
          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = (innerRadius * 2);
    
          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
          var minFontSize = centerConfig.minFontSize;
          var lineHeight = centerConfig.lineHeight || 25;
          var wrapText = false;
    
          if (minFontSize === undefined) {
            minFontSize = 20;
            
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
          }

    
          // Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontWeight + fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;
    
          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }
    
          var words = txt.split(' ');
          var line = '';
          var lines = [];
    
          // Break words up into multiple lines if necessary
          for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }
    
          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;
    
          for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          //Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
      }
    },
  ];

  const options = {
    rotation: config.rotate || 0,
    responsive: true,
    cutout: "70%",//105,
    textInside: config.textInside,
    elements: {
      center: {
        text: config.textInside,
        color: '#000000', // Default is #000000
        fontStyle: 'Plus Jakarta Sans', // Default is Arial
        sidePadding: 20, // Default is 20 (as a percentage)
        minFontSize: config.minFontSize || 20, // Default is 20 (in px), set to false and text will not wrap.
        maxFontSize: config.maxFontSize || 30,
        fontWeight: '600', // Default is bold
        lineHeight: 25 // Default is 25 (in px), used for when text wraps
      }
    },
    plugins: {
      
      tooltip: {
        bodyFont: {
          size: 18,
          family: "Dubai Regular",
        },
        displayColors: false,

        callbacks: {
          label: function (tooltipItem) {
            if (config.ignoreTraditionalLabelCallback) { 
              return `${tooltipItem.label} `;//`${config.label} `;
            }
            const dataSum = config.data.reduce((a, b) => a + b);
            const masteryPercentage =
              config.data[config.labels.indexOf("Mastery Progress")] / dataSum;


            if (tooltipItem.label === "NaN") return (config.mastery && `You still have ` + Math.round((1 - masteryPercentage) * 100) + `% of this set to master.`);

            var std_append = "- ";
            function secondsToHms(d) {
              d = Number(d);
              var h = Math.floor(d / 3600);
              var m = Math.floor(d % 3600 / 60);
              var s = Math.floor(d % 3600 % 60);
          
              var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
              var mDisplay = m > 0 ? m + (m == 1 ? " mins " : " mins ") : "";
              var sDisplay = s > 0 ? s + (s == 1 ? " secs" : " secs") : "";

              return hDisplay + mDisplay + sDisplay; 
          }
            std_append += secondsToHms(tooltipItem.raw)
            return config.mastery
              ? `You've mastered ${Math.round(
                  masteryPercentage * 100
                )}% of this set`
              : `${tooltipItem.label} ` + std_append;
          },
        },
      },
    },
  };

  if (!config.ignoreLegend) {
    options.plugins.legend = {
      position: "bottom",
      align: "start",
      labels: {
        font: {
          size: 18,
          weight: 600,
          family: "Plus Jakarta Sans",
        },
       
        usePointStyle: true,
        padding: 20,

        filter: function (item, chart) {
          // Logic to remove a particular legend item goes here
          return !item.text.includes("NaN");
        },
      },
    }
  }
  else { 
    options.plugins.legend = {display: false}
  }
  const data = {
    labels: config.labels || ["NaN"],
    datasets: [
      {
        data: config.data || [50, 50],
        backgroundColor: config.bgColor || ["red", "black"],
        borderWidth: 0,
        hoverBorderWidth: 2,
        borderDash: [],
        borderStyle: "dash",
        borderAlign: 'center',
        line: { borderWidth: 0 },
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      width={config.width || 350}
      height={config.height || 350}
      options={options}
      plugins={plugins}
    />
  );
}

export default DoughnutChart;
