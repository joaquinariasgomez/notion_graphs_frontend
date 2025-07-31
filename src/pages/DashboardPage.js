import BoxManager from '../components/boxes/BoxManager';
import CreateGraphButton from '../components/CreateGraphButton';
import UserCicleButton from '../components/UserCircleButton';
import '../css/DashboardPage.css';

function DashboardPage() {

  return (
    <div className="dashboard__page">
      <BoxManager />
      <div className="dashboard__header">
        <CreateGraphButton />
        <UserCicleButton />
      </div>
    </div>
  );
}

export default DashboardPage;