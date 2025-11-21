import { endOfMonth, endOfWeek, endOfYear, format, parse, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { enUS } from 'date-fns/locale';

export function getInitialDayFromSettings(graphConfiguration) {
  const { dataSettings } = graphConfiguration.customGraphSettings;
  const { customStartDate: startDate, time: configTime } = dataSettings;

  switch (configTime) {
    case "LAST_WEEK":
      return getFirstDayOfCurrentWeek();
    case "LAST_MONTH":
      return getFirstDayOfCurrentMonth();
    case "LAST_YEAR":
      return getFirstDayOfCurrentYear();
    case "CUSTOM":
      return fromDateString(startDate);
    default:
      return fromDateString(startDate);
  }
}

export function getLastDayFromSettings(graphConfiguration) {
  const { dataSettings } = graphConfiguration.customGraphSettings;
  const { customEndDate: endDate, time: configTime } = dataSettings;

  switch (configTime) {
    case "LAST_WEEK":
    case "LAST_MONTH":
    case "LAST_YEAR":
      return getCurrentDay();
    case "CUSTOM":
      return fromDateString(endDate);
    default:
      return fromDateString(endDate);
  }
}

export function fromDateString(dateString) {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

export function formatToString(date) {
  return format(date, 'yyyy-MM-dd');
}

export function getCurrentDay() {
  return new Date();
}

export function getFirstDayOfCurrentWeek() {
  const weekConfig = { locale: enUS, weekStartsOn: 1 };
  return startOfWeek(new Date(), weekConfig);
}

export function getFirstDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getFirstDayOfCurrentYear() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}

export function getFirstDayOfWeekForDate(date) {
  const weekConfig = { locale: enUS, weekStartsOn: 1 };
  return startOfWeek(date, weekConfig);
}

export function getLastDayOfWeekForDate(date) {
  const weekConfig = { locale: enUS, weekStartsOn: 1 };
  return endOfWeek(date, weekConfig);
}

export function getFirstDayOfMonthForDate(date) {
  return startOfMonth(date);
}

export function getLastDayOfMonthForDate(date) {
  return endOfMonth(date);
}

export function getFirstDayOfYearForDate(date) {
  return startOfYear(date);
}

export function getLastDayOfYearForDate(date) {
  return endOfYear(date);
}

export function getRelativeTimeFromTimestamp(timestamp) {
  if (timestamp == null || timestamp == 0) return '';

  const currentTimestamp = Date.now() / 1000;
  const timePastInSeconds = Number(currentTimestamp) - Number(timestamp);
  if (timePastInSeconds < 0) timePastInSeconds = -timePastInSeconds;

  if (timePastInSeconds < 60) {
    if (Math.round(timePastInSeconds) > 1) {
      return Math.round(timePastInSeconds) + " secs ago"
    }
    else {
      return Math.round(timePastInSeconds) + " sec ago"
    }
  }
  else {
    const timePastInMinutes = timePastInSeconds / 60;
    if (timePastInMinutes < 60) {
      if (Math.round(timePastInMinutes) > 1) {
        return Math.round(timePastInMinutes) + " mins ago"
      }
      else {
        return Math.round(timePastInMinutes) + " min ago"
      }
    }
    else {
      const timePastInHours = timePastInMinutes / 60;
      if (timePastInHours < 24) {
        if (Math.round(timePastInHours) > 1) {
          return Math.round(timePastInHours) + " hours ago"
        }
        else {
          return Math.round(timePastInHours) + " hour ago"
        }
      }
      else {
        const timePastInDays = timePastInHours / 24;
        if (Math.round(timePastInDays) > 1) {
          return Math.round(timePastInDays) + " days ago"
        }
        else {
          return Math.round(timePastInDays) + " day ago"
        }
      }
    }
  }
}