import './Auth.css';
import React from 'react';

const methodConfig = {
    google: {
        iconName: 'google'
    },
    facebook: {
        iconName: 'facebook'
    }
}

class Auth extends React.Component {
    renderLink() {
        const { iconName } = methodConfig[this.props.method];

        switch (this.props.loggedIn) {
            case null:
                return (
                    <div className="auth item">
                    </div>
                );
            case false:
                return (
                    <a className="auth item" href="/login/google">
                        <i className={`icon small ${iconName}`} />
                        Google Login
                    </a>
                );
            default:
                return (
                    <a className="auth item" href="/api/logout">
                        <i className={`icon small sign-out`} />
                        Log Out
                    </a>
                );
        }
    }

    render() {
        return (
            this.renderLink()
        );
    }
}

export default Auth;