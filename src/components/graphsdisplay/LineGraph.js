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
import { getTimeUnitFromConfiguration, processContinuousGraphData } from "./GraphsDisplayUtils";
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

export default function LineGraph({ graphConfiguration, graphData }) {

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
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return <Line options={options} data={data} />;
}