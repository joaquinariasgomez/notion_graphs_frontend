import { useEffect, useRef, useMemo } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import { getInitialDayFromSettings, getLastDayFromSettings } from '../../utils/DateUtils';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';

export default function HeatmapGraph({ graphConfiguration, graphData, showTitle }) {
  const calRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate the number of months to display based on the date range
  const { startDate, numberOfMonths, maxValue } = useMemo(() => {
    if (!graphData?.data || graphData.data.length === 0) {
      return { startDate: new Date(), numberOfMonths: 1, maxValue: 100 };
    }

    const firstDate = getInitialDayFromSettings(graphConfiguration, graphData);
    const lastDate = getLastDayFromSettings(graphConfiguration, graphData);

    // Calculate number of months between dates
    const months = (lastDate.getFullYear() - firstDate.getFullYear()) * 12
      + (lastDate.getMonth() - firstDate.getMonth()) + 1;

    // Find max value for color scale
    const max = Math.max(...graphData.data.map(d => d.totalAmount), 1);

    return { startDate: firstDate, numberOfMonths: months, maxValue: max };
  }, [graphConfiguration, graphData]);

  useEffect(() => {
    if (!graphData?.data) return;
    console.log(graphData.data);

    // Create new CalHeatmap instance
    calRef.current = new CalHeatmap();

    calRef.current.paint({
      itemSelector: containerRef.current,
      verticalOrientation: false,
      range: numberOfMonths,
      date: {
        start: startDate,
        locale: { weekStart: 1 }, // 0 = Sunday, 1 = Monday
      },
      data: {
        source: graphData.data,
        x: 'date',           // Property name containing the date
        y: 'totalAmount',    // Property name containing the value
      },
      scale: {
        color: {
          type: 'linear',
          scheme: 'Greens',
          domain: [0, maxValue],
        },
      },
      domain: {
        type: 'month',
        padding: [10, 10, 10, 10],
        gutter: 10, // Space between months
        label: {
          position: 'top',
          textAlign: 'middle',
          height: 30,
          text: 'MMMM YYYY', // Shows "January 2026"
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
          },
        },
      },
      subDomain: {
        type: 'xDay',
        radius: 4,
        width: 35,   // Increased from 15
        height: 35,  // Increased from 15
        gutter: 4,   // Space between cells
        label: 'D',
      },
    },
      [
        [
          Tooltip,
          {
            text: (date, value, dayjsDate) => {
              return `€ ${(value ?? 0).toFixed(2)}`;
            },
          },
        ],
      ]);

    // Cleanup: destroy the heatmap when component unmounts or dependencies change
    return () => {
      if (calRef.current) {
        calRef.current.destroy();
        calRef.current = null;
      }
    };
  }, [graphConfiguration, graphData, startDate, numberOfMonths, maxValue]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        overflowX: 'auto',  // Horizontal scroll if needed
        overflowY: 'hidden'
      }}
    ></div>
  );
}