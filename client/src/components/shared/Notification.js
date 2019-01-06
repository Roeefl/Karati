import React from 'react';
import { Link } from 'react-router-dom';

import match64 from '../../icons/match/64.png';

class Notification extends React.Component {
    notificationClicked = () => {
        this.props.markNotificationAsSeen(this.props.userId, this.props.data._id);
    }

    render() {
        return (
            <div className={`item ${this.props.data.seen ? 'seen' : 'new'}`}>
                <div className="ui tiny image">
                    <img src={match64} />
                </div>
                    <Link to={this.props.data.link} className="enforce-black">
                        <div className="content">
                            <div className="header">
                                {this.props.data.notifType}
                            </div>

                            <div className="description" onClick={this.notificationClicked}>
                                {this.props.data.content}
                            </div>
                        </div>
                    </Link>
                <div className="ui section divider"></div>
            </div>
        );
    }
};

export default Notification;