import { useState, useEffect, useRef } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function DashboardSearch({ onSearchChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const skipDebounceRef = useRef(false);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Debounce: fire onSearchChange 400ms after the user stops typing
    useEffect(() => {
        if (skipDebounceRef.current) {
            skipDebounceRef.current = false;
            return;
        }
        const timer = setTimeout(() => {
            onSearchChange?.(query || null);
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const handleToggle = () => {
        if (isOpen) {
            skipDebounceRef.current = true;
            setQuery('');
            if (query) onSearchChange?.(null);
        }
        setIsOpen(prev => !prev);
    };

    return (
        <div className={`dashboard__search ${isOpen ? 'open' : ''}`}>
            {isOpen && (
                <input
                    ref={inputRef}
                    className="dashboard__search__input"
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            )}
            <button
                className={`dashboard__search__btn ${isOpen ? 'active' : ''}`}
                onClick={handleToggle}
                title={isOpen ? 'Close search' : 'Search charts'}
            >
                {isOpen ? <CloseRoundedIcon className="search__icon" /> : <SearchRoundedIcon className="search__icon" />}
            </button>
        </div>
    );
}
