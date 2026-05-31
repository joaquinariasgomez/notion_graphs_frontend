import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { getMoneyStats, getMoneyStatsChart, syncTotalMoney, triggerExperimentJob } from "../api/RequestUtils";
import { Line } from "react-chartjs-2";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
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
  const [totalMoney, setTotalMoney] = useState(null);
  const [totalMoneyInput, setTotalMoneyInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isTriggeringExperiment, setIsTriggeringExperiment] = useState(false);

  useEffect(() => {
    if (totalMoney != null) {
      setTotalMoneyInput(totalMoney.toFixed(2));
    }
  }, [totalMoney]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [chartResponse, statsResponse] = await Promise.all([
        getMoneyStatsChart(userJWTCookie, initialPreviousDate, initialCurrentDate),
        getMoneyStats(userJWTCookie),
      ]);
      if (chartResponse) {
        const sortedData = [...chartResponse.data].sort((a, b) => a.date.localeCompare(b.date));
        setAllData(sortedData);
        setHasNextPage(chartResponse.hasNextPage);
      }
      if (statsResponse?.totalMoney != null) {
        setTotalMoney(statsResponse.totalMoney);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerExperiment = async () => {
    try {
      setIsTriggeringExperiment(true);
      await triggerExperimentJob(userJWTCookie);
    } catch (error) {

    } finally {
      setIsTriggeringExperiment(false);
    }
  };

  const handleSyncTotalMoney = async () => {
    const parsed = parseFloat(totalMoneyInput);
    if (!Number.isFinite(parsed) || parsed === totalMoney) return;
    try {
      setIsSyncing(true);
      await syncTotalMoney(userJWTCookie, parsed);
      setTotalMoney(parsed);
    } catch (error) {

    } finally {
      setIsSyncing(false);
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

  const resetView = () => {
    setAllData(prev => prev.filter(item => item.date >= initialPreviousDate));
    setLoadedFromDate(initialPreviousDate);
    setHasNextPage(true);
  };

  const hasLoadedEarlier = loadedFromDate < initialPreviousDate;

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

  const windowChange = (() => {
    if (totalMoney == null) return null;
    const total = allData
      .filter(item => item.date > loadedFromDate && item.date <= initialCurrentDate)
      .reduce((sum, item) => sum + item.amount, 0);
    const initial = totalMoney - total;
    const direction = total > 0 ? 'up' : total < 0 ? 'down' : 'flat';
    const pct = initial !== 0 ? (total / initial) * 100 : null;
    return { absolute: total, pct, direction };
  })();
  const changeArrow = { up: '↑', down: '↓', flat: '→' };

  // Reconstructs the balance at the end of each day in the loaded window,
  // anchoring the final day to the customer's current total and walking
  // backwards via the daily deltas (amount = income - expenses for that day).
  const buildBalanceData = () => {
    if (totalMoney == null) return [];

    const amountByDate = new Map(allData.map(item => [item.date, item.amount]));

    const daily = [];
    let runningDelta = 0;
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dateString = formatToString(date);
      runningDelta += amountByDate.get(dateString) ?? 0;
      daily.push({ x: dateString, y: runningDelta, date });
    }

    const finalDelta = daily.length > 0 ? daily[daily.length - 1].y : 0;
    const offset = totalMoney - finalDelta;
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
      title: { display: false },
      subtitle: { display: false }
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

  const parsedInput = parseFloat(totalMoneyInput);
  const isInputValid = Number.isFinite(parsedInput);
  const isDirty = isInputValid && totalMoney != null && parsedInput.toFixed(2) !== totalMoney.toFixed(2);

  return (
    <div className="dashboard__widgets">
      <div className={`widget__moneystats ${isMinimized ? 'minimized' : ''}`}>
        <button
          className="widget__moneystats__minimize-toggle"
          onClick={() => setIsMinimized(prev => !prev)}
          aria-label={isMinimized ? 'Expand money evolution widget' : 'Minimize money evolution widget'}
          aria-expanded={!isMinimized}
          title={isMinimized ? 'Expand widget' : 'Minimize widget'}
        >
          {isMinimized ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
        </button>
        <div className="widget__moneystats__heading">
          <h3 className="widget__moneystats__title">Money evolution</h3>
          <div className="widget__moneystats__subtitle">
            <span>{subtitleText}</span>
            {windowChange && (
              <span className={`widget__moneystats__change widget__moneystats__change--${windowChange.direction}`}>
                <span aria-hidden="true">{changeArrow[windowChange.direction]}</span>
                <span>
                  {windowChange.absolute >= 0 ? '+' : '−'}
                  {currencyFormatter.format(Math.abs(windowChange.absolute))}
                  {windowChange.pct !== null && (
                    <> ({windowChange.pct >= 0 ? '+' : '−'}{Math.abs(windowChange.pct).toFixed(2)}%)</>
                  )}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="widget__moneystats__controls">
          {/* <button
            className="widget__moneystats__experiment-button"
            onClick={handleTriggerExperiment}
            disabled={isTriggeringExperiment}
            aria-label={isTriggeringExperiment ? 'Triggering experiment job' : 'Trigger experiment job'}
            title="Trigger experiment job (admin only)"
          >
            <ScienceRoundedIcon />
          </button> */}
          <label className="widget__moneystats__total-input-group">
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              className="widget__moneystats__total-input"
              value={totalMoneyInput}
              onChange={(e) => setTotalMoneyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSyncTotalMoney(); }}
              disabled={totalMoney == null || isSyncing}
              placeholder="0.00"
              aria-label="Current total money"
            />
            <span className="widget__moneystats__total-currency" aria-hidden="true">€</span>
          </label>
          <button
            className="widget__moneystats__sync-button"
            onClick={handleSyncTotalMoney}
            disabled={!isDirty || isSyncing}
            aria-label={isSyncing ? 'Syncing total money' : 'Sync total money'}
          >
            {isSyncing ? 'Syncing…' : 'Sync'}
          </button>
        </div>
        <div className="widget__moneystats__chart-wrapper">
          <div className="widget__moneystats__chart">
            <Line options={options} data={chartData} />
          </div>
        </div>
        {(hasNextPage || hasLoadedEarlier) && (
          <div className="widget__moneystats__earlier-row">
            {hasNextPage && (
              <button
                type="button"
                className="widget__moneystats__earlier-button"
                onClick={loadPreviousDays}
                disabled={isLoading}
                aria-label={isLoading ? 'Loading earlier days' : 'Load earlier days'}
                title="Load earlier days"
              >
                <span aria-hidden="true">←</span> Earlier
              </button>
            )}
            {hasLoadedEarlier && (
              <button
                type="button"
                className="widget__moneystats__reset-button"
                onClick={resetView}
                disabled={isLoading}
                aria-label="Reset to last 30 days"
                title="Reset to last 30 days"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
