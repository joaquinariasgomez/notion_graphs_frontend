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
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { subDays } from 'date-fns';
import { formatToString, fromDateString } from "../utils/DateUtils";

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

const DATE_WINDOW_DAYS = 30;

// TODO JOAQUIN: la grafica debe mostrar los ultimos dias siempre cuando se carguen los dias anteriores.
// tambien, se debe agrupar por mes si el numero de dias es superior a un valor
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

  const buildCumulativeData = () => {
    let cumulative = 0;
    return allData.map(item => {
      cumulative += item.amount;
      return { x: item.date, y: cumulative };
    });
  };

  const chartData = {
    datasets: [
      {
        label: 'Cumulative Expenses',
        data: buildCumulativeData(),
        fill: 'origin',
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        tension: 0.0,
        pointRadius: 3
      }
    ]
  };

  const options = {
    animation: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: 'Money evolution'
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
          unit: 'day',
          tooltipFormat: 'MMM d, yyyy'
        },
        ticks: {
          font: { size: 11 }
        }
      },
      y: {
        beginAtZero: true
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
              title="Load previous days"
            >
              ←
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
