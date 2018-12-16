import { connect } from 'react-redux';

import React from 'react';

import Message from './shared/Message';
import Spinner from './shared/Spinner';
import * as errors from './shared/errors';

class MyProfile extends React.Component {
    renderContent() {
        if (this.props.auth === null) {
            return (
                <Spinner message="Fetching Your User Profile..."/>
            );
        }

        if (!this.props.auth) {
            return (
                <Message 
                    color='red'
                    lines={[
                        errors.NOT_LOGGED_IN
                    ]} />
            );
        }

        // let currentUser = {
        //     username: 'Mr. Eames',
        //     fullName: {
        //         first: 'Tom',
        //         last: 'Hardy'
        //     },
        //     ownedBooks: []
        // }

        // let joinedAt = new Date().toLocaleString("en-us", {
        //     month: 'long',
        //     year: 'numeric'
        // });

        // let imageURL = 'https://notednames.com/ImgProfile/oml_Tom%20Hardy.jpg'
        
        const currentUser = this.props.auth;

        const joinedAt = new Date(this.props.auth.createdAt).toLocaleString("en-us", {
            month: 'long',
            year: 'numeric'
        });

        const imageURL = 'https://semantic-ui.com/images/avatar/large/elliot.jpg';

        return (
            <div className="ui container">
                <Message
                    color='violet'
                    lines={[
                        `You have ${currentUser.ownedBooks.length || 0} Books on your shelf`
                    ]} />
                    

                <div className="ui card">
                    <div className="image">
                        <img
                            src={imageURL}
                            alt="Profile Placeholder" />
                    </div>
                    <div className="content">
                        <div className="header">{currentUser.username}</div>
                        <div className="meta full-name">
                            {currentUser.fullName.first} {currentUser.fullName.last}
                        </div>
                        <div className="joinedAt">
                            Joined in {joinedAt}
                        </div>
                    </div>
                    <div className="extra content">
                        <i className="user icon"></i>
                        {currentUser.ownedBooks.length || 0} Books on Shelf
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="my-profile">
                {this.renderContent()}
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