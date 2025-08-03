import { useGlobalStateValue } from "../../context/GlobalStateProvider";
import CreateGraphBox from "./CreateGraphBox";
import ProfileBox from "./ProfileBox";

export default function BoxManager() {

  // Context
  const [{ showCreateGraphBox, showUserProfileBox }, dispatch] = useGlobalStateValue();

  // TODO: if it is an alert box, render it before the other boxes
  const isAlertBox = () => {

  }

  const renderBox = () => {
    if (showUserProfileBox) {
      return (
        <ProfileBox />
      )
    } else if (showCreateGraphBox) {
      return (
        <CreateGraphBox />
      )
    }
  }

  return renderBox();
}