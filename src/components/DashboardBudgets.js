import '../css/DashboardBudgets.css';
import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { actionTypes, BOX_TYPES } from "../context/globalReducer";
import { getBudgets, deleteBudget } from "../api/RequestUtils";
import SyncLoader from "react-spinners/SyncLoader";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    MONTHS,
    formatEur,
    buildCategoryColorMap,
    getBudgetStatus,
    getDaysLeftInMonth,
    getMonthElapsedFraction,
    getBudgetTotal,
    getBudgetSpent,
    getSpendBarColor,
} from "../utils/BudgetUtils";
import { getRelativeTimeFromTimestamp } from "../utils/DateUtils";

export default function DashboardBudgets() {

    // Context
    const [{ userJWTCookie, budgets }, dispatch] = useGlobalStateValue();

    const [budgetsLoading, setBudgetsLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        fetchBudgets();
    }, []);

    // Close the open options menu when clicking anywhere outside of it.
    useEffect(() => {
        if (openMenuId == null) return;
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.budgets__menuwrapper')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [openMenuId]);

    const fetchBudgets = async () => {
        try {
            setBudgetsLoading(true);
            const apiResponse = await getBudgets(userJWTCookie);
            if (apiResponse) {
                dispatch({
                    type: actionTypes.SET_BUDGETS,
                    value: apiResponse.data
                });
            }
        } catch (error) {

        } finally {
            setBudgetsLoading(false);
        }
    };

    const openCreateBudgetBox = () => {
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: { type: BOX_TYPES.CREATE_BUDGET }
        });
    };

    const handleEditBudget = (budget) => {
        setOpenMenuId(null);
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: { type: BOX_TYPES.UPDATE_BUDGET, data: { budget } }
        });
    };

    const handleDeleteBudget = (budget) => {
        setOpenMenuId(null);
        // Optimistic removal, mirroring how graphs are deleted.
        dispatch({
            type: actionTypes.DELETE_BUDGET,
            value: budget.id
        });
        try {
            deleteBudget(userJWTCookie, budget.id);
        } catch (error) {

        }
    };

    const renderCardMenu = (budget) => (
        <div className='budgets__menuwrapper'>
            <button
                className='budgets__menubutton'
                title='Options'
                onClick={() => setOpenMenuId(openMenuId === budget.id ? null : budget.id)}
            >
                <MoreHorizIcon style={{ color: '#6d6d6d' }} fontSize='small' />
            </button>
            {openMenuId === budget.id && (
                <div className='budgets__menu'>
                    <button className='budgets__menuitem' onClick={() => handleEditBudget(budget)}>
                        <EditOutlinedIcon style={{ fontSize: 18 }} />
                        Edit budget
                    </button>
                    <button className='budgets__menuitem delete' onClick={() => handleDeleteBudget(budget)}>
                        <DeleteOutlineRoundedIcon style={{ fontSize: 18 }} />
                        Delete budget
                    </button>
                </div>
            )}
        </div>
    );

    // The budget we actively track: the one for the current month, otherwise
    // the nearest upcoming budget.
    const pickActiveBudget = (allBudgets) => {
        const tracking = allBudgets.find((b) => getBudgetStatus(b) === 'tracking');
        if (tracking) return tracking;

        const upcoming = allBudgets
            .filter((b) => getBudgetStatus(b) === 'upcoming')
            .sort((a, b) => (a.year - b.year) || (a.month - b.month));
        return upcoming[0] || null;
    };

    const renderCategoryColorMap = (budget) => {
        const categories = (budget.categoryAllocations || []).map((a) => a.category);
        return buildCategoryColorMap(categories);
    };

    const renderTrackingCard = (budget) => {
        const colorMap = renderCategoryColorMap(budget);
        const total = getBudgetTotal(budget);
        const spent = getBudgetSpent(budget);
        const remaining = total - spent;
        const status = getBudgetStatus(budget);
        const isTracking = status === 'tracking';
        const daysLeft = getDaysLeftInMonth(budget);
        const usedPct = total > 0 ? Math.round(spent / total * 100) : 0;
        const elapsedPct = Math.round(getMonthElapsedFraction(budget) * 100);
        const lastExpenseLabel = getRelativeTimeFromTimestamp(budget.spentUpdatedAt);

        const spentByCategoryMap = {};
        (budget.spentByCategory || []).forEach((s) => { spentByCategoryMap[s.category] = s.spent; });

        const overCount = (budget.categoryAllocations || []).filter((a) => {
            const catSpent = spentByCategoryMap[a.category] || 0;
            return catSpent > a.amount;
        }).length;

        return (
            <div className='budgets__trackingcard'>
                <div className='budgets__trackingcard__header'>
                    <div>
                        <div className='budgets__trackingcard__eyebrow'>
                            <span className='budgets__dot' />
                            {isTracking ? 'Tracking now · closest budget' : 'Closest budget'}
                        </div>
                        <div className='budgets__trackingcard__title'>
                            <h2>{budget.name}</h2>
                            <span>{MONTHS[budget.month - 1]} {budget.year}</span>
                        </div>
                        {lastExpenseLabel && (
                            <div className='budgets__lastexpense'>Last expense {lastExpenseLabel}</div>
                        )}
                    </div>
                    <div className='budgets__trackingcard__headerright'>
                        {overCount > 0 && (
                            <span className='budgets__overbadge'>
                                <span className='budgets__overbadge__dot' />
                                {overCount} {overCount === 1 ? 'category' : 'categories'} over budget
                            </span>
                        )}
                        {renderCardMenu(budget)}
                    </div>
                </div>

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
                        {(budget.categoryAllocations || []).map((allocation) => {
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
            </div>
        );
    };

    const renderBudgetCard = (budget) => {
        const status = getBudgetStatus(budget);
        const total = getBudgetTotal(budget);
        const period = `${MONTHS[budget.month - 1]} ${budget.year}`;

        let badgeLabel, badgeClass, meta, metaClass;
        if (status === 'closed') {
            const spent = getBudgetSpent(budget);
            const under = total - spent;
            badgeLabel = 'Closed';
            badgeClass = 'closed';
            meta = under >= 0 ? `Under by ${formatEur(under)}` : `Over by ${formatEur(-under)}`;
            metaClass = under >= 0 ? 'positive' : 'negative';
        } else {
            badgeLabel = 'Upcoming';
            badgeClass = 'upcoming';
            const count = (budget.categoryAllocations || []).length;
            meta = `${count} ${count === 1 ? 'category' : 'categories'} budgeted`;
            metaClass = 'muted';
        }

        return (
            <div className='budgets__card' key={budget.id}>
                <div className='budgets__card__header'>
                    <span className={`budgets__badge ${badgeClass}`}>{badgeLabel}</span>
                    {renderCardMenu(budget)}
                </div>
                <div className='budgets__card__name'>{budget.name}</div>
                <div className='budgets__card__period'>{period}</div>
                <div className='budgets__card__total'>{formatEur(total)}</div>
                <div className={`budgets__card__meta ${metaClass}`}>{meta}</div>
            </div>
        );
    };

    const renderHeader = () => (
        <div className='budgets__header'>
            <div>
                <h1>Budgets</h1>
                <p>Plan a month of spending and track it against what you actually spend.</p>
            </div>
            <button className='budgets__createbutton' onClick={openCreateBudgetBox}>
                <AddRoundedIcon fontSize='small' />
                Create budget
            </button>
        </div>
    );

    if (budgetsLoading) {
        return (
            <div className='dashboard__budgets'>
                {renderHeader()}
                <div className='budgets__loading'>
                    <SyncLoader size={10} color='#909090' />
                </div>
            </div>
        );
    }

    if (budgets.length === 0) {
        return (
            <div className='dashboard__budgets'>
                {renderHeader()}
                <div className='budgets__empty'>
                    <p>You haven't created any budgets yet.</p>
                    <p className='budgets__empty__hint'>Create your first budget to start tracking your monthly spending against a plan.</p>
                </div>
            </div>
        );
    }

    const activeBudget = pickActiveBudget(budgets);
    const otherBudgets = budgets.filter((b) => b !== activeBudget);

    return (
        <div className='dashboard__budgets'>
            {renderHeader()}
            {activeBudget && renderTrackingCard(activeBudget)}

            {otherBudgets.length > 0 && (
                <>
                    <div className='budgets__sectionheader'>
                        <h3>Other budgets</h3>
                        <span>{otherBudgets.length} {otherBudgets.length === 1 ? 'budget' : 'budgets'}</span>
                    </div>
                    <div className='budgets__grid'>
                        {otherBudgets.map((budget) => renderBudgetCard(budget))}
                    </div>
                </>
            )}
        </div>
    );
}
