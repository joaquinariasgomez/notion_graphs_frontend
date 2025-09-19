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
  const groupByCategory = graphConfiguration.customGraphSettings.visualizationSettings.groupByCategory;
  const groupByIncomeBankAccounts = graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeBankAccounts;
  const groupByIncomeSources = graphConfiguration.customGraphSettings.visualizationSettings.groupByIncomeSources;
  if (!graphData?.data) {
    return { dates: [], datasets: [] };
  }

  const dataMap = new Map();
  const categories = new Set(); // Could be categories, incomeBankAccounts or incomeSources

  graphData.data.forEach(dailyData => {
    const { date, categoryAmounts, incomeBankAccountAmounts, incomeSourceAmounts } = dailyData;
    if (!dataMap.has(date)) {
      dataMap.set(date, new Map());
    }
    if (groupByCategory) {
      categoryAmounts.forEach(categoryEntry => {
        categories.add(categoryEntry.category);
        dataMap.get(date).set(categoryEntry.category, categoryEntry.amount);
      });
    } else if (groupByIncomeBankAccounts) {
      incomeBankAccountAmounts.forEach(incomeBankAccountEntry => {
        categories.add(incomeBankAccountEntry.incomeBankAccount);
        dataMap.get(date).set(incomeBankAccountEntry.incomeBankAccount, incomeBankAccountEntry.amount);
      });
    } else if (groupByIncomeSources) {
      incomeSourceAmounts.forEach(incomeSourceEntry => {
        categories.add(incomeSourceEntry.incomeSource);
        dataMap.get(date).set(incomeSourceEntry.incomeSource, incomeSourceEntry.amount);
      });
    }
  });

  const labels = [];
  const uniqueCategories = Array.from(categories);
  let datasets = uniqueCategories.map(category => ({
    label: category,
    data: [],
  }));

  switch (groupByTime) {
    default:
    case "DAY":
      return processGroupedDataGroupByDay(graphConfiguration, labels, datasets, dataMap);
    case "WEEK":
      return processGroupedDataGroupByWeek(graphConfiguration, labels, datasets, dataMap);
    case "MONTH":
      return processGroupedDataGroupByMonth(graphConfiguration, labels, datasets, dataMap);
    case "YEAR":
      return processGroupedDataGroupByYear(graphConfiguration, labels, datasets, dataMap);
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
  let graphTitle = '';
  if (graphConfiguration.requestType === 'CUSTOM_GRAPH') {
    // Custom graph
    const source = graphConfiguration.customGraphSettings.dataSettings.source;
    const time = graphConfiguration.customGraphSettings.dataSettings.time;
    graphTitle += sourceToText(source) + ' ' + timeToText(time, graphConfiguration);
    const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
    if (isCumulative) {
      graphTitle += ' (cumulative)';
    }
  } else {
    // Burndown
  }
  return graphTitle;
}

function sourceToText(source) {
  switch (source) {
    default:
    case 'EXPENSES':
      return 'Expenses';
    case 'INCOMES':
      return 'Incomes';
    case 'SAVINGS':
      return 'Savings';
  }
}

function timeToText(time, graphConfiguration) {
  switch (time) {
    default:
    case 'LAST_WEEK':
      return 'in the last week';
    case 'LAST_MONTH':
      return 'in the last month';
    case 'LAST_YEAR':
      return 'in the last year';
    case 'CUSTOM':
      const customStartDate = graphConfiguration.customGraphSettings.dataSettings.customStartDate;
      const customEndDate = graphConfiguration.customGraphSettings.dataSettings.customEndDate;
      return '(' + customStartDate + ' to ' + customEndDate + ')';
  }
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

function processGroupedDataGroupByDay(graphConfiguration, labels, datasets, dataMap) {
  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  const cumulativesPerCategory = new Map();
  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    labels.push(formatToString(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  labels.forEach(date => {
    datasets.forEach(dataset => {
      const dailyCategoryMap = dataMap.get(date);
      let valueToPush;
      const dailyAmount = dailyCategoryMap ? dailyCategoryMap.get(dataset.label) || 0 : 0;

      if (isCumulative) {
        const previousCumulative = cumulativesPerCategory.get(dataset.label) || 0;
        const newCumulative = previousCumulative + dailyAmount;
        cumulativesPerCategory.set(dataset.label, newCumulative);
        valueToPush = newCumulative;
      } else {
        valueToPush = dailyAmount;
      }
      dataset.data.push(valueToPush);
    });
  });

  datasets = applyColorToDatasets(datasets, graphConfiguration);
  return { labels, datasets };
}

function processGroupedDataGroupByWeek(graphConfiguration, labels, datasets, dataMap) {
  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  const cumulativesPerCategory = new Map();
  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    const weekStart = getFirstDayOfWeekForDate(currentDate);
    const weekEnd = getLastDayOfWeekForDate(currentDate);

    labels.push(formatToString(weekStart));

    const weeklyTotals = new Map();
    let dayInWeek = new Date(weekStart);
    while (dayInWeek <= weekEnd) {
      const isAfterStartDate = dayInWeek >= firstDate;
      const isBeforeEndDate = dayInWeek <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInWeek);
        const dailyCategoryMap = dataMap.get(dateString);
        if (dailyCategoryMap) {
          dailyCategoryMap.forEach((amount, category) => {
            const currentTotal = weeklyTotals.get(category) || 0;
            weeklyTotals.set(category, currentTotal + amount);
          });
        }
      }
      dayInWeek = addDays(dayInWeek, 1);
    }

    datasets.forEach(dataset => {
      const categoryLabel = dataset.label;
      const weeklyAmount = weeklyTotals.get(categoryLabel) || 0;

      let valueToPush;
      if (isCumulative) {
        const previousCumulative = cumulativesPerCategory.get(categoryLabel) || 0;
        const newCumulative = previousCumulative + weeklyAmount;
        cumulativesPerCategory.set(categoryLabel, newCumulative);
        valueToPush = newCumulative;
      } else {
        valueToPush = weeklyAmount;
      }
      dataset.data.push(valueToPush);
    });
    // Jump to start of the next week
    currentDate = addDays(weekEnd, 1);
  }

  datasets = applyColorToDatasets(datasets, graphConfiguration);
  return { labels, datasets };
}

