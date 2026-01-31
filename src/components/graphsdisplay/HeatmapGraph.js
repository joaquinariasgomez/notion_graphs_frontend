import { useEffect, useRef, useMemo } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import { calculateHeatmapData, getGraphTitle } from './GraphsDisplayUtils';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';

export default function HeatmapGraph({ graphConfiguration, graphData, showTitle }) {
  const calRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate the number of months to display based on the date range
  const { startDate, numberOfMonths, maxValue } = useMemo(
    () => calculateHeatmapData(graphConfiguration, graphData),
    [graphConfiguration, graphData]
  );

  useEffect(() => {
    if (!graphData?.data) return;

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
    <div className='heatmap__container'>
      {showTitle && (
        <div className='heatmaptitle'>
          {getGraphTitle(graphConfiguration)}
        </div>
      )}
      <div
        ref={containerRef}
        className='heatmapchart'
      // style={{
      //   width: '100%',
      //   overflowX: 'auto',
      //   overflowY: 'hidden'
      // }}
      ></div>
    </div>
  );
}