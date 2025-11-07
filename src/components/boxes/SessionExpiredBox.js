import '../../css/SessionExpiredBox.css';

function SessionExpiredBox() {
    // TODO JOAQUIN: refactor to go to /login page
    const authorization_url = process.env.REACT_APP_NOTION_AUTH_URL;

    return (
        <div className='box__backdrop'>
            <div className="sessionexpiredbox__container" onClick={e => { e.stopPropagation(); }}>
                <p>It looks like your session has expired.</p>
                <a className='landingpage__loginbutton' href={authorization_url}>
                    <p>Login with Notion</p>
                    <img src={process.env.PUBLIC_URL + '/notion_logo.png'} alt=''></img>
                </a>
            </div>
        </div>
    );
}

export default SessionExpiredBox;