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
import { parseISO, startOfWeek, startOfMonth, format } from 'date-fns';

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

function resolveDate(dateStr, yearContext) {
  const s = String(dateStr);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return parseISO(s);
  }
  // Day-of-year number (e.g. 1–365) — requires a year from config
  if (/^\d+$/.test(s) && yearContext) {
    return new Date(yearContext, 0, parseInt(s, 10));
  }
  return null;
}

function bucketKeyAndLabel(dateStr, resolution, yearContext) {
  const s = String(dateStr);
  if (resolution === 'DAILY') {
    return { key: s, label: 'Day ' + s };
  }
  const d = resolveDate(dateStr, yearContext);
  if (!d) {
    return { key: s, label: 'Day ' + s };
  }
  if (resolution === 'WEEKLY') {
    const ws = startOfWeek(d, { weekStartsOn: 1 });
    return { key: format(ws, 'yyyy-MM-dd'), label: format(ws, 'MMM d') };
  }
  if (resolution === 'MONTHLY') {
    return { key: format(d, 'yyyy-MM'), label: format(d, 'MMM yyyy') };
  }
  return { key: s, label: 'Day ' + s };
}

function groupRows(rows, resolution, yearContext) {
  const buckets = new Map();
  for (const row of rows) {
    const { key, label } = bucketKeyAndLabel(row.date, resolution, yearContext);
    const existing = buckets.get(key);
    if (existing) {
      existing.totalAmount += row.totalAmount;
    } else {
      buckets.set(key, { key, label, totalAmount: row.totalAmount });
    }
  }
  return Array.from(buckets.values()); // chronological — rows arrive sorted
}

function getTagsFromGrouped(groupedData, groupedReference) {
  const sourceArray = groupedData.length >= groupedReference.length ? groupedData : groupedReference;
  return sourceArray.map(bucket => bucket.label);
}

// Gets accumulated totals from already-grouped buckets
function getCumulativeValues(groupedRows) {
  let runningTotal = 0;
  return groupedRows.map(bucket => {
    runningTotal += bucket.totalAmount;
    return runningTotal;
  });
}

function getYearContext(graphConfiguration) {
  const ds = graphConfiguration?.burndownSettings?.dataSettings;
  if (!ds) return null;
  if (ds.time === 'LAST_YEAR') return new Date().getFullYear() - 1;
  if (ds.time === 'CUSTOM_YEAR' && ds.customYear) return ds.customYear;
  return null;
}

export default function BurndownGraph({ graphConfiguration, graphData, showTitle, resolution = 'DAILY' }) {

  const yearContext = getYearContext(graphConfiguration);
  const groupedData = groupRows(graphData?.data ?? [], resolution, yearContext);
  const groupedReference = groupRows(graphData?.referenceData ?? [], resolution, yearContext);

  const data = {
    labels: getTagsFromGrouped(groupedData, groupedReference),
    datasets: [
      {
        label: 'Reference spending',
        data: getCumulativeValues(groupedReference),
        borderColor: 'rgba(201, 203, 207, 1)', // Grey line
        borderWidth: 2.5,
        borderDash: [6, 6], // This makes the line dashed
        fill: false, // No fill for the average line
        pointRadius: 0, // No dots on the average line
      },
      {
        label: 'Cumulative spending',
        data: getCumulativeValues(groupedData),
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
        display: showTitle,
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