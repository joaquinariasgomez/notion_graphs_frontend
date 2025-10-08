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
import { getGraphTitle, getGraphTitleFromConfiguration } from "./GraphsDisplayUtils";
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

function getTagsFromLongestSource(graphData) {
  const data = graphData?.data ?? [];
  const referenceData = graphData?.referenceData ?? [];

  const sourceArray = data.length >= referenceData.length ? data : referenceData;
  return sourceArray.map(row => "Day " + row.date);
}

// Gets accumulated totals
function getValuesFromGraphData(graphData) {
  let runningTotal = 0;
  const data = graphData?.data ?? [];

  return data.map(row => {
    runningTotal += row.totalAmount;
    return runningTotal;
  });
}

// Gets accumulated totals
function getValuesFromReferenceData(graphData) {
  let runningTotal = 0;
  const data = graphData?.referenceData ?? [];

  return data.map(row => {
    runningTotal += row.totalAmount;
    return runningTotal;
  });
}

export default function BurndownGraph({ graphConfiguration, graphData }) {

  const data = {
    labels: getTagsFromLongestSource(graphData),
    datasets: [
      {
        label: 'Reference spending',
        data: getValuesFromReferenceData(graphData),
        borderColor: 'rgba(201, 203, 207, 1)', // Grey line
        borderWidth: 2.5,
        borderDash: [6, 6], // This makes the line dashed
        fill: false, // No fill for the average line
        pointRadius: 0, // No dots on the average line
      },
      {
        label: 'Cumulative spending',
        data: getValuesFromGraphData(graphData),
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
        borderColor: 'rgba(54, 162, 235, 1)',      // Solid blue line
        borderWidth: 2,
        fill: true, // This makes it an area chart
        tension: 0.3, // Makes the line slightly curved
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
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
        text: getGraphTitle(graphConfiguration)
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
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