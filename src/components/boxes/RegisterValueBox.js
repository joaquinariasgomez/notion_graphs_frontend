import { actionTypes } from "../../context/globalReducer";
import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function RegisterValueBox({ valueType }) {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  const closeBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    })
  }

  return (
    <div className='box__backdrop' onClick={closeBox}>
      <div className='registervaluebox__container' onClick={e => { e.stopPropagation(); }}>
        <button className='registervaluebox__cancelbutton' onClick={closeBox}>
          <CloseRoundedIcon fontSize='medium' />
        </button>
        <h1>{valueType}</h1>
      </div>
    </div>
  );
}