import '../../css/ClientErrorBox.css';

function ClientErrorBox({ onClose, errorData }) {
  // Format error data for display
  const formatErrorData = (data) => {
    if (!data) return 'No additional error information available.';

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object') {
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return 'Error data could not be formatted.';
      }
    }

    return String(data);
  };

  const formattedError = formatErrorData(errorData);

  return (
    <div className='box__backdrop'>
      <div className="clienterrorbox__container" onClick={e => { e.stopPropagation(); }}>
        <div className="clienterrorbox__header">
          <span className="clienterrorbox__icon">❌</span>
          <h2>Invalid request</h2>
        </div>

        <div className="clienterrorbox__content">
          <p className="clienterrorbox__message">
            There was an error with your request. This typically means the request was invalid or contained incorrect data.
          </p>

          <div className="clienterrorbox__error-details">
            <h3 className="clienterrorbox__details-title">Error Details:</h3>
            <pre className="clienterrorbox__error-data">
              {formattedError}
            </pre>
          </div>
        </div>

        <div className="clienterrorbox__actions">
          <button
            className="clienterrorbox__button clienterrorbox__button--primary"
            onClick={onClose}
          >
            <span>Close</span>
          </button>
        </div>

        <p className="clienterrorbox__footer">
          If this error continues, please reach out to our support team.
        </p>
      </div>
    </div>
  );
}

export default ClientErrorBox;

