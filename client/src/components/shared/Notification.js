import React from "react";
import { Link } from "react-router-dom";
import match64 from "../../icons/match/64.png";

class Notification extends React.Component {
  notificationClicked = () => {
    const { userId, data, markNotificationAsSeen } = this.props;

    markNotificationAsSeen(userId, data._id);
  };

  render() {
    const { data } = this.props;

    return (
      <div className={`item ${data.seen ? "seen" : "new"}`}>
        <div className="ui tiny image">
          <img src={match64} alt="match-icon-64" />
        </div>
        <Link to={data.link} className="enforce-black">
          <div className="content">
            <div className="header">{data.notifType}</div>

            <div className="description" onClick={this.notificationClicked}>
              {data.content}
            </div>
          </div>
        </Link>
        <div className="ui section divider" />
      </div>
    );
  }
}

export default Notification;
