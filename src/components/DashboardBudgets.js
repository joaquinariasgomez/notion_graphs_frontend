import '../css/DashboardBudgets.css';
import { useEffect, useState } from "react";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import { actionTypes, BOX_TYPES } from "../context/globalReducer";
import { getUpcomingBudgets, getClosedBudgets, deleteBudget } from "../api/RequestUtils";
import BudgetDetails from "./BudgetDetails";
import SyncLoader from "react-spinners/SyncLoader";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    MONTHS,
    formatEur,
    getBudgetStatus,
    getBudgetTotal,
    getBudgetSpent,
} from "../utils/BudgetUtils";
import { getRelativeTimeFromTimestamp } from "../utils/DateUtils";

export default function DashboardBudgets() {

    // Context
    const [{ userJWTCookie, upcomingBudgets = [], closedBudgets = [] }, dispatch] = useGlobalStateValue();

    const [budgetsLoading, setBudgetsLoading] = useState(true);
    const [moreClosedLoading, setMoreClosedLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextClosedCursor, setNextClosedCursor] = useState(null);
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
            const [upcomingResponse, closedResponse] = await Promise.all([
                getUpcomingBudgets(userJWTCookie),
                getClosedBudgets(userJWTCookie, null),
            ]);
            if (upcomingResponse) {
                dispatch({
                    type: actionTypes.SET_UPCOMING_BUDGETS,
                    value: upcomingResponse
                });
            }
            if (closedResponse) {
                dispatch({
                    type: actionTypes.SET_CLOSED_BUDGETS,
                    value: closedResponse.data
                });
                setHasNextPage(closedResponse.hasNextPage);
                setNextClosedCursor(closedResponse.nextCursor);
            }
        } catch (error) {

        } finally {
            setBudgetsLoading(false);
        }
    };

    const loadMoreClosedBudgets = async () => {
        try {
            setMoreClosedLoading(true);
            const closedResponse = await getClosedBudgets(userJWTCookie, nextClosedCursor);
            if (closedResponse) {
                // Deduplicate against already-loaded closed budgets in case new ones
                // were created between the first fetch and this "load more" call.
                const existingIds = new Set(closedBudgets.map((b) => b.id));
                const uniqueNew = closedResponse.data.filter((b) => !existingIds.has(b.id));
                dispatch({
                    type: actionTypes.APPEND_CLOSED_BUDGETS,
                    value: uniqueNew
                });
                setHasNextPage(closedResponse.hasNextPage);
                setNextClosedCursor(closedResponse.nextCursor);
            }
        } catch (error) {

        } finally {
            setMoreClosedLoading(false);
        }
    };

    const openCreateBudgetBox = () => {
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: { type: BOX_TYPES.CREATE_BUDGET }
        });
    };

    const openBudgetDetails = (budget) => {
        dispatch({
            type: actionTypes.SET_ACTIVE_BOX,
            value: { type: BOX_TYPES.VIEW_BUDGET, data: { budget } }
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
        <div className='budgets__menuwrapper' onClick={(e) => e.stopPropagation()}>
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
    const pickActiveBudget = (allUpcoming) => {
        const tracking = allUpcoming.find((b) => getBudgetStatus(b) === 'tracking');
        if (tracking) return tracking;

        const upcoming = allUpcoming
            .filter((b) => getBudgetStatus(b) === 'upcoming')
            .sort((a, b) => (a.year - b.year) || (a.month - b.month));
        return upcoming[0] || null;
    };

    const renderTrackingCard = (budget) => {
        const status = getBudgetStatus(budget);
        const isTracking = status === 'tracking';
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

                <BudgetDetails budget={budget} />
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
            <div
                className='budgets__card budgets__card--clickable'
                key={budget.id}
                onClick={() => openBudgetDetails(budget)}
            >
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

    const renderLoadMoreClosedButton = () => {
        if (hasNextPage && !moreClosedLoading) {
            return (
                <div className='budgets__loadmore'>
                    <button onClick={loadMoreClosedBudgets}>
                        <p>Load more</p>
                    </button>
                </div>
            );
        }
        if (moreClosedLoading) {
            return (
                <div className='budgets__loadmore'>
                    <SyncLoader size={8} color='#909090' />
                </div>
            );
        }
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

    if (upcomingBudgets.length === 0 && closedBudgets.length === 0) {
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

    const activeBudget = pickActiveBudget(upcomingBudgets);
    const otherUpcoming = upcomingBudgets.filter((b) => b !== activeBudget);

    return (
        <div className='dashboard__budgets'>
            {renderHeader()}
            {activeBudget && renderTrackingCard(activeBudget)}

            {otherUpcoming.length > 0 && (
                <>
                    <div className='budgets__sectionheader'>
                        <h3>Upcoming budgets</h3>
                        <span>{otherUpcoming.length} {otherUpcoming.length === 1 ? 'budget' : 'budgets'}</span>
                    </div>
                    <div className='budgets__grid budgets__grid--capped'>
                        {otherUpcoming.map((budget) => renderBudgetCard(budget))}
                    </div>
                </>
            )}

            {closedBudgets.length > 0 && (
                <>
                    <div className='budgets__sectionheader budgets__sectionheader--spaced'>
                        <h3>Closed budgets</h3>
                    </div>
                    <div className='budgets__grid'>
                        {closedBudgets.map((budget) => renderBudgetCard(budget))}
                    </div>
                    {renderLoadMoreClosedButton()}
                </>
            )}
        </div>
    );
}
