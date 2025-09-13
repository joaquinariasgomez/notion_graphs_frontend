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

/**
   * Processes graph data to create a continuous series from a start to an end date.
   * Fills in missing days with a value of 0.
   *
   * @param {object} graphConfiguration - Contains startDate and endDate strings ('YYYY-MM-DD').
   * @param {object} graphData - Contains the sparse data array.
   * @returns {{labels: string[], datasets: object[]}} - An object with complete dates and values.
   */
export function processGroupedGraphData(graphConfiguration, graphData) {
  const groupByTime = graphConfiguration.customGraphSettings.visualizationSettings.groupByTime;
  if (!graphData?.data) {
    return { dates: [], datasets: [] };
  }

  switch (groupByTime) {
    default:
    case "DAY":
      return processGroupedDataGroupByDay(graphConfiguration, graphData);
    case "WEEK":
      return processGroupedDataGroupByWeek(graphConfiguration, graphData);
    // case "MONTH":
    //   return processDataGroupByMonth(graphConfiguration, graphData);
    // case "YEAR":
    //   return processDataGroupByYear(graphConfiguration, graphData);
  }
}

export function getTimeUnitFromConfiguration(graphConfiguration) {
  const groupByTime = graphConfiguration.customGraphSettings.visualizationSettings.groupByTime;
  switch (groupByTime) {
    default:
    case "DAY":
      return 'day';
    case "WEEK":
      return 'week';
    case "MONTH":
      return 'month';
    case "YEAR":
      return 'year';
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

function processGroupedDataGroupByDay(graphConfiguration, graphData) {
  const dataMap = new Map();
  const categories = new Set(); // Could be categories, for example

  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  var cumulativeValue = 0;  // TODO: adjust for isCumulative

  graphData.data.forEach(dailyData => {
    const { date, categoryAmounts } = dailyData;  // TODO: adjust also for "incomeBankAccountAmounts" or "incomeSourceAmounts"

    if (!dataMap.has(date)) {
      dataMap.set(date, new Map());
    }

    // For each day, iterate through its categories and populate the map
    categoryAmounts.forEach(categoryEntry => {
      categories.add(categoryEntry.category);
      dataMap.get(date).set(categoryEntry.category, categoryEntry.amount);
    });
  });

  const labels = [];
  const uniqueCategories = Array.from(categories);
  let datasets = uniqueCategories.map(category => ({
    label: category,
    data: [],
  }));

  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    labels.push(formatToString(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  labels.forEach(date => {
    datasets.forEach(dataset => {
      // ...find the corresponding value, or default to 0.
      const dailyCategoryMap = dataMap.get(date);
      const value = dailyCategoryMap ? dailyCategoryMap.get(dataset.label) || 0 : 0;
      dataset.data.push(value);
    });
  });

  datasets = applyColorToDatasets(datasets);
  return { labels, datasets };
}

function processGroupedDataGroupByWeek(graphConfiguration, graphData) {
  const dataMap = new Map();
  const categories = new Set(); // Could be categories, for example

  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  var cumulativeValue = 0;  // TODO: adjust for isCumulative

  graphData.data.forEach(dailyData => {
    const { date, categoryAmounts } = dailyData;  // TODO: adjust also for "incomeBankAccountAmounts" or "incomeSourceAmounts"

    if (!dataMap.has(date)) {
      dataMap.set(date, new Map());
    }

    // For each day, iterate through its categories and populate the map
    categoryAmounts.forEach(categoryEntry => {
      categories.add(categoryEntry.category);
      dataMap.get(date).set(categoryEntry.category, categoryEntry.amount);
    });
  });

  const labels = [];
  const uniqueCategories = Array.from(categories);
  let datasets = uniqueCategories.map(category => ({
    label: category,
    data: [],
  }));

  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    const weekStart = getFirstDayOfWeekForDate(currentDate);
    const weekEnd = getLastDayOfWeekForDate(currentDate);

    labels.push(formatToString(weekStart));

    const weeklyTotals = new Map();
    let dayInWeek = new Date(weekStart);
    // Iterate through each day within this week to sum up values
    while (dayInWeek <= weekEnd) {
      const isAfterStartDate = dayInWeek >= firstDate;
      const isBeforeEndDate = dayInWeek <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInWeek);
        const dailyCategoryMap = dataMap.get(dateString);
        if (dailyCategoryMap) {
          // Add this day's amounts to our weekly totals
          dailyCategoryMap.forEach((amount, category) => {
            const currentTotal = weeklyTotals.get(category) || 0;
            weeklyTotals.set(category, currentTotal + amount);
          });
        }
      }
      dayInWeek = addDays(dayInWeek, 1);
    }

    datasets.forEach(dataset => {
      const total = weeklyTotals.get(dataset.label) || 0;
      dataset.data.push(total);
    });
    // Jump to start of the next week
    currentDate = addDays(weekEnd, 1);
  }

  datasets = applyColorToDatasets(datasets);
  return { labels, datasets };
}

function applyColorToDatasets(datasets) {
  const colorPalette = [
    'rgb(54, 162, 235)',      // Blue
    'rgb(255, 99, 132)',      // Red
    'rgb(75, 192, 192)',      // Teal
    'rgb(255, 205, 86)',      // Yellow
    'rgb(153, 102, 255)',     // Purple
    'rgb(255, 159, 64)',      // Orange
    'rgb(201, 203, 207)',     // Grey
    'rgb(230, 100, 100)',     // Light Red
    'rgb(100, 230, 100)',     // Light Green
    'rgb(100, 100, 230)',     // Light Blue
  ];
  datasets.forEach((dataset, index) => {
    dataset.borderColor = colorPalette[index % colorPalette.length];
    dataset.backgroundColor = dataset.borderColor.replace('rgb', 'rgba').replace(')', ', 0.3)');
    dataset.tension = 0.0;
    dataset.borderWidth = 2;
    dataset.fill = 'stack';
    dataset.pointRadius = 0;
    dataset.pointHitRadius = 5;
  });
  return datasets;
}