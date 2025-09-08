import { getInitialDayFromSettings, getLastDayFromSettings } from "../../utils/DateUtils";
import { format } from 'date-fns';

/**
   * Processes graph data to create a continuous series from a start to an end date.
   * Fills in missing days with a value of 0.
   *
   * @param {object} graphConfiguration - Contains startDate and endDate strings ('YYYY-MM-DD').
   * @param {object} graphData - Contains the sparse data array.
   * @returns {{dates: string[], values: number[]}} - An object with complete dates and values.
   */
export function processContinuousGraphData(graphConfiguration, graphData) {
  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  if (!graphData?.data) {
    return { dates: [], values: [] };
  }

  const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));
  const dates = [];
  const values = [];
  var cumulativeValue = 0;

  const currentDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  while (currentDate <= lastDate) {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    dates.push(formattedDate);
    const value = dataMap.get(formattedDate) || 0;
    cumulativeValue = cumulativeValue + value;

    if (isCumulative) {
      values.push(cumulativeValue);
    } else {
      values.push(value);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return { dates, values };
}