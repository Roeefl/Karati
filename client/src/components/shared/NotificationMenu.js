import React from 'react';

import { connect } from 'react-redux';
import { markNotificationAsSeen } from '../../actions';

import Notification from './Notification';

import './NotificationMenu.css';

class NotificationMenu extends React.Component {
    markNotificationAsSeen = (userId, notificationId) => {
        this.props.markNotificationAsSeen(userId, notificationId);
    }

    render() {
        const notifications = this.props.userData.notifications.map( notification => {
            return (   
                <Notification key={notification._id} data={notification} userId={this.props.userData._id} markNotificationAsSeen={this.markNotificationAsSeen}/>
            );
        });
    
        return (
            <div className="ui segment notifications">
                <h4 className="ui horizontal divider header">
                    <i className="red bell outline icon"></i>
                    Notifications
                </h4>
                <div className="ui items">
                    {notifications}
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        userData: state.userData
    }
};

export default connect(
    mapStateToProps,
    { markNotificationAsSeen }
)(NotificationMenu);