import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import formFields from './formFields';
import { submitProfileForm } from '../../actions';

import Spinner from '../shared/Spinner';

class ProfileFormReview extends React.Component {
  state = {
    submitting: false
  };

  submitForm = () => {
    this.setState({
      submitting: true
    });

    this.props.submitProfileForm(this.props.formValues, this.props.history);
  };

  componentWillUpdate() {
    if (this.state.submitting) {
      this.setState({
        submitting: false
      });
    }
  }

  render() {
    if (this.state.submitting) {
      return <Spinner message="Updating your info..." />;
    }

    const reviewFields = formFields.map(field => {
      return (
        <div key={field.name}>
          <div className="header">{field.label}</div>
          <div className="content">{this.props.formValues[field.name]}</div>
        </div>
      );
    });

    return (
      <div>
        <h3>Please review your changes</h3>

        {reviewFields}

        <button className="ui red button" onClick={this.props.cancelReview}>
          Go Back
        </button>

        <button className="ui primary button" onClick={this.submitForm}>
          Update my Info
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);

  return {
    formValues: state.form.profileForm.values
  };
}

export default connect(
  mapStateToProps,
  { submitProfileForm }
)(withRouter(ProfileFormReview));
