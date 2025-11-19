import '../css/UserCircleButton.css';
import { actionTypes, BOX_TYPES } from '../context/globalReducer';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { renderUserImage } from '../utils/Utils';

function UserCircleButton() {

  // Context
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  const showUserProfileBox = () => {
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.PROFILE,
        data: { panel: 'general' }
      }
    });
  }

  return (
    <button className='usercircle__button header__item' onClick={showUserProfileBox}>
      {renderUserImage(userSessionDetails)}
    </button>
  );
}

export default UserCircleButton;