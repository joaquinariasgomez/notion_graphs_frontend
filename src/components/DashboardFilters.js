import { useState } from "react";
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CHART_TYPES = [
  { id: 'EXPENSES', label: 'Expenses', icon: TrendingDownRoundedIcon },
  { id: 'INCOMES', label: 'Incomes', icon: AttachMoneyRoundedIcon },
  { id: 'SAVINGS', label: 'Savings', icon: TrendingUpRoundedIcon },
  { id: 'BURNDOWN', label: 'Burndown', icon: LocalFireDepartmentIcon },
];

// TODO: add "NO_TIME" to the time options, which would show charts with no time filter
const TIME_OPTIONS = [
  { value: 'ALL_TIME', label: 'All time' },
  { value: 'LAST_WEEK', label: 'Last week' },
  { value: 'LAST_MONTH', label: 'Last month' },
  { value: 'LAST_YEAR', label: 'Last year' },
  { value: 'CUSTOM', label: 'Custom time' },
];

export default function DashboardFilters({ onFiltersChange }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeToggle = (typeId) => {
    const newSelectedType = selectedType === typeId ? null : typeId;

    setSelectedType(newSelectedType);
    onFiltersChange?.({
      chartType: newSelectedType,
      timeRange: selectedTime
    });
  };

  const handleTimeChange = (event) => {
    const newTime = event.target.value === "ALL_TIME" ? null : event.target.value;
    setSelectedTime(newTime);
    onFiltersChange?.({
      chartType: selectedType,
      timeRange: newTime
    });
  };

  const clearAllFilters = () => {
    setSelectedType(null);
    setSelectedTime(null);
    onFiltersChange?.({
      chartType: null,
      timeRange: null
    });
  };

  const hasActiveFilters = selectedType !== null || selectedTime !== null;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedType !== null) count++;
    if (selectedTime !== null) count++;
    return count;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`dashboard__filters ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className={`dashboard__filters__toggle ${hasActiveFilters ? 'has-active' : ''}`}
        onClick={toggleExpanded}
      >
        <div className="dashboard__filters__toggle__left">
          <FilterListIcon className="filters__icon" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="dashboard__filters__badge">{getActiveFiltersCount()}</span>
          )}
        </div>
        <KeyboardArrowDownIcon className={`dashboard__filters__arrow ${isExpanded ? 'rotated' : ''}`} />
      </button>

      <div className={`dashboard__filters__collapsible ${isExpanded ? 'show' : ''}`}>
        <div className="dashboard__filters__content">
          <div className="dashboard__filters__section">
            <span className="dashboard__filters__label">Chart type</span>
            <div className="dashboard__filters__chips">
              {CHART_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`dashboard__filter__chip ${selectedType === id ? 'active' : ''}`}
                  onClick={() => handleTypeToggle(id)}
                >
                  <Icon className="chip__icon" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="dashboard__filters__section">
            <span className="dashboard__filters__label">Time range</span>
            <select
              className="dashboard__filters__select"
              value={selectedTime ?? 'ALL_TIME'}
              onChange={handleTimeChange}
            >
              {TIME_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="dashboard__filters__footer">
            <button
              className="dashboard__filters__clear"
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

