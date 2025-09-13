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
import { getTimeUnitFromConfiguration, processGroupedGraphData } from "./GraphsDisplayUtils";
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
  Filler
);

export default function MultiLineGraph({ graphConfiguration, graphData }) {

  const { labels, datasets } = processGroupedGraphData(graphConfiguration, graphData);

  const data = {
    labels: labels,
    datasets: datasets
  }

  const options = {
    animation: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        enabled: true
      },
      title: {
        display: true,
        text: "Test title"//getGraphTitleFromGraphOptions(desiredGraphOptions)
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