import React from 'react';
import { connect } from 'react-redux';
import { setCurrentComponent } from '../../actions';

import ProfileFormContainer from './ProfileFormContainer';
import Message from '../shared/Message';
import Spinner from '../shared/Spinner';
import UserCard from '../shared/UserCard';

class MyProfile extends React.Component {
  componentDidMount() {
    this.props.setCurrentComponent({
      primary: 'Your Profile',
      secondary: 'Update your info and details',
      icon: 'user outline'
    });
  }

  renderContent() {
    if (!this.props.currentUser) {
      return <Spinner message="Fetching Your User Profile..." />;
    }

    if (this.props.currentUser.error) {
      return <Message color="red" lines={[this.props.currentUser.error]} />;
    }

    return (
      <div className="ui container">
        <Message
          color="violet"
          lines={[
            `You have ${this.props.currentUser.ownedBooks.length ||
              0} Books on your shelf`
          ]}
        />

        <div className="ui centered grid">
          <div className="ui four wide column">
            <UserCard user={this.props.currentUser} />
          </div>

          <div className="ui ten wide column">
            <ProfileFormContainer />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div className="my-profile">{this.renderContent()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.userData
  };
}

export default connect(
  mapStateToProps,
  { setCurrentComponent }
)(MyProfile);
