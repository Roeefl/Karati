import './Auth.css';

import React from 'react';

import HeaderMenu from './HeaderMenu';
import NotificationButton from './shared/NotificationButton';

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

        if (!this.props.userData) {
            return (
                <div className="user-data item">
                </div>
            );
        }

        if (this.props.userData.error) {
            return (
                <a className="user-data item" href="/login/google">
                    <i className={`icon green small ${iconName}`} />
                    Google Login
                </a>
            );
        }

        const links = [
            {
                to: '/myProfile',
                text: 'My Profile',
                icon: 'user outline'
            },
            {
                to: '/mySettings',
                text: 'Settings',
                icon: 'settings'
            }
        ];

        let notifCount = 0;
        if (this.props.userData.notifications) {
            notifCount = this.props.userData.notifications.filter( notif => !notif.seen).length;
        }
        
        return (
            <div className="user-data item menu">
                <div className="item">
                    <HeaderMenu title={this.props.userData.username} links={links}/>
                </div>
                <div className="item">
                    <NotificationButton unread={notifCount} />    
                </div>
                <div className="item">
                    <a className="user-data item" href="/api/logout">
                        <i className={`icon green small sign-out`} />
                        Log Out
                    </a>
                </div>
            </div>
        );
    }

    render() {
        return (
            this.renderLink()
        );
    }
}

export default Auth;