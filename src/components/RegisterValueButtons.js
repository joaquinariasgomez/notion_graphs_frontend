import { actionTypes, BOX_TYPES } from "../context/globalReducer";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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
      <button className="register_value__button" onClick={showRegisterExpenseBox}>
        <ArrowDownwardIcon />
        <p>Register expense</p>
      </button>
      <button className="register_value__button" onClick={showRegisterIncomeBox}>
        <ArrowUpwardIcon />
        <p>Register income</p>
      </button>
    </div>
  );
}