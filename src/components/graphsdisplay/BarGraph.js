import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  scales,
  Filler
} from 'chart.js';
import { TimeScale } from 'chart.js';
import { addAverageToAnnotations, addStandardDeviationToAnnotations, getGraphTitleFromConfiguration, getTimeUnitFromConfiguration, processContinuousGraphData } from "./GraphsDisplayUtils";
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export default function BarGraph({ graphConfiguration, graphData, showAverages, showStandardDeviation }) {

  const { dates, values } = processContinuousGraphData(graphConfiguration, graphData);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total',
        data: values,
        borderColor: 'rgb(54, 162, 235)',      // Solid blue for the line
        borderWidth: 1.5,
        backgroundColor: 'rgba(54, 162, 235, 0.3)', // Semi-transparent blue for the area fill
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
        type: 'time', // Tell Chart.js to use the time scale
        time: {
          unit: getTimeUnitFromConfiguration(graphConfiguration),
          tooltipFormat: 'MMM d, yyyy' // e.g., 'Sep 7, 2025'
        },
        title: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return <Bar options={options} data={data} />;
}