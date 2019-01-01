import React from 'react';
import { reduxForm } from 'redux-form';

import ProfileForm from './ProfileForm';
import ProfileFormReview from './ProfileFormReview';

class ProfileFormContainer extends React.Component {
    state = {
        step: 0
    };

    cancelForm = () => {
        this.setState( {
            step: 0
        });
    }

    showForm = () => {
        this.setState( {
            step: 1
        });
    }

    showReview = () => {
        this.setState( {
            step: 2
        });
    }

    renderForm() {
        if (this.state.step === 0) {
            return (
                <div className="ui violet primary button" onClick={this.showForm}>
                    Customize my Profile
                </div>
            );
        }

        if (this.state.step === 1) {
            return (
                <ProfileForm cancelForm={this.cancelForm} showReview={this.showReview} />
            )
        }

        return (
            <ProfileFormReview cancelReview={this.showForm}/>
        )
    }

    render() {
        return (
            <div className="ui raised">
                {this.renderForm()}
            </div>
        );
    }
}

export default reduxForm({
    form: 'profileForm'
})(ProfileFormContainer);