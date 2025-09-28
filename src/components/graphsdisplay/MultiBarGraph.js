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
import { computeAverage, computeStandardDeviation, getGraphTitleFromConfiguration, getTimeUnitFromConfiguration, groupDatasetsIntoSingleList, processGroupedGraphData } from "./GraphsDisplayUtils";
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

export default function MultiBarGraph({ graphConfiguration, graphData, showLegend, showAverages, showStandardDeviation }) {

  const { labels, datasets } = processGroupedGraphData(graphConfiguration, graphData);

  // const averageValue = computeAverage(values);
  // const standardDeviationValue = computeStandardDeviation(values);
  groupDatasetsIntoSingleList(datasets);

  const data = {
    labels: labels,
    datasets: datasets
  }

  // const annotations = {};
  // if (showAverages) {
  //   annotations.averageAnnotation = {
  //     type: 'line',
  //     borderColor: 'rgb(100, 149, 237)',
  //     borderDash: [6, 6],
  //     borderDashOffset: 0,
  //     borderWidth: 3,
  //     label: {
  //       display: true,
  //       backgroundColor: 'rgb(100, 149, 237)',
  //       content: 'Average: ' + averageValue.toFixed(2),
  //     },
  //     scaleID: 'y',
  //     value: averageValue
  //   };
  // }

  // if (showStandardDeviation) {
  //   annotations.upperStd = {
  //     type: 'line',
  //     borderColor: 'rgba(102, 102, 102, 0.5)',
  //     borderDash: [6, 6],
  //     borderDashOffset: 0,
  //     borderWidth: 3,
  //     label: {
  //       display: true,
  //       backgroundColor: 'rgba(102, 102, 102, 0.5)',
  //       color: 'black',
  //       content: (averageValue + standardDeviationValue).toFixed(2),
  //       position: 'start',
  //       // rotation: -90,
  //       yAdjust: -28
  //     },
  //     scaleID: 'y',
  //     value: averageValue + standardDeviationValue
  //   };
  //   annotations.lowerStd = {
  //     type: 'line',
  //     borderColor: 'rgba(102, 102, 102, 0.5)',
  //     borderDash: [6, 6],
  //     borderDashOffset: 0,
  //     borderWidth: 3,
  //     label: {
  //       display: true,
  //       backgroundColor: 'rgba(102, 102, 102, 0.5)',
  //       color: 'black',
  //       content: (averageValue - standardDeviationValue).toFixed(2),
  //       position: 'end',
  //       // rotation: 90,
  //       yAdjust: 28
  //     },
  //     scaleID: 'y',
  //     value: averageValue - standardDeviationValue
  //   };
  // }

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
        text: getGraphTitleFromConfiguration(graphConfiguration)
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

  return <Bar options={options} data={data} />;
}