import { parse } from "date-fns";

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

export function getCurrentDay() {
  return new Date();
}

export function getFirstDayOfCurrentWeek() {
  const now = new Date();
  // getDay() returns 0 for Sunday, 1 for Monday...
  const dayOfWeek = now.getDay();
  const firstDay = new Date(now);

  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  firstDay.setDate(now.getDate() - daysToSubtract);
  firstDay.setHours(0, 0, 0, 0);
  return firstDay;
}

export function getFirstDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getFirstDayOfCurrentYear() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
}