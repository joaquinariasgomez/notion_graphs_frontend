import { useState } from "react";
import { deleteAccount, logoutFromSystem } from "../../../api/RequestUtils";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { useCookie } from "../../../useCookie";
import { useLocalStorage } from "../../../useLocalStorage";
import ClipLoader from "react-spinners/ClipLoader";
import { renderUserImage } from "../../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../../context/globalReducer";

export default function GeneralPanel({ onClose }) {

  // Context
  const [{ userSessionDetails, userJWTCookie }, dispatch] = useGlobalStateValue();

  const navigate = useNavigate();
  const [, , deleteUserJWTCookie] = useCookie("userJWT");
  const [, , deleteUserSessionDetailsValue] = useLocalStorage("userSessionDetails");

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCannotDeleteAccountInfo, setShowCannotDeleteAccountInfo] = useState(false);

  const logOut = async () => {
    try {
      setIsLoggingOut(true);
      await logoutFromSystem(userJWTCookie);
    } catch (error) {

    } finally {
      setIsLoggingOut(false);
      // Delete cookie and local storage
      deleteUserJWTCookie();
      deleteUserSessionDetailsValue();
      closeBox();
      handleBackToHome();
    }
  }

  const deleteUserAccount = () => {
    setShowDeleteConfirmation(true);
  }

  const confirmDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      const apiResponse = await deleteAccount(userJWTCookie);
      if (apiResponse) {
        const canDeleteAccount = apiResponse.canDeleteAccount;
        if (canDeleteAccount) {
          deleteUserJWTCookie();
          deleteUserSessionDetailsValue();
          closeBox();
          handleBackToHome();
        } else {
          // Show info modal explaining why account can't be deleted due to billing subscription
          setShowDeleteConfirmation(false);
          setShowCannotDeleteAccountInfo(true);
        }
      }
    } catch (error) {

    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirmation(false);
    }
  }

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmation(false);
  }

  const closeSubscriptionInfo = () => {
    setShowCannotDeleteAccountInfo(false);
  }

  const closeBox = () => {
    dispatch({
      type: actionTypes.CLOSE_ACTIVE_BOX
    })
  }

  const handleBackToHome = () => {
    navigate('/');
  };

  // Info tooltip component
  const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div
        className="info-tooltip__container"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <span className="info-tooltip__icon">
          i
        </span>
        {isVisible && (
          <div className="info-tooltip__popup">
            {text}
            <div className="info-tooltip__arrow"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="generalpanel">
        <div className="userimage">
          {renderUserImage(userSessionDetails)}
        </div>
        <div className='username'>
          <h2>👋 {userSessionDetails.name}</h2>
        </div>
        <div className='actions'>
          <button className='profilebox__button logout' onClick={logOut}>
            {isLoggingOut ? <ClipLoader size={15} /> : 'Logout'}
          </button>
          <div className='danger-zone'>
            <p className='danger-zone__warning'>⚠️ Danger Zone</p>
            <div className="danger-zone__button-container">
              <button className='profilebox__button delete' onClick={deleteUserAccount}>
                Delete account
              </button>
              <InfoTooltip text="Deleting your account will permanently remove all your user data, charts, and settings." />
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="confirmation-modal__backdrop" onClick={cancelDeleteAccount}>
          <div className="confirmation-modal__container" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-modal__header">
              <span className="confirmation-modal__icon">⚠️</span>
              <h3>Delete Account</h3>
            </div>
            <div className="confirmation-modal__body">
              <p>Are you sure you want to delete your account?</p>
              <p className="confirmation-modal__warning">This action cannot be undone. All your data will be permanently deleted.</p>
            </div>
            <div className="confirmation-modal__actions">
              <button
                className="confirmation-modal__button cancel"
                onClick={cancelDeleteAccount}
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                className="confirmation-modal__button confirm"
                onClick={confirmDeleteAccount}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? <ClipLoader size={15} color="white" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCannotDeleteAccountInfo && (
        <div className="confirmation-modal__backdrop" onClick={closeSubscriptionInfo}>
          <div className="info-modal__container" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal__header">
              <span className="info-modal__icon">ℹ️</span>
              <h3>Cannot Delete Account</h3>
            </div>
            <div className="info-modal__body">
              <p>You cannot delete your account because you have an <strong>active billing subscription</strong>.</p>

              <div className="info-modal__section">
                <h4>📧 Request Account Deletion</h4>
                <p>If you want to proceed with deleting your account, please send an email to <strong>notionwallet@gmail.com</strong> with your account details to request deletion.</p>
              </div>

              <div className="info-modal__section">
                <h4>💳 Cancel Subscription Only</h4>
                <p>Alternatively, if you simply wish to cancel your subscription, you can do so under the <strong>"Billing"</strong> panel.</p>
              </div>
            </div>
            <div className="info-modal__actions">
              <button
                className="confirmation-modal__button cancel"
                onClick={closeSubscriptionInfo}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}