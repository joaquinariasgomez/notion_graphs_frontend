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
import { addAverageToAnnotations, addStandardDeviationToAnnotations, getGraphTitle, getGraphTitleFromConfiguration, getTimeUnitFromConfiguration, processContinuousGraphData } from "./GraphsDisplayUtils";
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

export default function LineGraph({ graphConfiguration, graphData, showAverages, showStandardDeviation, showTitle }) {

  const { dates, values } = processContinuousGraphData(graphConfiguration, graphData);

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
    addAverageToAnnotations(annotations, graphConfiguration, graphData);
  }
  if (showStandardDeviation) {
    addStandardDeviationToAnnotations(annotations, graphConfiguration, graphData);
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
        display: showTitle,
        text: getGraphTitle(graphConfiguration)
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