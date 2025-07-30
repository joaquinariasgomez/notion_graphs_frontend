import { useGlobalStateValue } from '../context/GlobalStateProvider';
import '../css/UserCircleButton.css';

function UserCircleButton() {

  // Context
  const [{ }, dispatch] = useGlobalStateValue();

  return (
    <div>

    </div>
  );
}

export default UserCircleButton;