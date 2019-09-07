import './Auth.css';

import React from 'react';

import withLanguage from '../withLanguage';
import { getString } from '../../locale';

import HeaderMenu from '../header/HeaderMenu';
import NotificationButton from '../shared/NotificationButton';

const methodConfig = {
  google: {
    iconName: 'google'
  },
  facebook: {
    iconName: 'facebook'
  }
};

class Auth extends React.Component {
  swapLanguage = () => {
    this.props.swapLanguage();
  };

  renderLink() {
    const { iconName } = methodConfig[this.props.method];

    if (!this.props.userData)
      return <div className='user-data item' />;

    if (this.props.userData.error)
      return (
        <a className='user-data item' href='/login/google'>
          <i className={`icon green small ${iconName}`} />
          Google Login
        </a>
      );

    const { language } = this.props;

    const links = [
      {
        to: '/myProfile',
        text: getString(language, 'auth.profile'),
        icon: 'user outline'
      },
      {
        to: '/stats',
        text: getString(language, 'auth.stats'),
        icon: 'th large'
      },
      {
        to: '/mySettings',
        text: getString(language, 'auth.settings'),
        icon: 'settings'
      }
    ];

    let notifCount = 0;
    if (this.props.userData.notifications)
      notifCount = this.props.userData.notifications.filter( notif => !notif.seen ).length;

    return (
      <div className='user-data item menu'>
        <div className='item'>
          <HeaderMenu
            title={this.props.userData.username}
            links={links}
            icon='user'
          />
        </div>
        <div className='item'>
          <NotificationButton unread={notifCount} />
        </div>
        <div className='item'>
          <a className='user-data item' href='/api/logout'>
            <i className={`icon green small sign-out`} />
            Log Out
          </a>
        </div>
        <div className='item'>
          <div className='ui icon button' onClick={this.swapLanguage}>
            <i className={`red flag outline icon`} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.renderLink();
  }
}

export default withLanguage(Auth);
