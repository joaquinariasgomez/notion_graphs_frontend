import '../css/UserCircleButton.css';
import { actionTypes } from '../context/globalReducer';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { renderUserImage } from '../utils/Utils';

function UserCircleButton() {

  // Context
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  const showUserProfileBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_USER_PROFILE_BOX,
      value: true
    });
  }

  return (
    <button className='usercircle__button header__item' onClick={showUserProfileBox}>
      {renderUserImage(userSessionDetails)}
    </button>
  );
}

export default UserCircleButton;