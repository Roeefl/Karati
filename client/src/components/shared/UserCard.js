import React, { Component } from 'react';
import * as icons from '../../config/icons';
import { formatDate } from '../../common';

class UserCard extends Component {
    render() {
        const { user } = this.props;
        
        const joinedAt = formatDate(user.createdAt);

        return (
            <div className="ui card">
                <div className="image">
                    <img
                        src={user.portrait}
                        alt="Profile Placeholder" />
                </div>
                <div className="content">
                    <div className="header">{user.username}</div>
                    <div className="meta full-name">
                        {user.fullName.first} {user.fullName.last}
                    </div>
                    <div className="bio">
                        Bio: {user.bio}
                    </div>
                </div>
                <div className="extra content">
                    <i className={`${icons.USER} icon`} />
                    {user.ownedBooks.length || 0} Books on Shelf
                </div>
                <div className="extra content">
                    <i className={`${icons.JOINED_AT} icon`} />
                    Joined in {joinedAt}
                </div>
                <div className="extra content">
                    <i className={`${icons.LOCATION} icon`} /> My Location: {user.location.lat}, {user.location.lng}
                </div>
            </div>
        );
    }
}

export default UserCard;