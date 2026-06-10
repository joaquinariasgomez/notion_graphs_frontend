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
  Filler
} from 'chart.js';
import { TimeScale } from 'chart.js';
import { getGraphTitle, getTimeUnitFromConfiguration, processGroupedCountData } from "./GraphsDisplayUtils";
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
  Filler
);

export default function FrequencyBarGraph({ graphConfiguration, graphData, showLegend, showTitle }) {

  const { labels, datasets } = processGroupedCountData(graphConfiguration, graphData);

  const data = {
    labels: labels,
    datasets: datasets
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
        display: showTitle,
        text: getGraphTitle(graphConfiguration)
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
        stacked: true,
        title: {
          display: true,
          text: 'Count',
          font: { size: 11 }
        },
        ticks: {
          font: { size: 11 },
          precision: 0
        }
      }
    }
  }

  return <Bar options={options} data={data} />;
}
