import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { getMoneyStatsChart } from "../api/RequestUtils";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { addDays, differenceInDays, isSameMonth, isSameWeek, subDays } from 'date-fns';
import { formatToString, fromDateString } from "../utils/DateUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  Filler
);

const DATE_WINDOW_DAYS = 30;
const WEEKLY_THRESHOLD_DAYS = 90;
const MONTHLY_THRESHOLD_DAYS = 365;
const CURRENT_TOTAL = 100000;
const WEEK_OPTIONS = { weekStartsOn: 1 };
const TIME_UNIT_BY_AGGREGATION = { daily: 'day', weekly: 'week', monthly: 'month' };

const isSamePeriod = (a, b, aggregation) => {
  if (aggregation === 'weekly') return isSameWeek(a, b, WEEK_OPTIONS);
  if (aggregation === 'monthly') return isSameMonth(a, b);
  return false;
};

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const buildGradientFill = (context) => {
  const { ctx, chartArea } = context.chart;
  if (!chartArea) return 'rgba(54, 162, 235, 0.15)';
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, 'rgba(54, 162, 235, 0.35)');
  gradient.addColorStop(1, 'rgba(54, 162, 235, 0)');
  return gradient;
};

export default function DashboardWidgets() {
  const [{ userJWTCookie }] = useGlobalStateValue();

  const initialCurrentDate = formatToString(new Date());
  const initialPreviousDate = formatToString(subDays(new Date(), DATE_WINDOW_DAYS));

  const [allData, setAllData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFromDate, setLoadedFromDate] = useState(initialPreviousDate);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await getMoneyStatsChart(userJWTCookie, initialPreviousDate, initialCurrentDate);
      if (response) {
        const sortedData = [...response.data].sort((a, b) => a.date.localeCompare(b.date));
        setAllData(sortedData);
        setHasNextPage(response.hasNextPage);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const loadPreviousDays = async () => {
    try {
      setIsLoading(true);
      const fromDate = fromDateString(loadedFromDate);
      const newCurrentDate = formatToString(subDays(fromDate, 1));
      const newPreviousDate = formatToString(subDays(fromDate, DATE_WINDOW_DAYS));
      const response = await getMoneyStatsChart(userJWTCookie, newPreviousDate, newCurrentDate);
      if (response) {
        const sortedNewData = [...response.data].sort((a, b) => a.date.localeCompare(b.date));
        setAllData(prev => [...sortedNewData, ...prev]);
        setHasNextPage(response.hasNextPage);
        setLoadedFromDate(newPreviousDate);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const startDate = fromDateString(loadedFromDate);
  const endDate = fromDateString(initialCurrentDate);
  const spanDays = differenceInDays(endDate, startDate);
  const aggregation = spanDays > MONTHLY_THRESHOLD_DAYS
    ? 'monthly'
    : spanDays > WEEKLY_THRESHOLD_DAYS ? 'weekly' : 'daily';

  const granularityLabel = aggregation.charAt(0).toUpperCase() + aggregation.slice(1);
  const rangeLabel = (() => {
    if (spanDays <= 90) return `Last ${spanDays} days`;
    const months = Math.round(spanDays / 30);
    if (months < 24) return `Last ${months} months`;
    return `Last ${Math.round(months / 12)} years`;
  })();
  const subtitleText = `${granularityLabel} · ${rangeLabel}`;

  // Reconstructs the balance at the end of each day in the loaded window,
  // anchoring the final day to CURRENT_TOTAL and walking backwards via the
  // daily deltas (amount = income - expenses for that day).
  const buildBalanceData = () => {
    const amountByDate = new Map(allData.map(item => [item.date, item.amount]));

    const daily = [];
    let runningDelta = 0;
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dateString = formatToString(date);
      runningDelta += amountByDate.get(dateString) ?? 0;
      daily.push({ x: dateString, y: runningDelta, date });
    }

    const finalDelta = daily.length > 0 ? daily[daily.length - 1].y : 0;
    const offset = CURRENT_TOTAL - finalDelta;
    for (const point of daily) {
      point.y += offset;
    }

    if (aggregation === 'daily') {
      return daily.map(({ x, y }) => ({ x, y }));
    }

    // Keep only the last point of each period so the balance reflects the
    // value at the end of that week/month.
    return daily
      .filter((point, i) => {
        const next = daily[i + 1];
        return !next || !isSamePeriod(point.date, next.date, aggregation);
      })
      .map(({ x, y }) => ({ x, y }));
  };

  const chartData = {
    datasets: [
      {
        label: 'Balance',
        data: buildBalanceData(),
        fill: 'start',
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: buildGradientFill,
        borderWidth: 2,
        tension: 0.25,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1
      }
    ]
  };

  const options = {
    animation: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => currencyFormatter.format(ctx.parsed.y)
        }
      },
      title: {
        display: true,
        text: 'Money evolution',
        font: { size: 14, weight: '600' },
        padding: { top: 4, bottom: 2 }
      },
      subtitle: {
        display: true,
        text: subtitleText,
        font: { size: 11, weight: '400' },
        color: 'rgba(0, 0, 0, 0.55)',
        padding: { bottom: 12 }
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
          unit: TIME_UNIT_BY_AGGREGATION[aggregation],
          tooltipFormat: 'MMM d, yyyy'
        },
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          color: 'rgba(0, 0, 0, 0.55)'
        }
      },
      y: {
        beginAtZero: false,
        border: { display: false },
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
        ticks: {
          font: { size: 11 },
          color: 'rgba(0, 0, 0, 0.55)',
          callback: (value) => currencyFormatter.format(value)
        }
      }
    }
  };

  return (
    <div className="dashboard__widgets">
      <div className="widget__moneystats">
        <div className="widget__moneystats__chart-wrapper">
          {hasNextPage && (
            <button
              className="widget__moneystats__prev-button"
              onClick={loadPreviousDays}
              disabled={isLoading}
              aria-label={isLoading ? 'Loading earlier days' : 'Load earlier days'}
              title="Load earlier days"
            >
              <span aria-hidden="true">←</span>
            </button>
          )}
          <div className="widget__moneystats__chart">
            <Line options={options} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
