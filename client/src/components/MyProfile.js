import React from 'react';
import { connect } from 'react-redux';

class MyProfile extends React.Component {
    render() {
        const date = new Date(this.props.auth.created);
        const locale = "en-us";
        const joinedAt = date.toLocaleString(locale, {
            month: 'long',
            year: 'numeric'
        });

        return (
            <div className="my-profile">
                <div className="ui card">
                    <div className="image">
                        <img
                            src="https://semantic-ui.com/images/avatar/large/elliot.jpg"
                            alt="Profile Placeholder" />
                    </div>
                    <div className="content">
                        <div className="header">{this.props.auth.username}</div>
                        <div className="meta full-name">
                            {this.props.auth.fullName.first} {this.props.auth.fullName.last}
                        </div>
                        <div className="joinedAt">
                            Joined in {joinedAt}
                        </div>
                    </div>
                    <div className="extra content">
                        <i className="user icon"></i>
                        {this.props.auth.ownedBooks.length || 0} Books on Shelf
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(mapStateToProps)(MyProfile);