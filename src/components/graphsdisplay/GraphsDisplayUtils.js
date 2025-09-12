import { formatToString, getFirstDayOfMonthForDate, getFirstDayOfWeekForDate, getFirstDayOfYearForDate, getInitialDayFromSettings, getLastDayFromSettings, getLastDayOfMonthForDate, getLastDayOfWeekForDate, getLastDayOfYearForDate } from "../../utils/DateUtils";
import { addDays, format, isBefore, isAfter } from 'date-fns';

/**
   * Processes graph data to create a continuous series from a start to an end date.
   * Fills in missing days with a value of 0.
   *
   * @param {object} graphConfiguration - Contains startDate and endDate strings ('YYYY-MM-DD').
   * @param {object} graphData - Contains the sparse data array.
   * @returns {{dates: string[], values: number[]}} - An object with complete dates and values.
   */
export function processContinuousGraphData(graphConfiguration, graphData) {
  const groupByTime = graphConfiguration.customGraphSettings.visualizationSettings.groupByTime;
  if (!graphData?.data) {
    return { dates: [], values: [] };
  }

  switch (groupByTime) {
    default:
    case "DAY":
      return processDataGroupByDay(graphConfiguration, graphData);
    case "WEEK":
      return processDataGroupByWeek(graphConfiguration, graphData);
    case "MONTH":
      return processDataGroupByMonth(graphConfiguration, graphData);
    case "YEAR":
      return processDataGroupByYear(graphConfiguration, graphData);
  }
}

export function getGraphTitleFromConfiguration(graphConfiguration) {
  return "Test graph";
}

function processDataGroupByDay(graphConfiguration, graphData) {
  const dates = [];
  const values = [];
  const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));

  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  var cumulativeValue = 0;

  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;

  while (currentDate <= lastDate) {
    const dateString = formatToString(currentDate);
    dates.push(dateString);
    const dailyTotal = dataMap.get(dateString) || 0;
    cumulativeValue += dailyTotal;

    if (isCumulative) {
      values.push(cumulativeValue);
    } else {
      values.push(dailyTotal);
    }
    currentDate = addDays(currentDate, 1);
  }

  return { dates, values };
}

function processDataGroupByWeek(graphConfiguration, graphData) {
  const dates = [];
  const values = [];
  const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));

  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  var cumulativeValue = 0;

  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;

  while (currentDate <= lastDate) {
    const weekStart = getFirstDayOfWeekForDate(currentDate);
    const weekEnd = getLastDayOfWeekForDate(currentDate);

    let weeklyTotal = 0;
    let dayInWeek = new Date(weekStart);
    // Iterate through each day within this week to sum up values
    while (dayInWeek <= weekEnd) {
      const isAfterStartDate = dayInWeek >= firstDate;
      const isBeforeEndDate = dayInWeek <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInWeek);
        weeklyTotal += dataMap.get(dateString) || 0;
      }
      dayInWeek = addDays(dayInWeek, 1);
    }

    dates.push(formatToString(weekStart));
    cumulativeValue += weeklyTotal;

    if (isCumulative) {
      values.push(cumulativeValue);
    } else {
      values.push(weeklyTotal);
    }
    // Jump to start of the next week
    currentDate = addDays(weekEnd, 1);
  }

  return { dates, values };
}

function processDataGroupByMonth(graphConfiguration, graphData) {
  const dates = [];
  const values = [];
  const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));

  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  var cumulativeValue = 0;

  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;

  while (currentDate <= lastDate) {
    const monthStart = getFirstDayOfMonthForDate(currentDate);
    const monthEnd = getLastDayOfMonthForDate(currentDate);

    let monthlyTotal = 0;
    let dayInMonth = new Date(monthStart);
    // Iterate through each day within this month to sum up values
    while (dayInMonth <= monthEnd) {
      const isAfterStartDate = dayInMonth >= firstDate;
      const isBeforeEndDate = dayInMonth <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInMonth);
        monthlyTotal += dataMap.get(dateString) || 0;
      }
      dayInMonth = addDays(dayInMonth, 1);
    }

    dates.push(formatToString(monthStart));
    cumulativeValue += monthlyTotal;

    if (isCumulative) {
      values.push(cumulativeValue);
    } else {
      values.push(monthlyTotal);
    }
    // Jump to start of the next month
    currentDate = addDays(monthEnd, 1);
  }

  return { dates, values };
}

function processDataGroupByYear(graphConfiguration, graphData) {
  const dates = [];
  const values = [];
  const dataMap = new Map(graphData.data.map(item => [item.date, item.totalAmount]));

  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  var cumulativeValue = 0;

  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;

  while (currentDate <= lastDate) {
    const yearStart = getFirstDayOfYearForDate(currentDate);
    const yearEnd = getLastDayOfYearForDate(currentDate);

    let yearlyTotal = 0;
    let dayInYear = new Date(yearStart);
    // Iterate through each day within this month to sum up values
    while (dayInYear <= yearEnd) {
      const isAfterStartDate = dayInYear >= firstDate;
      const isBeforeEndDate = dayInYear <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInYear);
        yearlyTotal += dataMap.get(dateString) || 0;
      }
      dayInYear = addDays(dayInYear, 1);
    }

    dates.push(formatToString(yearStart));
    cumulativeValue += yearlyTotal;

    if (isCumulative) {
      values.push(cumulativeValue);
    } else {
      values.push(yearlyTotal);
    }
    // Jump to start of the next year
    currentDate = addDays(yearEnd, 1);
  }

  return { dates, values };
}