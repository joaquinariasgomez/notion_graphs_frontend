import '../css/CreateGraphButton.css';
import { actionTypes } from "../context/globalReducer";
import { useGlobalStateValue } from "../context/GlobalStateProvider";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

function CreateGraphButton() {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  const showCreateGraphBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_CREATE_GRAPH_BOX,
      value: true
    })
  }

  return (
    <button className="creategraph__button header__item" onClick={showCreateGraphBox}>
      <div className='creategraph__button__container'>
        <AddRoundedIcon sx={{ color: "#28282B" }} fontSize="medium" />
        <h2>Create Chart</h2>
      </div>
    </button>
  );
}

export default CreateGraphButton;