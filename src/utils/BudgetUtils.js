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

// Summarise the tracking health of a budget for the compact overview card chip.
// Returns { label, variant } where variant drives the chip CSS modifier class.
export function getBudgetCardStatus(budget) {
    const total = getBudgetTotal(budget);
    const spent = getBudgetSpent(budget);
    if (spent > total) {
        return { label: 'Over budget', variant: 'over' };
    }
    const spentMap = {};
    (budget.spentByCategory || []).forEach((s) => { spentMap[s.category] = s.spent; });
    const overCount = (budget.categoryAllocations || []).filter(
        (a) => (spentMap[a.category] || 0) > a.amount
    ).length;
    if (overCount > 0) {
        const plural = overCount === 1 ? '1 category over' : `${overCount} categories over`;
        return { label: plural, variant: 'warning' };
    }
    return { label: 'On track', variant: 'on-track' };
}

// Fixed-budget-line bar view for a category row.
// The budget line is always at ANCHOR% of the track; spending fills toward it and
// overspend spills into a red zone beyond. Returns inline-style objects for the
// rail, fill, overflow element, tick mark, and label text color.
const ANCHOR = 78;      // budget line position (% of track width)
const OVERZONE = 22;    // overflow zone width reserved past the line (%)
const OVER_FULL = 0.8;  // overspend of +80% fills the entire overflow zone

export function getCategoryBarView(spent, budget, color) {
  const unbudgeted = budget <= 0 && spent > 0;
  if (unbudgeted) {
    return {
      labelColor: '#C32D38',
      railStyle: { background: '#FCEBEA' },
      fillStyle: { inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,#C32D38 0 5px,#E0535C 5px 10px)' },
      overStyle: { display: 'none' },
      tickStyle: { left: '0', background: '#C32D38', opacity: 0.7 },
    };
  }
  const trackBg = `linear-gradient(90deg,#E7E7E7 0 ${ANCHOR}%,#FCEBEA ${ANCHOR}% 100%)`;
  if (budget > 0 && spent > budget) {
    const overW = Math.min(OVERZONE, (spent - budget) / budget / OVER_FULL * OVERZONE);
    return {
      labelColor: '#C32D38',
      railStyle: { background: trackBg },
      fillStyle: { width: ANCHOR + '%', background: color },
      overStyle: { left: ANCHOR + '%', width: overW + '%' },
      tickStyle: { left: ANCHOR + '%', background: '#0E0E0E', opacity: 0.55, transform: 'translateX(-50%)' },
    };
  }
  const w = budget > 0 ? Math.min(ANCHOR, spent / budget * ANCHOR) : 0;
  return {
    labelColor: '#666',
    railStyle: { background: trackBg },
    fillStyle: { width: w + '%', background: color },
    overStyle: { display: 'none' },
    tickStyle: { left: ANCHOR + '%', background: '#0E0E0E', opacity: 0.5, transform: 'translateX(-50%)' },
  };
}
