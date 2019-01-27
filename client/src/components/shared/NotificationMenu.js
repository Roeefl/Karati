import React from 'react';

import { connect } from 'react-redux';
import { fetchUser, markNotificationAsSeen, clearNotifications } from '../../actions';

import Notification from './Notification';

import './NotificationMenu.css';

class NotificationMenu extends React.Component {
    constructor(props) {
        super(props);
        this.channel = null;
     }

    connectToPusher = () => {
        if (this.channel)
            return;

        if (!this.props.pusher)
            return;

        if (!this.props.userData)
            return;

        console.log(`channel name: ${this.props.userData._id}`);
        this.channel = this.props.pusher.subscribe(`${this.props.userData._id}`);

        this.channel.bind('newNotification', (data) => {
            console.log(`new msg from Pusher: ${data.content}`);
            this.props.fetchUser();
        });
    }

    markNotificationAsSeen = (userId, notificationId) => {
        this.props.markNotificationAsSeen(userId, notificationId);
    }

    clearNotifications = () => {
        this.props.clearNotifications(this.props.userData._id);
    }

    renderClearButton() {
        if (this.props.userData.notifications.filter( notif => !notif.seen).length > 0) {
            return (
                <div className="ui segment clear-notifications">
                    <div
                        className="ui negative labeled icon button"
                        onClick={this.clearNotifications} >
                        <i className="x icon"/>
                        Clear All
                    </div>
                </div>
            );
        }
    }

    render() {
        this.connectToPusher();
        
        const notifications = this.props.userData.notifications.filter( notif => !notif.seen).map( notif => {
            return (   
                <Notification key={notif._id} data={notif} userId={this.props.userData._id} markNotificationAsSeen={this.markNotificationAsSeen}/>
            );
        });
    
        return (
            <div className="ui segment notifications">
                <h4 className="ui horizontal divider header">
                    <i className="red bell outline icon"></i>
                    Notifications
                </h4>
                
                <div className="ui divider" />
                
                {this.renderClearButton()}
                
                <div className="ui items">
                    {notifications}
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        pusher: state.pusher,
        userData: state.userData
    }
};

export default connect(
    mapStateToProps,
    { fetchUser, markNotificationAsSeen, clearNotifications}
)(NotificationMenu);