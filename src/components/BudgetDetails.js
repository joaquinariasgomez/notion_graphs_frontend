import '../css/DashboardBudgets.css';
import {
    formatEur,
    buildCategoryColorMap,
    getBudgetStatus,
    getDaysLeftInMonth,
    getMonthElapsedFraction,
    getBudgetTotal,
    getBudgetSpent,
    getSpendBarColor,
} from '../utils/BudgetUtils';

// Read-only detail body for a budget — shared between the inline tracking card
// and the ViewBudgetBox modal. Renders the stats strip, the overall progress bar,
// and the per-category breakdown. All existing budgets__* CSS classes are reused.
export default function BudgetDetails({ budget }) {
    const categories = (budget.categoryAllocations || []).map((a) => a.category);
    const colorMap = buildCategoryColorMap(categories);

    const total = getBudgetTotal(budget);
    const spent = getBudgetSpent(budget);
    const remaining = total - spent;
    const status = getBudgetStatus(budget);
    const isTracking = status === 'tracking';
    const daysLeft = getDaysLeftInMonth(budget);
    const usedPct = total > 0 ? Math.round(spent / total * 100) : 0;
    const elapsedPct = Math.round(getMonthElapsedFraction(budget) * 100);

    const spentByCategoryMap = {};
    (budget.spentByCategory || []).forEach((s) => { spentByCategoryMap[s.category] = s.spent; });

    return (
        <>
            <div className='budgets__stats'>
                <div className='budgets__stat'>
                    <div className='budgets__stat__label'>Spent so far</div>
                    <div className='budgets__stat__value'>
                        {formatEur(spent)} <span>of {formatEur(total)}</span>
                    </div>
                </div>
                <div className='budgets__stat budgets__stat--bordered'>
                    <div className='budgets__stat__label'>Remaining</div>
                    <div className={`budgets__stat__value ${remaining >= 0 ? 'positive' : 'negative'}`}>
                        {formatEur(remaining)}
                    </div>
                </div>
                {isTracking && (
                    <div className='budgets__stat budgets__stat--bordered'>
                        <div className='budgets__stat__label'>Days left</div>
                        <div className='budgets__stat__value'>{daysLeft}</div>
                    </div>
                )}
            </div>

            <div className='budgets__overallbar__wrapper'>
                <div className='budgets__overallbar'>
                    <div
                        className='budgets__overallbar__fill'
                        style={{ width: Math.min(100, usedPct) + '%' }}
                    />
                </div>
                <div className='budgets__overallbar__legend'>
                    <span>{usedPct}% of budget used</span>
                    {isTracking && <span>{elapsedPct}% of month elapsed</span>}
                </div>
            </div>

            <div className='budgets__bycategory'>
                <div className='budgets__bycategory__title'>By category</div>
                <div className='budgets__bycategory__grid'>
                    {[...(budget.categoryAllocations || [])]
                        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
                        .map((allocation) => {
                        const catSpent = spentByCategoryMap[allocation.category] || 0;
                        const pct = allocation.amount > 0 ? catSpent / allocation.amount * 100 : 0;
                        const categoryColor = colorMap[allocation.category];
                        const barColor = getSpendBarColor(catSpent, allocation.amount, categoryColor);
                        return (
                            <div className='budgets__catrow' key={allocation.category}>
                                <div className='budgets__catrow__top'>
                                    <span className='budgets__catrow__name'>
                                        <span className='budgets__catrow__swatch' style={{ backgroundColor: categoryColor }} />
                                        {allocation.category}
                                    </span>
                                    <span className='budgets__catrow__amount' style={{ color: barColor === categoryColor ? '#666' : barColor }}>
                                        {formatEur(catSpent)} / {formatEur(allocation.amount)}
                                    </span>
                                </div>
                                <div className='budgets__catrow__bar'>
                                    <div
                                        className='budgets__catrow__barfill'
                                        style={{ width: Math.min(100, pct) + '%', backgroundColor: barColor }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
