import '../css/CreateGraphButton.css';
import { actionTypes, BOX_TYPES } from "../context/globalReducer";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

function CreateGraphButton() {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  const showCreateGraphBox = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: { type: BOX_TYPES.CREATE_GRAPH }
    })
  }

  return (
    <button className="creategraph__button header__item" onClick={showCreateGraphBox}>
      <div className='creategraph__button__container'>
        <AddRoundedIcon sx={{ color: "#28282B" }} fontSize="medium" />
        <h2>Create Graph</h2>
      </div>
    </button>
  );
}

export default CreateGraphButton;