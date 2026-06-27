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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {
    MONTHS,
    formatEur,
    getBudgetStatus,
    getBudgetTotal,
    getBudgetSpent,
    getBudgetCardStatus,
    getDaysLeftInMonth,
} from "../utils/BudgetUtils";
import { getRelativeTimeFromTimestamp } from "../utils/DateUtils";

export default function DashboardBudgets() {

    // Context
    const [{ userJWTCookie, upcomingBudgets = [], closedBudgets = [] }, dispatch] = useGlobalStateValue();

    const [budgetsLoading, setBudgetsLoading] = useState(true);
    const [moreClosedLoading, setMoreClosedLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextClosedCursor, setNextClosedCursor] = useState(null);
    const [trackingSelectedId, setTrackingSelectedId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [closedExpanded, setClosedExpanded] = useState(false);
    const [closedTotalCount, setClosedTotalCount] = useState(0);

    useEffect(() => {
        fetchBudgets();
    }, []);

    // Keep closedTotalCount in sync when a budget is added locally (e.g. after
    // creation via APPEND_BUDGET). The server-fetched total is set once on load;
    // this catches any locally-appended items that grow closedBudgets beyond it.
    useEffect(() => {
        if (closedBudgets.length > closedTotalCount) {
            setClosedTotalCount(closedBudgets.length);
        }
    }, [closedBudgets.length, closedTotalCount]);

    // Close the open options menu when clicking anywhere outside of it, or on scroll.
    useEffect(() => {
        if (openMenuId == null) return;
        const closeMenu = (event) => {
            if (event.type === 'mousedown' && event.target.closest('.budgets__menuwrapper')) return;
            setOpenMenuId(null);
            setMenuPosition(null);
        };
        document.addEventListener('mousedown', closeMenu);
        document.addEventListener('scroll', closeMenu, true);
        return () => {
            document.removeEventListener('mousedown', closeMenu);
            document.removeEventListener('scroll', closeMenu, true);
        };
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
                setClosedTotalCount(closedResponse.totalCount ?? closedResponse.data.length);
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
        if (getBudgetStatus(budget) === 'closed') {
            setClosedTotalCount((c) => Math.max(0, c - 1));
        }
        try {
            deleteBudget(userJWTCookie, budget.id);
        } catch (error) {

        }
    };

    const handleMenuButtonClick = (budget, e) => {
        e.stopPropagation();
        if (openMenuId === budget.id) {
            setOpenMenuId(null);
            setMenuPosition(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const menuMinWidth = 168;
            const safeMargin = 8;
            const rightValue = window.innerWidth - rect.right;
            const safeRight = Math.max(0, Math.min(rightValue, window.innerWidth - menuMinWidth - safeMargin));
            setMenuPosition({ top: rect.bottom + 6, right: safeRight });
            setOpenMenuId(budget.id);
        }
    };

    const renderCardMenu = (budget) => (
        <div className='budgets__menuwrapper' onClick={(e) => e.stopPropagation()}>
            <button
                className='budgets__menubutton'
                title='Options'
                onClick={(e) => handleMenuButtonClick(budget, e)}
            >
                <MoreHorizIcon style={{ color: '#6d6d6d' }} fontSize='small' />
            </button>
            {openMenuId === budget.id && menuPosition && (
                <div
                    className='budgets__menu'
                    style={{ position: 'fixed', top: menuPosition.top, right: menuPosition.right, left: 'auto', bottom: 'auto' }}
                >
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

    // Dot color tokens keyed by chip variant — used in the compact overview cards.
    const DOT_COLORS = {
        'on-track': { bg: '#15865B', ring: '#EDF8F2' },
        'warning':  { bg: '#C48900', ring: '#FEF5D3' },
        'over':     { bg: '#C32D38', ring: '#FEF3F2' },
        'upcoming': { bg: '#0072F0', ring: '#F4F5FD' },
    };

    // One compact card per budget in the overview row.
    const renderOverviewCard = (budget, isSelected, isFallback) => {
        const total = getBudgetTotal(budget);
        const spent = getBudgetSpent(budget);
        const pct = total > 0 ? Math.round(spent / total * 100) : 0;
        const daysLeft = getDaysLeftInMonth(budget);
        const barFillColor = spent > total ? '#C32D38' : 'var(--matteblack-color)';

        const { label: chipLabel, variant: chipVariant } = isFallback
            ? { label: 'Upcoming', variant: 'upcoming' }
            : getBudgetCardStatus(budget);
        const dot = DOT_COLORS[chipVariant] || DOT_COLORS['on-track'];

        return (
            <div
                key={budget.id}
                className={`budgets__overviewcard${isSelected ? ' budgets__overviewcard--selected' : ''}`}
                onClick={() => setTrackingSelectedId(budget.id)}
            >
                <div className='budgets__overviewcard__head'>
                    <div className='budgets__overviewcard__namegroup'>
                        <span
                            className='budgets__overviewcard__dot'
                            style={{ backgroundColor: dot.bg, boxShadow: `0 0 0 3px ${dot.ring}` }}
                        />
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <div className='budgets__overviewcard__name'>{budget.name}</div>
                            <div className='budgets__overviewcard__period'>
                                {MONTHS[budget.month - 1]} {budget.year}
                            </div>
                        </div>
                    </div>
                    <span className={`budgets__statuschip ${chipVariant}`}>{chipLabel}</span>
                </div>
                <div className='budgets__overviewcard__bar'>
                    <div
                        className='budgets__overviewcard__barfill'
                        style={{ width: Math.min(100, pct) + '%', backgroundColor: barFillColor }}
                    />
                </div>
                <div className='budgets__overviewcard__foot'>
                    <span>{pct}% used</span>
                    <span>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>
                </div>
            </div>
        );
    };

    // Section header + the row of compact overview cards.
    const renderTrackingSection = (budgets, selectedId, isFallback) => {
        const n = budgets.length;
        const countLabel = isFallback
            ? 'Closest budget'
            : `${n} ${n === 1 ? 'budget active' : 'budgets active'}`;

        return (
            <div className='budgets__trackingsection'>
                <div className='budgets__trackingsection__head'>
                    <h3>Tracking now</h3>
                    <span className='budgets__trackingsection__count'>{countLabel}</span>
                </div>
                <div className='budgets__overviewrow'>
                    {budgets.map((b) => renderOverviewCard(b, b.id === selectedId, isFallback))}
                </div>
            </div>
        );
    };

    // Expanded detail panel for the selected budget.
    // showEyebrow is true when there is no overview row above to provide context.
    const renderDetailPanel = (budget, isFallback, showEyebrow) => {
        const lastExpenseLabel = getRelativeTimeFromTimestamp(budget.spentUpdatedAt);
        const { label: chipLabel, variant: chipVariant } = isFallback
            ? { label: 'Upcoming', variant: 'upcoming' }
            : getBudgetCardStatus(budget);

        return (
            <div className='budgets__trackingcard'>
                <div className='budgets__trackingcard__header'>
                    <div>
                        {showEyebrow && (
                            <div className='budgets__trackingcard__eyebrow'>
                                <span className='budgets__dot' />
                                {isFallback ? 'Closest budget' : 'Tracking now'}
                            </div>
                        )}
                        <div className='budgets__trackingcard__title'>
                            <h2>{budget.name}</h2>
                            <span>{MONTHS[budget.month - 1]} {budget.year}</span>
                        </div>
                        {lastExpenseLabel && (
                            <div className='budgets__lastexpense'>Last expense {lastExpenseLabel}</div>
                        )}
                    </div>
                    <div className='budgets__trackingcard__headerright'>
                        <span className={`budgets__statuschip ${chipVariant}`}>{chipLabel}</span>
                        {renderCardMenu(budget)}
                    </div>
                </div>
                <BudgetDetails budget={budget} />
            </div>
        );
    };

    // ── Upcoming column ──────────────────────────────────────────────────────

    const renderUpcomingRow = (budget) => {
        const total = getBudgetTotal(budget);
        const period = `${MONTHS[budget.month - 1]} ${budget.year}`;
        const count = (budget.categoryAllocations || []).length;
        const meta = `${count} ${count === 1 ? 'category' : 'categories'} budgeted`;

        return (
            <div
                key={budget.id}
                className='budgets__upcomingrow'
                onClick={() => openBudgetDetails(budget)}
            >
                <div className='budgets__upcomingrow__left'>
                    <div className='budgets__upcomingrow__name'>{budget.name}</div>
                    <div className='budgets__upcomingrow__sub'>
                        <span className='budgets__upcomingrow__period'>{period}</span>
                        <span className='budgets__upcomingrow__meta'>{meta}</span>
                    </div>
                </div>
                <div className='budgets__upcomingrow__right'>
                    <div className='budgets__upcomingrow__total'>{formatEur(total)}</div>
                    <div className='budgets__upcomingrow__planned'>planned</div>
                </div>
                {renderCardMenu(budget)}
            </div>
        );
    };

    const renderUpcomingColumn = (items) => {
        const n = items.length;
        return (
            <div className='budgets__upcomingcard'>
                <div className='budgets__upcomingcard__header'>
                    <span className='budgets__upcomingcard__title'>
                        <span className='budgets__dot budgets__dot--blue' />
                        Upcoming
                    </span>
                    <span className='budgets__upcomingcard__count'>
                        {n} {n === 1 ? 'budget' : 'budgets'}
                    </span>
                </div>
                <div className='budgets__upcomingcard__body'>
                    {items.map(renderUpcomingRow)}
                </div>
            </div>
        );
    };

    // ── Closed summary card ──────────────────────────────────────────────────

    const renderClosedSummary = () => {
        const recent = closedBudgets[0] || null;
        let recentBlock = null;
        if (recent) {
            const total = getBudgetTotal(recent);
            const spent = getBudgetSpent(recent);
            const under = total - spent;
            const recentPeriod = `${MONTHS[recent.month - 1]} ${recent.year}`;
            const recentMeta = under >= 0
                ? `Under ${formatEur(under)}`
                : `Over ${formatEur(-under)}`;
            const recentMetaClass = under >= 0 ? 'positive' : 'negative';

            recentBlock = (
                <div className='budgets__closedsummary__recent'>
                    <div className='budgets__closedsummary__recentlabel'>Most recent</div>
                    <div className='budgets__closedsummary__recentrow'>
                        <div className='budgets__closedsummary__recentinfo'>
                            <div className='budgets__closedsummary__recentname'>{recent.name}</div>
                            <div className='budgets__closedsummary__recentperiod'>{recentPeriod}</div>
                        </div>
                        <span className={`budgets__closedsummary__recentmeta ${recentMetaClass}`}>
                            {recentMeta}
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`budgets__closedsummary${closedExpanded ? ' budgets__closedsummary--expanded' : ''}`}
                onClick={() => setClosedExpanded((v) => !v)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setClosedExpanded((v) => !v)}
            >
                <div className='budgets__closedsummary__top'>
                    <div>
                        <div className='budgets__closedsummary__eyebrow'>Closed</div>
                        <div className='budgets__closedsummary__countrow'>
                            <span className='budgets__closedsummary__count'>{closedTotalCount}</span>
                            <span className='budgets__closedsummary__countlabel'>budgets closed</span>
                        </div>
                    </div>
                    <span className={`budgets__closedsummary__chevron${closedExpanded ? ' budgets__closedsummary__chevron--open' : ''}`}>
                        <KeyboardArrowDownRoundedIcon fontSize='small' />
                    </span>
                </div>

                {recentBlock}

                <div className='budgets__closedsummary__togglelabel'>
                    {closedExpanded ? 'Hide closed budgets' : 'View all closed budgets'}
                </div>
            </div>
        );
    };

    // ── Closed expanded panel ────────────────────────────────────────────────

    const renderClosedRow = (budget) => {
        const total = getBudgetTotal(budget);
        const spent = getBudgetSpent(budget);
        const under = total - spent;
        const period = `${MONTHS[budget.month - 1]} ${budget.year}`;
        const resultLabel = under >= 0
            ? `Under by ${formatEur(under)}`
            : `Over by ${formatEur(-under)}`;
        const resultClass = under >= 0 ? 'positive' : 'negative';

        return (
            <div
                key={budget.id}
                className='budgets__closedrow'
                onClick={() => openBudgetDetails(budget)}
            >
                <span className='budgets__closedrow__name'>{budget.name}</span>
                <span className='budgets__closedrow__period'>{period}</span>
                <span className='budgets__closedrow__total'>{formatEur(total)}</span>
                <span className='budgets__closedrow__result'>
                    <span className={`budgets__closedrow__pill ${resultClass}`}>{resultLabel}</span>
                </span>
                {renderCardMenu(budget)}
            </div>
        );
    };

    const renderClosedPanel = () => {
        const showing = closedBudgets.length;

        let footer;
        if (hasNextPage && !moreClosedLoading) {
            footer = (
                <button className='budgets__closedpanel__loadmore' onClick={(e) => { e.stopPropagation(); loadMoreClosedBudgets(); }}>
                    Load more
                </button>
            );
        } else if (moreClosedLoading) {
            footer = <SyncLoader size={8} color='#909090' />;
        } else {
            footer = (
                <span className='budgets__closedpanel__alldone'>All closed budgets loaded</span>
            );
        }

        return (
            <div className='budgets__closedpanel'>
                <div className='budgets__closedpanel__head'>
                    <div className='budgets__closedpanel__headrow'>
                        <span>Budget</span>
                        <span>Period</span>
                        <span className='budgets__closedpanel__headcell--right'>Planned</span>
                        <span className='budgets__closedpanel__headcell--right'>Result</span>
                        <span />
                    </div>
                </div>
                <div className='budgets__closedpanel__rows'>
                    {closedBudgets.map(renderClosedRow)}
                </div>
                <div className='budgets__closedpanel__footer'>
                    <span className='budgets__closedpanel__showing'>
                        Showing {showing} of {closedTotalCount}
                    </span>
                    {footer}
                </div>
            </div>
        );
    };

    // ── Header ───────────────────────────────────────────────────────────────

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

    // Budgets active in the current month go into the overview row.
    // When none are tracking, fall back to the nearest upcoming one so the
    // section still renders (preserving today's behaviour).
    const trackingBudgets = upcomingBudgets.filter((b) => getBudgetStatus(b) === 'tracking');
    const isFallback = trackingBudgets.length === 0;
    const fallbackBudget = isFallback ? pickActiveBudget(upcomingBudgets) : null;
    const overviewBudgets = isFallback
        ? (fallbackBudget ? [fallbackBudget] : [])
        : trackingBudgets;

    // The selected card; self-heals to the first card when the stored id is stale.
    const selected = overviewBudgets.find((b) => b.id === trackingSelectedId) || overviewBudgets[0] || null;

    // Only show the overview row when there are 2+ tracking budgets to switch between.
    const showOverviewRow = trackingBudgets.length >= 2;

    // Anything not promoted into the overview row goes to the Upcoming column.
    const otherUpcoming = upcomingBudgets.filter((b) => !overviewBudgets.includes(b));
    const hasOtherUpcoming = otherUpcoming.length > 0;
    const hasClosed = closedBudgets.length > 0 || closedTotalCount > 0;
    const showOtherSection = hasOtherUpcoming || hasClosed;

    return (
        <div className='dashboard__budgets'>
            {renderHeader()}
            {showOverviewRow && renderTrackingSection(overviewBudgets, selected?.id, false)}
            {selected && renderDetailPanel(selected, isFallback, !showOverviewRow)}

            {showOtherSection && (
                <div className={`budgets__otherlayout${(!hasOtherUpcoming || !hasClosed) ? ' budgets__otherlayout--single' : ''}`}>
                    {hasOtherUpcoming && renderUpcomingColumn(otherUpcoming)}
                    {hasClosed && renderClosedSummary()}
                </div>
            )}

            {closedExpanded && renderClosedPanel()}
        </div>
    );
}
