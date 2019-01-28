import React from 'react';
import { connect } from 'react-redux';
import { setCurrentComponent } from '../../actions';

import ProfileFormContainer from './ProfileFormContainer';
import Message from '../shared/Message';
import Spinner from '../shared/Spinner';

class MyProfile extends React.Component {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'Your Profile',
            secondary: 'Update your info and details',
            icon: 'user outline'
        });
    }

    renderContent() {
        // console.log(this.props);
        
        if (!this.props.userData) {
            return (
                <Spinner message="Fetching Your User Profile..."/>
            );
        }

        if (this.props.userData.error) {
            return (
                <Message 
                    color='red'
                    lines={[
                        this.props.userData.error
                    ]} />
            );
        };

        let currentUser = this.props.userData;

        currentUser.joinedAt = new Date(currentUser.createdAt).toLocaleString("en-us", {
            month: 'long',
            year: 'numeric',
            day: 'numeric'
        });
        currentUser.imageURL = 'https://semantic-ui.com/images/avatar/large/elliot.jpg';

        return (
            <div className="ui container">
                <Message
                    color='violet'
                    lines={[
                        `You have ${currentUser.ownedBooks.length || 0} Books on your shelf`
                    ]} />

                <div className="ui centered grid">
                    <div className="ui four wide column">
                        <div className="ui card">
                            <div className="image">
                                <img
                                    src={currentUser.imageURL}
                                    alt="Profile Placeholder" />
                            </div>
                            <div className="content">
                                <div className="header">{currentUser.username}</div>
                                <div className="meta full-name">
                                    {currentUser.fullName.first} {currentUser.fullName.last}
                                </div>
                                <div className="bio">
                                    Bio: {currentUser.bio}
                                </div>
                            </div>
                            <div className="extra content">
                                <i className="user icon"/>
                                {currentUser.ownedBooks.length || 0} Books on Shelf
                            </div>
                            <div className="extra content">
                                <i className="calendar check outline icon"/>
                                Joined in {currentUser.joinedAt}
                            </div>
                            <div className="extra content">
                                <i className="thumbtack icon"/> My Location: {currentUser.location.lat}, {currentUser.location.lng}
                            </div>
                        </div>
                    </div>

                    <div className="ui ten wide column">
                        <ProfileFormContainer />
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
        userData: state.userData
    }
};

export default connect(
    mapStateToProps,
    { setCurrentComponent }
)(MyProfile);