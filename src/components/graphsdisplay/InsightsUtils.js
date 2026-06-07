import { differenceInCalendarDays, endOfWeek, endOfMonth, endOfYear } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
    computeAverage,
    computeStandardDeviation,
    processContinuousGraphData,
    processGroupedGraphData,
} from './GraphsDisplayUtils';
import { getInitialDayFromSettings } from '../../utils/DateUtils';

// Currency formatter matching the rest of the app (EUR, Spanish locale)
export function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
    }).format(amount);
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getNaturalPeriodEnd(timeEnum) {
    const today = new Date();
    const weekConfig = { locale: enUS, weekStartsOn: 1 };
    switch (timeEnum) {
        case 'LAST_WEEK':  return endOfWeek(today, weekConfig);
        case 'LAST_MONTH': return endOfMonth(today);
        case 'LAST_YEAR':  return endOfYear(today);
        default:           return null;
    }
}

function getPeriodLabel(timeEnum) {
    switch (timeEnum) {
        case 'LAST_WEEK':  return 'week';
        case 'LAST_MONTH': return 'month';
        case 'LAST_YEAR':  return 'year';
        default:           return 'period';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Velocity: rate (€/day, €/week) for the chart's current period
// ─────────────────────────────────────────────────────────────────────────────
export function computeVelocity(config, data) {
    if (!data?.data || data.data.length === 0) return null;
    const { dates, values } = processContinuousGraphData(config, data);
    if (!dates || dates.length === 0) return null;

    const total = values.reduce((s, v) => s + v, 0);
    const periodDays = dates.length;
    const perDay = periodDays > 0 ? total / periodDays : 0;
    const perWeek = perDay * 7;

    return { perDay, perWeek, total, periodDays };
}

// ─────────────────────────────────────────────────────────────────────────────
// Projection: end-of-period estimate for still-running periods (LAST_WEEK /
// LAST_MONTH / LAST_YEAR only — CUSTOM and NO_TIME have no natural boundary).
// Returns null when the period is already complete or can't be projected.
// ─────────────────────────────────────────────────────────────────────────────
export function computeProjection(config, data) {
    if (!data?.data || data.data.length === 0) return null;

    const timeEnum = config.customGraphSettings?.dataSettings?.time;
    const naturalEnd = getNaturalPeriodEnd(timeEnum);
    if (!naturalEnd) return null;

    const today = new Date();
    const remainingDays = differenceInCalendarDays(naturalEnd, today);
    if (remainingDays <= 0) return null; // period complete — nothing left to project

    const periodStart = getInitialDayFromSettings(config, data);
    if (!periodStart) return null;

    const totalPeriodDays = differenceInCalendarDays(naturalEnd, periodStart) + 1;
    const { dates, values } = processContinuousGraphData(config, data);
    const elapsedDays = dates.length;
    const elapsedTotal = values.reduce((s, v) => s + v, 0);

    if (elapsedDays === 0) return null;

    const projected = (elapsedTotal / elapsedDays) * totalPeriodDays;
    return {
        projected,
        elapsedTotal,
        elapsedDays,
        remainingDays,
        totalPeriodDays,
        periodLabel: getPeriodLabel(timeEnum),
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Category breakdown: totals, percentage shares, and velocity per category.
// Only meaningful for charts grouped by category / bank account / income source.
// ─────────────────────────────────────────────────────────────────────────────
export function computeCategoryBreakdown(config, data) {
    if (!data?.data || data.data.length === 0) return null;

    const vis = config.customGraphSettings?.visualizationSettings;
    const isGrouped =
        vis?.groupByCategory ||
        vis?.groupByIncomeBankAccounts ||
        vis?.groupByIncomeSources;
    if (!isGrouped) return null;

    const { labels, datasets } = processGroupedGraphData(config, data);
    if (!datasets || datasets.length === 0) return null;

    const periodDays = labels.length || 1;
    const grandTotal = datasets.reduce(
        (sum, ds) => sum + ds.data.reduce((s, v) => s + v, 0),
        0
    );
    if (grandTotal === 0) return null;

    const breakdown = datasets
        .map(ds => {
            const total = ds.data.reduce((s, v) => s + v, 0);
            return {
                category: ds.label,
                total,
                sharePercent: (total / grandTotal) * 100,
                perDay: total / periodDays,
            };
        })
        .sort((a, b) => b.total - a.total);

    return { breakdown, grandTotal };
}

// ─────────────────────────────────────────────────────────────────────────────
// Anomalies: days that are more than 2σ above the mean (non-zero days only,
// to avoid days-with-no-spend from dragging the baseline down).
// ─────────────────────────────────────────────────────────────────────────────
export function computeAnomalies(config, data) {
    const empty = { anomalies: [], mean: 0, threshold: 0 };
    if (!data?.data || data.data.length === 0) return empty;

    const { dates, values } = processContinuousGraphData(config, data);
    const nonZeroValues = values.filter(v => v > 0);
    if (nonZeroValues.length < 3) return empty; // need enough data for σ to be meaningful

    const mean = computeAverage(nonZeroValues);
    const sigma = computeStandardDeviation(nonZeroValues);
    const threshold = mean + 2 * sigma;

    const anomalies = dates
        .map((date, i) => ({ date, value: values[i] }))
        .filter(d => d.value > threshold)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return { anomalies, mean, threshold };
}

// ─────────────────────────────────────────────────────────────────────────────
// Volatility: coefficient of variation (σ / mean) on non-zero days.
// Tells the customer whether their spending is steady, moderate, or erratic.
// ─────────────────────────────────────────────────────────────────────────────
export function computeVolatility(config, data) {
    if (!data?.data || data.data.length === 0) return null;

    const { values } = processContinuousGraphData(config, data);
    const nonZero = values.filter(v => v > 0);
    if (nonZero.length < 3) return null;

    const mean = computeAverage(nonZero);
    if (mean === 0) return null;

    const sigma = computeStandardDeviation(nonZero);
    const cv = sigma / mean;

    let label, description;
    if (cv < 0.3) {
        label = 'Steady';
        description = 'Consistent and predictable spending pattern.';
    } else if (cv < 0.7) {
        label = 'Moderate';
        description = 'Some day-to-day variation, but within a normal range.';
    } else {
        label = 'Erratic';
        description = 'Highly irregular — spending tends to arrive in spikes.';
    }

    return { cv, label, description };
}

// ─────────────────────────────────────────────────────────────────────────────
// Frequency: count is supplied by the backend inside the grouped entry arrays
// (categoryAmounts, incomeBankAccountAmounts, incomeSourceAmounts).
// Only available for grouped charts — returns null otherwise.
// Backend contract: categoryAmounts: [{ category, amount, count }]
// ─────────────────────────────────────────────────────────────────────────────
export function computeFrequency(config, data) {
    if (!data?.data || data.data.length === 0) return null;

    // Detect which grouped array actually carries count fields — data-driven so
    // this works regardless of what the visualization settings flags say.
    const CANDIDATES = [
        { arrayKey: 'categoryAmounts',          labelKey: 'category',          breakdownLabel: 'Frequency by category' },
        { arrayKey: 'incomeBankAccountAmounts',  labelKey: 'incomeBankAccount', breakdownLabel: 'Frequency by bank account' },
        { arrayKey: 'incomeSourceAmounts',       labelKey: 'incomeSource',      breakdownLabel: 'Frequency by income source' },
    ];

    const match = CANDIDATES.find(({ arrayKey }) =>
        data.data.some(d => (d[arrayKey] || []).some(entry => entry.count != null))
    );
    if (!match) return null;

    const { arrayKey, labelKey, breakdownLabel } = match;

    const { dates } = processContinuousGraphData(config, data);
    const periodDays = dates.length || 1;

    // Aggregate per-group totals across all days
    const groupMap = new Map();
    let totalTransactions = 0;
    let totalAmount = 0;

    data.data.forEach(d => {
        (d[arrayKey] || []).forEach(entry => {
            const label = entry[labelKey];
            const count = entry.count ?? 0;
            const amount = entry.amount ?? 0;
            if (!groupMap.has(label)) groupMap.set(label, { count: 0, amount: 0 });
            const acc = groupMap.get(label);
            acc.count += count;
            acc.amount += amount;
            totalTransactions += count;
            totalAmount += amount;
        });
    });

    const perWeek = (totalTransactions / periodDays) * 7;
    const avgTransactionSize = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    const categoryFrequency = Array.from(groupMap.entries())
        .map(([category, { count, amount }]) => ({
            category,
            count,
            avgSize: count > 0 ? amount / count : 0,
            perWeek: (count / periodDays) * 7,
        }))
        .sort((a, b) => b.count - a.count);

    return { totalTransactions, perWeek, avgTransactionSize, totalAmount, categoryFrequency, breakdownLabel };
}
