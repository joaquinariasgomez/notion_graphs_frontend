import { actionTypes, BOX_TYPES } from "../context/globalReducer";
import { useGlobalStateValue } from "../context/GlobalStateProvider";

export default function RegisterValueButtons({ }) {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  const showRegisterExpenseBox = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.REGISTER_VALUE,
        data: { valueType: 'expense' }
      }
    })
  }

  const showRegisterIncomeBox = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.REGISTER_VALUE,
        data: { valueType: 'income' }
      }
    })
  }

  return (
    <div className="register_value__buttons">
      <button className="register_expense__button" onClick={showRegisterExpenseBox}>

      </button>
      <button className="register_expense__button" onClick={showRegisterIncomeBox}>

      </button>
    </div>
  );
}