import '../css/UserCircleButton.css';
import { actionTypes } from '../context/globalReducer';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import PersonIcon from '@mui/icons-material/Person';

function UserCircleButton() {

  // Context
  const [{ userSessionDetails }, dispatch] = useGlobalStateValue();

  const showUserProfileBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_USER_PROFILE_BOX,
      value: true
    });
  }

  const renderUserImage = () => {
    if (userSessionDetails.avatar_url !== "") {
      // Show user image
      return (
        <img src={userSessionDetails.avatar_url} alt=''></img>
      )
    } else {
      return (
        <PersonIcon fontSize='large' />
      )
    }
  }

  return (
    <button className='usercircle__button header__item' onClick={showUserProfileBox}>
      {renderUserImage()}
    </button>
  );
}

export default UserCircleButton;