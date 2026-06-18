import { actionTypes } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import { createBudget } from '../../api/RequestUtils';
import BudgetForm from './BudgetForm';

export default function CreateBudgetBox() {

    const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

    const handleCreate = async (budgetInput) => {
        const createdBudget = await createBudget(userJWTCookie, budgetInput);
        if (createdBudget) {
            dispatch({ type: actionTypes.APPEND_BUDGET, value: createdBudget });
        }
    };

    return <BudgetForm mode='create' onSubmit={handleCreate} />;
}
