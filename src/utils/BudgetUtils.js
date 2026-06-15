import { COLOR_PALETTE } from "../components/graphsdisplay/GraphsDisplayUtils";

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Format a number as a euro amount (e.g. 1234.5 -> "€1,235")
export function formatEur(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return '€' + Math.round(safe).toLocaleString('en-US');
}

// Categories come from the backend as plain strings with no color. Assign a
// stable color by the category's position in the (sorted) list, reusing the
// same palette the graphs use so the whole app stays visually consistent.
export function buildCategoryColorMap(categories) {
  const colorMap = {};
  const sorted = [...categories].sort();
  sorted.forEach((category, index) => {
    colorMap[category] = COLOR_PALETTE[index % COLOR_PALETTE.length];
  });
  return colorMap;
}

// The backend gives an average per category but no slider bounds. Derive a
// sensible max (roughly double the average, with a floor) and a "nice" step
// based on the magnitude so dragging feels natural.
export function deriveSliderBounds(average) {
  const avg = Number.isFinite(average) && average > 0 ? average : 0;
  const rawMax = Math.max(avg * 2, 100);

  let step;
  if (rawMax <= 200) step = 5;
  else if (rawMax <= 1000) step = 10;
  else step = 25;

  // Round the max up to a whole number of steps.
  const max = Math.ceil(rawMax / step) * step;
  return { max, step };
}

// Percentage delta of a value vs its average, with a label/intent for the chip.
export function computeAverageDelta(value, average) {
  if (!Number.isFinite(average) || average <= 0) {
    return { label: 'No history', intent: 'neutral' };
  }
  const delta = Math.round((value - average) / average * 100);
  if (Math.abs(delta) <= 1) {
    return { label: 'At average', intent: 'neutral' };
  }
  if (delta < 0) {
    return { label: delta + '% vs avg', intent: 'under' };
  }
  return { label: '+' + delta + '% vs avg', intent: 'over' };
}

// Derive a budget's status from its month/year relative to the current date.
// month is 1-12. Returns 'tracking' | 'upcoming' | 'closed'.
export function getBudgetStatus(budget, now = new Date()) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  if (budget.year === currentYear && budget.month === currentMonth) {
    return 'tracking';
  }
  if (budget.year > currentYear || (budget.year === currentYear && budget.month > currentMonth)) {
    return 'upcoming';
  }
  return 'closed';
}

// Days remaining in a budget's month (only meaningful while tracking).
export function getDaysLeftInMonth(budget, now = new Date()) {
  const lastDay = new Date(budget.year, budget.month, 0).getDate(); // month is 1-12
  return Math.max(0, lastDay - now.getDate());
}

// Fraction (0-1) of the budget's month that has elapsed.
export function getMonthElapsedFraction(budget, now = new Date()) {
  const lastDay = new Date(budget.year, budget.month, 0).getDate();
  return Math.min(1, now.getDate() / lastDay);
}

// Total planned amount across a budget's category allocations.
export function getBudgetTotal(budget) {
  return (budget.categoryAllocations || []).reduce((sum, a) => sum + (a.amount || 0), 0);
}

// Total spent across a budget's tracked categories.
export function getBudgetSpent(budget) {
  return (budget.spentByCategory || []).reduce((sum, s) => sum + (s.spent || 0), 0);
}

// Color intent for a category progress bar based on spent / budget.
// >100% over (red), >=85% warning (amber), otherwise the category color.
export function getSpendBarColor(spent, budget, categoryColor) {
  if (budget <= 0) return categoryColor;
  const pct = spent / budget * 100;
  if (pct > 100) return '#C32D38';
  if (pct >= 85) return '#C48900';
  return categoryColor;
}
