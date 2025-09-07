
/**
   * Processes graph data to create a continuous series from a start to an end date.
   * Fills in missing days with a value of 0.
   *
   * @param {object} graphConfiguration - Contains startDate and endDate strings ('YYYY-MM-DD').
   * @param {object} graphData - Contains the sparse data array.
   * @returns {{dates: string[], values: number[]}} - An object with complete dates and values.
   */
export function processContinuousGraphData(graphConfiguration, graphData) {
  const { dataSettings } = graphConfiguration.customGraphSettings;
  const { customStartDate: startDate, customEndDate: endDate } = dataSettings;
  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  if (!startDate || !endDate || !graphData?.data) {
    return { dates: [], values: [] };
  }

  const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));
  const dates = [];
  const values = [];
  const cumulativeValue = 0;

  const currentDate = new Date(`${startDate}T00:00:00`);
  const lastDate = new Date(`${endDate}T00:00:00`);
  while (currentDate <= lastDate) {
    const formattedDate = currentDate.toISOString().split('T')[0];
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