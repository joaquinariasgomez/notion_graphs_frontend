import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  BubbleController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { COLOR_PALETTE, getGraphTitle, processFrequencyGraphData } from "./GraphsDisplayUtils";

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amount);
}

ChartJS.register(
  LinearScale,
  PointElement,
  BubbleController,
  Title,
  Tooltip,
  Legend,
);

// Bubble radius bounds (pixels)
const MIN_R = 8;
const MAX_R = 40;

function scaleRadius(avgAmount, maxAvgAmount) {
  if (maxAvgAmount === 0) return MIN_R;
  return MIN_R + Math.sqrt(avgAmount / maxAvgAmount) * (MAX_R - MIN_R);
}

export default function FrequencyGraph({ graphConfiguration, graphData, showLegend, showTitle }) {

  const groups = processFrequencyGraphData(graphConfiguration, graphData);
  const maxAvgAmount = Math.max(...groups.map(g => g.avgAmount), 0);

  const datasets = groups.map((group, index) => {
    const solidColor = COLOR_PALETTE[index % COLOR_PALETTE.length];
    const transparentColor = solidColor.replace('rgb', 'rgba').replace(')', ', 0.6)');
    return {
      label: group.label,
      backgroundColor: transparentColor,
      borderColor: solidColor,
      borderWidth: 1.5,
      data: [{
        x: group.count,
        y: group.totalAmount,
        r: scaleRadius(group.avgAmount, maxAvgAmount),
      }],
    };
  });

  const data = { datasets };

  const options = {
    animation: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        labels: {
          font: { size: 10 },
          boxWidth: 10,
        },
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const group = groups[context.datasetIndex];
            if (!group) return '';
            return [
              `${group.label}`,
              `Transactions: ${group.count}`,
              `Total: ${formatCurrency(group.totalAmount)}`,
              `Avg per transaction: ${formatCurrency(group.avgAmount)}`,
            ];
          },
        },
      },
      title: {
        display: showTitle,
        text: getGraphTitle(graphConfiguration),
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Transactions',
          font: { size: 11 },
        },
        ticks: {
          font: { size: 11 },
          precision: 0,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total spend (€)',
          font: { size: 11 },
        },
        ticks: {
          font: { size: 11 },
        },
      },
    },
  };

  return <Bubble options={options} data={data} />;
}
