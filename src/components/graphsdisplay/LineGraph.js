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
} from 'chart.js';
import { TimeScale } from 'chart.js'; // Import TimeScale
import 'chartjs-adapter-date-fns'; // Import the adapter

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineGraph({ graphConfiguration, graphData }) {

  /**
   * Processes graph data to create a continuous series from a start to an end date.
   * Fills in missing days with a value of 0.
   *
   * @param {object} graphConfiguration - Contains startDate and endDate strings ('YYYY-MM-DD').
   * @param {object} graphData - Contains the sparse data array.
   * @returns {{dates: string[], values: number[]}} - An object with complete dates and values.
   */
  function processContinuousGraphData(graphConfiguration, graphData) {
    const { dataSettings } = graphConfiguration.customGraphSettings;
    const { customStartDate: startDate, customEndDate: endDate } = dataSettings;
    if (!startDate || !endDate || !graphData?.data) {
      return { dates: [], values: [] };
    }
    const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));
    const dates = [];
    const values = [];
    const currentDate = new Date(`${startDate}T00:00:00`);
    const lastDate = new Date(`${endDate}T00:00:00`);
    while (currentDate <= lastDate) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      dates.push(formattedDate);
      const value = dataMap.get(formattedDate) || 0;
      values.push(value);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return { dates, values };
  }

  // function getDaysFromGraphData(graphData) {
  //   return graphData?.data?.map(row => row.date) || [];
  // }

  // function getValuesFromGraphData(graphData) {
  //   return graphData?.data?.map(row => row.totalAmount) || [];
  // }
  const { dates, values } = processContinuousGraphData(graphConfiguration, graphData);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total',
        data: values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
    scales: {
      x: {
        type: 'time', // Tell Chart.js to use the time scale
        time: {
          unit: 'day', // Display labels by day
          tooltipFormat: 'MMM d, yyyy' // e.g., 'Sep 7, 2025'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return <Line options={options} data={data} />;
}