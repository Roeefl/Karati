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
        switch (this.props.loggedIn) {
            case null:
                return (
                    <span></span>
                );
            case false:
                return (
                    <a href="/login/google">Google Login</a>
                );
            default:
                return (
                    <a href="/api/logout">Log Out</a>
                );
        }
    }

    render() {
        const { iconName } = methodConfig[this.props.method];

        return (
            <div className="auth item">
                <i className={`icon small ${iconName}`} />
                {this.renderLink()}
            </div>
        );
    }
}

export default Auth;