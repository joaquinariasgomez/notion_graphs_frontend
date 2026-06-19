// LocalStorage-backed stub for the budgets feature, used until the real
// backend endpoints exist. Toggled by Config.UseBudgetsMock
// (REACT_APP_USE_BUDGETS_MOCK=true). Everything here is deterministic so the
// demo looks the same across reloads.

const STORAGE_KEY = 'mockBudgets';

// ----- persistence -----
function readBudgets() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function writeBudgets(budgets) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  } catch (error) {
    // ignore quota / serialization errors in the stub
  }
}

// ----- deterministic pseudo-random helpers -----
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// A stable fraction in [min, max) derived from a seed string.
function seededFraction(seed, min, max) {
  const unit = (hashString(seed) % 1000) / 1000; // 0..0.999
  return min + unit * (max - min);
}

// month is 1-12. 'tracking' = current month, 'upcoming' = future, else 'closed'.
function statusOf(month, year, now = new Date()) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year === currentYear && month === currentMonth) return 'tracking';
  if (year > currentYear || (year === currentYear && month > currentMonth)) return 'upcoming';
  return 'closed';
}

// Build a plausible spent-per-category list for a budget. Upcoming budgets
// haven't started, so they have no spend yet.
function buildSpentByCategory(budgetId, month, year, categoryAllocations, includeExisting) {
  if (statusOf(month, year) === 'upcoming') return [];
  return (categoryAllocations || []).map((allocation) => {
    const factor = includeExisting ? seededFraction(budgetId + ':' + allocation.category, 0.4, 1.15) : 0;
    return {
      category: allocation.category,
      spent: Math.round((allocation.amount || 0) * factor),
    };
  });
}

// A plausible "last expense" timestamp (epoch seconds). Upcoming budgets have
// no expenses yet, so they get 0 (the frontend hides the label for 0).
function buildSpentUpdatedAt(budgetId, month, year, includeExisting) {
  if (statusOf(month, year) === 'upcoming' || !includeExisting) return 0;
  const nowSeconds = Math.floor(Date.now() / 1000);
  // Deterministic: somewhere between 1 minute and 2 hours ago.
  const offsetSeconds = Math.floor(seededFraction(budgetId + ':updated', 60, 7200));
  return nowSeconds - offsetSeconds;
}

// ----- public mock API -----

const CLOSED_PAGE_SIZE = 6;

// Derive averages for the user's real categories so the create modal feels
// real even before the analytics endpoint exists.
export function mockAveragesForCategories(categories) {
  return (categories || []).map((category) => {
    const base = 40 + (hashString(category) % 1160); // 40..1199
    return { category, average: Math.round(base / 10) * 10 };
  });
}

// Non-paginated: current-month (tracking) + all upcoming budgets.
export function mockGetUpcomingBudgets() {
  const all = readBudgets();
  const data = all.filter((b) => statusOf(b.month, b.year) !== 'closed');
  return { data };
}

// Cursor-paginated: past budgets sorted newest-first.
// cursor is an integer offset (null → 0).
export function mockGetClosedBudgets(cursor) {
  const all = readBudgets();
  const closed = all
    .filter((b) => statusOf(b.month, b.year) === 'closed')
    .sort((a, b) => (b.year - a.year) || (b.month - a.month));

  const offset = cursor ? parseInt(cursor, 10) : 0;
  const page = closed.slice(offset, offset + CLOSED_PAGE_SIZE);
  const nextOffset = offset + CLOSED_PAGE_SIZE;
  const hasNextPage = nextOffset < closed.length;

  return {
    data: page,
    hasNextPage,
    nextCursor: hasNextPage ? String(nextOffset) : null,
  };
}

export function mockCreateBudget(input) {
  const id = 'b' + Date.now();
  const includeExisting = input.includeExistingExpenses !== false;
  const budget = {
    id,
    name: input.name,
    month: input.month,
    year: input.year,
    cap: input.cap ?? null,
    categoryAllocations: input.categoryAllocations || [],
    spentByCategory: buildSpentByCategory(id, input.month, input.year, input.categoryAllocations, includeExisting),
    spentUpdatedAt: buildSpentUpdatedAt(id, input.month, input.year, includeExisting),
  };
  const budgets = readBudgets();
  writeBudgets([budget, ...budgets]);
  return budget;
}

export function mockUpdateBudget(budgetId, input) {
  const includeExisting = input.includeExistingExpenses !== false;
  const budgets = readBudgets();
  const updated = budgets.map((budget) => {
    if (budget.id !== budgetId) return budget;
    return {
      ...budget,
      name: input.name,
      month: input.month,
      year: input.year,
      cap: input.cap ?? null,
      categoryAllocations: input.categoryAllocations || [],
      spentByCategory: buildSpentByCategory(budgetId, input.month, input.year, input.categoryAllocations, includeExisting),
      spentUpdatedAt: buildSpentUpdatedAt(budgetId, input.month, input.year, includeExisting),
    };
  });
  writeBudgets(updated);
  return updated.find((budget) => budget.id === budgetId);
}

export function mockDeleteBudget(budgetId) {
  writeBudgets(readBudgets().filter((budget) => budget.id !== budgetId));
}
