import { useEffect, useRef } from 'react';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';

// Optionally import the CSS
import 'cal-heatmap/cal-heatmap.css';

export default function HeatmapGraph({ graphConfiguration, graphData, showTitle }) {
  const calRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Create new CalHeatmap instance
    calRef.current = new CalHeatmap();

    calRef.current.paint({
      itemSelector: containerRef.current,
      verticalOrientation: false,
      range: 5,       // call function to guess number of months from graphConfiguration
      // itemSelector: '#ex-1',
      date: {
        start: new Date('2026-01-01'),
        locale: { weekStart: 1 }, // 0 = Sunday, 1 = Monday
      },
      scale: { color: { type: 'diverging', scheme: 'PRGn', domain: [-10, 15] } },
      domain: {
        type: 'month',
        padding: [10, 10, 10, 10],
        label: { position: 'top' },
      },
      subDomain: { type: 'xDay', radius: 2, width: 15, height: 15, label: 'D' }
    },

    );

    // Cleanup: destroy the heatmap when component unmounts or dependencies change
    return () => {
      if (calRef.current) {
        calRef.current.destroy();
        calRef.current = null;
      }
    };
  }, [graphConfiguration, graphData]);

  return (
    <div ref={containerRef}></div>
  );
}