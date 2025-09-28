import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
  Filler
} from 'chart.js';
import { TimeScale } from 'chart.js';
import { computeAverage, computeStandardDeviation, getGraphTitleFromConfiguration, getTimeUnitFromConfiguration, processContinuousGraphData } from "./GraphsDisplayUtils";
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export default function LineGraph({ graphConfiguration, graphData, showAverages, showStandardDeviation }) {

  const { dates, values } = processContinuousGraphData(graphConfiguration, graphData);

  const averageValue = computeAverage(values);
  const standardDeviationValue = computeStandardDeviation(values);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total',
        data: values,
        fill: 'origin',
        borderColor: 'rgb(54, 162, 235)',      // Solid blue for the line
        backgroundColor: 'rgba(54, 162, 235, 0.3)', // Semi-transparent blue for the area fill
        tension: 0.0 // Configuring this value will make the line straight or a bit curved
      }
    ]
  }

  const annotations = {};
  if (showAverages) {
    annotations.averageAnnotation = {
      type: 'line',
      borderColor: 'rgb(100, 149, 237)',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 3,
      label: {
        display: true,
        backgroundColor: 'rgb(100, 149, 237)',
        content: 'Average: ' + averageValue.toFixed(2),
      },
      scaleID: 'y',
      value: averageValue
    };
  }

  if (showStandardDeviation) {
    annotations.upperStd = {
      type: 'line',
      borderColor: 'rgba(102, 102, 102, 0.5)',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 3,
      label: {
        display: true,
        backgroundColor: 'rgba(102, 102, 102, 0.5)',
        color: 'black',
        content: (averageValue + standardDeviationValue).toFixed(2),
        position: 'start',
        // rotation: -90,
        yAdjust: -28
      },
      scaleID: 'y',
      value: averageValue + standardDeviationValue
    };
    annotations.lowerStd = {
      type: 'line',
      borderColor: 'rgba(102, 102, 102, 0.5)',
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 3,
      label: {
        display: true,
        backgroundColor: 'rgba(102, 102, 102, 0.5)',
        color: 'black',
        content: (averageValue - standardDeviationValue).toFixed(2),
        position: 'end',
        // rotation: 90,
        yAdjust: 28
      },
      scaleID: 'y',
      value: averageValue - standardDeviationValue
    };
  }

  const options = {
    animation: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      },
      title: {
        display: true,
        text: getGraphTitleFromConfiguration(graphConfiguration)
      },
      annotation: {
        annotations: annotations
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: getTimeUnitFromConfiguration(graphConfiguration),
          tooltipFormat: 'MMM d, yyyy' // e.g., 'Sep 7, 2025'
        },
        title: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        },
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return <Line options={options} data={data} />;
}