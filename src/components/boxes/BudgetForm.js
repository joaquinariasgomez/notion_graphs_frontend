import '../../css/CreateBudgetBox.css';
import { useState, useEffect } from 'react';
import { actionTypes } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClipLoader from 'react-spinners/ClipLoader';
import SyncLoader from "react-spinners/SyncLoader";
import { getCategoryAverages } from '../../api/RequestUtils';
import {
    MONTHS,
    formatEur,
    buildCategoryColorMap,
    deriveSliderBounds,
    computeAverageDelta,
} from '../../utils/BudgetUtils';

// Shared form used by both CreateBudgetBox and UpdateBudgetBox.
// Props:
//   mode: 'create' | 'update'              — drives title, subtitle, submit label
//   initialBudget: Budget | undefined      — prefill source when updating
//   onSubmit(budgetInput): Promise<void>   — performs the create/update API call + dispatch
export default function BudgetForm({ mode, initialBudget, onSubmit }) {

    const isUpdate = mode === 'update';

    // Context
    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    // Loading
    const [dataLoading, setDataLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Source data
    const [categories, setCategories] = useState([]);
    const [averages, setAverages] = useState({}); // { [category]: number }

    // Form state
    const now = new Date();
    const [name, setName] = useState(initialBudget?.name || '');
    const [month, setMonth] = useState(initialBudget?.month || (now.getMonth() + 1)); // 1-12
    const [year, setYear] = useState(initialBudget?.year || now.getFullYear());
    const [cap, setCap] = useState(initialBudget?.cap != null ? String(initialBudget.cap) : '');
    const [values, setValues] = useState({});    // { [category]: number }
    const [included, setIncluded] = useState({}); // { [category]: bool }
    const [includeExistingExpenses, setIncludeExistingExpenses] = useState(true);

    // The "include existing expenses" option only makes sense for periods that
    // already have expenses — the current month or a past one, never the future.
    const selectedPeriod = year * 100 + month;
    const currentPeriod = now.getFullYear() * 100 + (now.getMonth() + 1);
    const isCurrentOrPast = selectedPeriod <= currentPeriod;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setDataLoading(true);
            const averagesResponse = await getCategoryAverages(userJWTCookie);

            // The averages endpoint returns one entry per category, so it also
            // serves as the source of the category list.
            const categoryList = [];
            const averagesMap = {};
            (averagesResponse || []).forEach((entry) => {
                categoryList.push(entry.category);
                averagesMap[entry.category] = entry.average;
            });

            // When editing, prefill from the budget's allocations and make sure
            // we never drop a category the budget references but the categories
            // endpoint no longer returns.
            const allocations = initialBudget?.categoryAllocations || [];
            const allocationMap = {};
            allocations.forEach((a) => { allocationMap[a.category] = a.amount; });

            const mergedCategories = [...categoryList];
            allocations.forEach((a) => {
                if (!mergedCategories.includes(a.category)) mergedCategories.push(a.category);
            });

            const initialValues = {};
            const initialIncluded = {};
            mergedCategories.forEach((category) => {
                if (isUpdate) {
                    const inBudget = category in allocationMap;
                    initialIncluded[category] = inBudget;
                    initialValues[category] = inBudget ? allocationMap[category] : Math.round(averagesMap[category] || 0);
                } else {
                    initialIncluded[category] = true;
                    initialValues[category] = Math.round(averagesMap[category] || 0);
                }
            });

            setCategories(mergedCategories);
            setAverages(averagesMap);
            setValues(initialValues);
            setIncluded(initialIncluded);
        } catch (error) {

        } finally {
            setDataLoading(false);
        }
    };

    const closeBox = () => {
        dispatch({ type: actionTypes.CLOSE_ACTIVE_BOX });
    };

    // ---- handlers ----
    const isIncluded = (category) => included[category] !== false;

    const handleNameChange = (e) => setName(e.target.value);

    const handleCapChange = (e) => {
        const sanitized = e.target.value.replace(/[^0-9]/g, '');
        setCap(sanitized);
    };

    const handlePrevMonth = () => {
        setMonth((m) => {
            if (m <= 1) { setYear((y) => y - 1); return 12; }
            return m - 1;
        });
    };

    const handleNextMonth = () => {
        setMonth((m) => {
            if (m >= 12) { setYear((y) => y + 1); return 1; }
            return m + 1;
        });
    };

    const handleSliderChange = (category, value) => {
        setValues((prev) => ({ ...prev, [category]: Number(value) }));
    };

    const handleToggleCategory = (category) => {
        setIncluded((prev) => ({ ...prev, [category]: !isIncluded(category) }));
    };

    const resetToAverages = () => {
        const resetValues = {};
        categories.forEach((category) => {
            resetValues[category] = Math.round(averages[category] || 0);
        });
        setValues(resetValues);
    };

    const allocated = categories.reduce(
        (sum, category) => sum + (isIncluded(category) ? (values[category] || 0) : 0),
        0
    );
    const includedCount = categories.filter((category) => isIncluded(category)).length;
    const capNum = cap === '' ? null : Math.max(0, parseFloat(cap) || 0);
    const showCapMeter = capNum != null && capNum > 0;

    const autoDistribute = () => {
        if (!capNum) return;
        const includedCategories = categories.filter((category) => isIncluded(category));
        const currentTotal = includedCategories.reduce((sum, category) => sum + (values[category] || 0), 0) || 1;
        const factor = capNum / currentTotal;
        const distributed = { ...values };
        includedCategories.forEach((category) => {
            const { max, step } = deriveSliderBounds(averages[category]);
            let next = Math.round((values[category] || 0) * factor / step) * step;
            next = Math.max(0, Math.min(max, next));
            distributed[category] = next;
        });
        setValues(distributed);
    };

    const canSave = name.trim().length > 0 && allocated > 0;

    const handleSubmit = async () => {
        if (!canSave) return;
        try {
            setIsSaving(true);
            const budgetInput = {
                name: name.trim(),
                month,
                year,
                categoryAllocations: categories
                    .filter((category) => isIncluded(category))
                    .map((category) => ({ category, amount: values[category] || 0 })),
                includeExistingExpenses: isCurrentOrPast ? includeExistingExpenses : false,
            };
            await onSubmit(budgetInput);
            closeBox();
        } catch (error) {

        } finally {
            setIsSaving(false);
        }
    };

    // ---- cap meter values ----
    let capPct = 0;
    let capRemainLabel = '';
    let capIntent = 'neutral';
    if (showCapMeter) {
        capPct = Math.min(100, allocated / capNum * 100);
        if (Math.abs(allocated - capNum) < 1) {
            capRemainLabel = 'Fully allocated';
            capIntent = 'good';
        } else if (allocated > capNum) {
            capRemainLabel = `${formatEur(allocated - capNum)} over cap`;
            capIntent = 'over';
        } else {
            capRemainLabel = `${formatEur(capNum - allocated)} left to allocate`;
            capIntent = 'good';
        }
    }

    const colorMap = buildCategoryColorMap(categories);

    const renderCategoryRow = (category) => {
        const categoryIncluded = isIncluded(category);
        const value = values[category] || 0;
        const average = averages[category] || 0;
        const { max, step } = deriveSliderBounds(average);
        const valuePct = max > 0 ? Math.max(0, Math.min(100, value / max * 100)) : 0;
        const avgPct = max > 0 ? Math.min(100, average / max * 100) : 0;
        const color = colorMap[category];
        const fillColor = categoryIncluded ? color : '#D3D3D3';
        const delta = computeAverageDelta(value, average);

        const sliderBackground = `linear-gradient(90deg, ${fillColor} 0%, ${fillColor} ${valuePct}%, #e7e7e7 ${valuePct}%, #e7e7e7 100%)`;

        return (
            <div className={`createbudgetbox__catrow ${categoryIncluded ? '' : 'excluded'}`} key={category}>
                <button
                    className={`createbudgetbox__checkbox ${categoryIncluded ? 'checked' : ''}`}
                    onClick={() => handleToggleCategory(category)}
                    title={categoryIncluded ? 'Exclude from this budget' : 'Include in this budget'}
                >
                    {categoryIncluded && <CheckRoundedIcon style={{ fontSize: 14 }} />}
                </button>

                <div className='createbudgetbox__catinfo'>
                    <span className='createbudgetbox__swatch' style={{ backgroundColor: color }} />
                    <div className='createbudgetbox__catinfo__text'>
                        <div className='createbudgetbox__catname'>{category}</div>
                        <div className='createbudgetbox__catavg'>
                            {average > 0 ? `avg ${formatEur(average)}` : 'no history'}
                        </div>
                    </div>
                </div>

                <div className='createbudgetbox__slidercontainer'>
                    <input
                        type='range'
                        min={0}
                        max={max}
                        step={step}
                        value={value}
                        disabled={!categoryIncluded}
                        onChange={(e) => handleSliderChange(category, e.target.value)}
                        className='createbudgetbox__slider'
                        style={{ background: sliderBackground }}
                    />
                    {categoryIncluded && average > 0 && (
                        <div className='createbudgetbox__avgmarker' style={{ left: `${avgPct}%` }} />
                    )}
                </div>

                <div className='createbudgetbox__catright'>
                    {categoryIncluded ? (
                        <>
                            <span className='createbudgetbox__catvalue'>{formatEur(value)}</span>
                            <span className={`createbudgetbox__deltachip ${delta.intent}`}>{delta.label}</span>
                        </>
                    ) : (
                        <span className='createbudgetbox__notbudgeted'>Not budgeted</span>
                    )}
                </div>
            </div>
        );
    };

    const title = isUpdate ? 'Update budget' : 'Create budget';
    const subtitle = isUpdate
        ? 'Adjust the period, categories, or amounts for this budget.'
        : 'Set a target for a month, then fine-tune each category.';
    const submitLabel = isUpdate ? 'Save changes' : 'Create budget';

    return (
        <div className='box__backdrop' onClick={closeBox}>
            <div className='createbudgetbox__container' onClick={(e) => e.stopPropagation()}>
                <button className='createbudgetbox__cancelbutton' onClick={closeBox}>
                    <CloseRoundedIcon fontSize='medium' />
                </button>

                <div className='createbudgetbox__header'>
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

                <div className='createbudgetbox__content'>
                    {dataLoading ? (
                        <div className='createbudgetbox__loading'>
                            <SyncLoader size={10} color='#909090' />
                        </div>
                    ) : (
                        <>
                            {/* Name + period */}
                            <div className='createbudgetbox__toprow'>
                                <div className='createbudgetbox__inputgroup'>
                                    <label>Budget name</label>
                                    <input
                                        type='text'
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder='e.g. Everyday, Vacation, Tight month'
                                    />
                                </div>
                                <div className='createbudgetbox__inputgroup'>
                                    <label>Applies to</label>
                                    <div className='createbudgetbox__monthstepper'>
                                        <button onClick={handlePrevMonth} aria-label='Previous month'>
                                            <ChevronLeftRoundedIcon fontSize='small' />
                                        </button>
                                        <span>{MONTHS[month - 1]} {year}</span>
                                        <button onClick={handleNextMonth} aria-label='Next month'>
                                            <ChevronRightRoundedIcon fontSize='small' />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Include existing expenses */}
                            {isCurrentOrPast && (
                                <div className='createbudgetbox__includeexisting'>
                                    <div className='createbudgetbox__includeexisting__text'>
                                        <div className='createbudgetbox__includeexisting__label'>Include existing expenses</div>
                                        <div className='createbudgetbox__includeexisting__hint'>Count expenses already recorded for this period toward the budget. Turn off to start tracking from zero.</div>
                                    </div>
                                    <label className='toggle-switch'>
                                        <input
                                            type='checkbox'
                                            checked={includeExistingExpenses}
                                            onChange={(e) => setIncludeExistingExpenses(e.target.checked)}
                                        />
                                        <span className='slider'></span>
                                    </label>
                                </div>
                            )}

                            {/* Monthly cap */}
                            <div className='createbudgetbox__cap'>
                                <div className='createbudgetbox__cap__left'>
                                    <label>Monthly cap <span className='createbudgetbox__optional'>optional</span></label>
                                    <div className='createbudgetbox__capinput'>
                                        <span className='createbudgetbox__capinput__symbol'>€</span>
                                        <input
                                            type='text'
                                            inputMode='numeric'
                                            value={cap}
                                            onChange={handleCapChange}
                                            placeholder='2,200'
                                        />
                                    </div>
                                    <p className='createbudgetbox__caphint'>
                                        Set a ceiling and distribute it across categories. We'll warn you if your allocations go over.
                                    </p>
                                </div>
                                {showCapMeter && (
                                    <div className='createbudgetbox__cap__right'>
                                        <div className='createbudgetbox__capmeter__top'>
                                            <span>Allocated</span>
                                            <span className={`createbudgetbox__capmeter__amount ${capIntent}`}>
                                                {formatEur(allocated)} / {formatEur(capNum)}
                                            </span>
                                        </div>
                                        <div className='createbudgetbox__capmeter__bar'>
                                            <div
                                                className={`createbudgetbox__capmeter__fill ${capIntent}`}
                                                style={{ width: `${capPct}%` }}
                                            />
                                        </div>
                                        <div className='createbudgetbox__capmeter__bottom'>
                                            <span className={`createbudgetbox__capmeter__remain ${capIntent}`}>{capRemainLabel}</span>
                                            <button className='createbudgetbox__linkbutton' onClick={autoDistribute}>
                                                Auto-distribute to cap
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Categories header */}
                            <div className='createbudgetbox__catheader'>
                                <div>
                                    <div className='createbudgetbox__catheader__title'>Categories</div>
                                    <div className='createbudgetbox__catheader__subtitle'>Prefilled with your average over the last 6 months.</div>
                                </div>
                                <button className='createbudgetbox__linkbutton' onClick={resetToAverages}>
                                    <RefreshRoundedIcon style={{ fontSize: 15 }} />
                                    Reset to average
                                </button>
                            </div>

                            {/* Category rows */}
                            <div className='createbudgetbox__catrows'>
                                {categories.map((category) => renderCategoryRow(category))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {!dataLoading && (
                    <div className='createbudgetbox__footer'>
                        <div className='createbudgetbox__footer__total'>
                            <div className='createbudgetbox__footer__label'>Total planned</div>
                            <div className='createbudgetbox__footer__value'>
                                {formatEur(allocated)} <span>/ month</span>
                            </div>
                            <div className='createbudgetbox__footer__count'>
                                {includedCount} of {categories.length} categories budgeted
                            </div>
                        </div>
                        <div className='createbudgetbox__footer__actions'>
                            <button className='createbudgetbox__button cancel' onClick={closeBox}>
                                Cancel
                            </button>
                            <button
                                className='createbudgetbox__button submit'
                                onClick={handleSubmit}
                                disabled={!canSave || isSaving}
                            >
                                {isSaving ? <ClipLoader size={18} color='#ffffff' /> : submitLabel}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
