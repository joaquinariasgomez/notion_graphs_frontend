import { actionTypes } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import { updateBudget } from '../../api/RequestUtils';
import BudgetForm from './BudgetForm';

export default function UpdateBudgetBox({ budget }) {

    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const handleUpdate = async (budgetInput) => {
        const updatedBudget = await updateBudget(userJWTCookie, budget.id, budgetInput);
        if (updatedBudget) {
            dispatch({
                type: actionTypes.UPDATE_BUDGET,
                payload: { id: budget.id, data: updatedBudget }
            });
        }
    };

    return <BudgetForm mode='update' initialBudget={budget} onSubmit={handleUpdate} />;
}
