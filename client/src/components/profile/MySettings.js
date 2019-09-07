import React from 'react';
import { connect } from 'react-redux';
import { setCurrentComponent, updateUserSettings } from '../../actions';

import ToggleSetting from './ToggleSetting';
import settingsArr from './settings';
import './MySettings.css';

import Message from '../shared/Message';
import Spinner from '../shared/Spinner';

import * as Sentry from '@sentry/browser';

class mySettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });

    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  componentDidMount() {
    this.props.setCurrentComponent({
      primary: 'Your Settings',
      secondary: 'Edit your account settings',
      icon: 'settings'
    });
  }

  componentWillReceiveProps() {
    console.log('props');
    if (this.state.initialized) {
      return;
    }

    for (let setting of settingsArr) {
      this.setState({
        [setting.name]: this.props.userData.settings[setting.name]
      });
    }

    this.setState({
      initialized: true
    });
  }

  saveSettings = () => {
    this.props.updateUserSettings(this.state);
  };

  handleChange = event => {
    const value = event.target.checked;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  };

  renderContent() {
    if (this.state.error) {
      // render fallback UI
      return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>;
    }

    if (!this.props.userData) {
      return <Spinner message="Fetching your settings..." />;
    }

    if (this.props.userData.error) {
      return <Message color="red" lines={[this.props.userData.error]} />;
    }

    const settings = settingsArr.map(setting => {
      return (
        <ToggleSetting
          key={setting.name}
          name={setting.name}
          label={setting.label}
          checked={this.props.userData.settings[setting.name] || false}
          handleChange={this.handleChange}
        />
      );
    });

    console.log(this.state);

    return (
      <div className="ui centered grid">
        <div className="ui eight wide column">
          <h2 className="ui centered header">
            <i className="red envelope outline icon"></i>
            Mail Settings
          </h2>

          <h3 className="ui centered header">
            Choose what kind of mails you would like to receive from the app
          </h3>

          <div className="ui raised segment">{settings}</div>

          <div
            className="ui left labeled icon button"
            onClick={this.saveSettings}
          >
            <i className="green save icon"></i>
            Save
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="my-settings ui container">{this.renderContent()}</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userData
  };
}

export default connect(
  mapStateToProps,
  { setCurrentComponent, updateUserSettings }
)(mySettings);
