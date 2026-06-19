import '../../css/ViewBudgetBox.css';
import { actionTypes, BOX_TYPES } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { MONTHS, getBudgetStatus } from '../../utils/BudgetUtils';
import BudgetDetails from '../BudgetDetails';

export default function ViewBudgetBox({ budget }) {

    const [, dispatch] = useGlobalStateValue();

    const closeBox = () => {
        dispatch({ type: actionTypes.CLOSE_ACTIVE_BOX });
    };

    if (!budget) return null;

    const status = getBudgetStatus(budget);
    const badgeLabel = status === 'tracking' ? 'Tracking' : status === 'upcoming' ? 'Upcoming' : 'Closed';
    const badgeClass = status === 'tracking' ? 'upcoming' : status; // reuse existing badge colours

    return (
        <div className='box__backdrop' onClick={closeBox}>
            <div className='viewbudgetbox__container' onClick={(e) => e.stopPropagation()}>
                <button className='createbudgetbox__cancelbutton' onClick={closeBox} title='Close'>
                    <CloseRoundedIcon fontSize='medium' />
                </button>

                <div className='viewbudgetbox__header'>
                    <div className='viewbudgetbox__header__top'>
                        <span className={`budgets__badge ${badgeClass}`}>{badgeLabel}</span>
                    </div>
                    <h2>{budget.name}</h2>
                    <p className='viewbudgetbox__header__period'>
                        {MONTHS[budget.month - 1]} {budget.year}
                    </p>
                </div>

                <div className='viewbudgetbox__content'>
                    <BudgetDetails budget={budget} />
                </div>
            </div>
        </div>
    );
}
