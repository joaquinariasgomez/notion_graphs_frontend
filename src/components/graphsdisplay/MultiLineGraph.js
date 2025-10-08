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
import { addAverageToAnnotations, addStandardDeviationToAnnotations, getGraphTitle, getGraphTitleFromConfiguration, getTimeUnitFromConfiguration, processGroupedGraphData } from "./GraphsDisplayUtils";
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

export default function MultiLineGraph({ graphConfiguration, graphData, showLegend, showAverages, showStandardDeviation }) {

  const { labels, datasets } = processGroupedGraphData(graphConfiguration, graphData);

  const data = {
    labels: labels,
    datasets: datasets
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
        display: showLegend,
        labels: {
          font: {
            size: 10 // Default is 14
          },
          boxWidth: 10 // Default is 40
        },
        position: 'bottom'
      },
      tooltip: {
        enabled: true
      },
      title: {
        display: true,
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
        stacked: true
      },
      y: {
        beginAtZero: true,
        stacked: true
      }
    }
  }

  return <Line options={options} data={data} />;
}