function processGroupedDataGroupByMonth(graphConfiguration, labels, datasets, dataMap) {
  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  const cumulativesPerCategory = new Map();
  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    const monthStart = getFirstDayOfMonthForDate(currentDate);
    const monthEnd = getLastDayOfMonthForDate(currentDate);

    labels.push(formatToString(monthStart));

    const monthlyTotals = new Map();
    let dayInMonth = new Date(monthStart);
    while (dayInMonth <= monthEnd) {
      const isAfterStartDate = dayInMonth >= firstDate;
      const isBeforeEndDate = dayInMonth <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInMonth);
        const dailyCategoryMap = dataMap.get(dateString);
        if (dailyCategoryMap) {
          dailyCategoryMap.forEach((amount, category) => {
            const currentTotal = monthlyTotals.get(category) || 0;
            monthlyTotals.set(category, currentTotal + amount);
          });
        }
      }
      dayInMonth = addDays(dayInMonth, 1);
    }

    datasets.forEach(dataset => {
      const categoryLabel = dataset.label;
      const monthlyAmount = monthlyTotals.get(categoryLabel) || 0;

      let valueToPush;
      if (isCumulative) {
        const previousCumulative = cumulativesPerCategory.get(categoryLabel) || 0;
        const newCumulative = previousCumulative + monthlyAmount;
        cumulativesPerCategory.set(categoryLabel, newCumulative);
        valueToPush = newCumulative;
      } else {
        valueToPush = monthlyAmount;
      }
      dataset.data.push(valueToPush);
    });
    // Jump to start of the next month
    currentDate = addDays(monthEnd, 1);
  }

  datasets = applyColorToDatasets(datasets, graphConfiguration);
  return { labels, datasets };
}

function processGroupedDataGroupByYear(graphConfiguration, labels, datasets, dataMap) {
  const isCumulative = graphConfiguration.customGraphSettings.visualizationSettings.cumulative;
  const cumulativesPerCategory = new Map();
  const firstDate = getInitialDayFromSettings(graphConfiguration);
  const lastDate = getLastDayFromSettings(graphConfiguration);
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    const yearStart = getFirstDayOfYearForDate(currentDate);
    const yearEnd = getLastDayOfYearForDate(currentDate);

    labels.push(formatToString(yearStart));

    const yearlyTotals = new Map();
    let dayInYear = new Date(yearStart);
    while (dayInYear <= yearEnd) {
      const isAfterStartDate = dayInYear >= firstDate;
      const isBeforeEndDate = dayInYear <= lastDate;

      if (isAfterStartDate && isBeforeEndDate) {
        const dateString = formatToString(dayInYear);
        const dailyCategoryMap = dataMap.get(dateString);
        if (dailyCategoryMap) {
          dailyCategoryMap.forEach((amount, category) => {
            const currentTotal = yearlyTotals.get(category) || 0;
            yearlyTotals.set(category, currentTotal + amount);
          });
        }
      }
      dayInYear = addDays(dayInYear, 1);
    }

    datasets.forEach(dataset => {
      const categoryLabel = dataset.label;
      const yearlyAmount = yearlyTotals.get(categoryLabel) || 0;

      let valueToPush;
      if (isCumulative) {
        const previousCumulative = cumulativesPerCategory.get(categoryLabel) || 0;
        const newCumulative = previousCumulative + yearlyAmount;
        cumulativesPerCategory.set(categoryLabel, newCumulative);
        valueToPush = newCumulative;
      } else {
        valueToPush = yearlyAmount;
      }
      dataset.data.push(valueToPush);
    });
    // Jump to start of the next month
    currentDate = addDays(yearEnd, 1);
  }

  datasets = applyColorToDatasets(datasets, graphConfiguration);
  return { labels, datasets };
}

function applyColorToDatasets(datasets, graphConfiguration) {
  const type = graphConfiguration.customGraphSettings.visualizationSettings.type;
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
    const solidColor = colorPalette[index % colorPalette.length];
    const transparentColor = solidColor.replace('rgb', 'rgba').replace(')', ', 0.3)');

    dataset.backgroundColor = transparentColor;
    dataset.borderColor = solidColor;
    if (type === 'LINE') {
      dataset.borderWidth = 2;
    } else {
      dataset.borderWidth = 1.5;
    }

    dataset.tension = 0.0;
    dataset.fill = 'stack';
    dataset.pointRadius = 0;
    dataset.pointHitRadius = 10;
  });
  return datasets;
}