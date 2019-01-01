import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import ProfileField from './ProfileField';
import Message from '../shared/Message';

import formFields from './formFields';

class ProfileForm extends React.Component {
    renderInput = ( { input, label, meta } ) => {
        return (
            <ProfileField input={input} label={label} meta={meta} />
        )
    }

    renderFields() {
        const fields = formFields.map( field => {
            return (
                <Field 
                    key={field.name}
                    type="text"
                    component={this.renderInput} 
                    name={field.name}
                    label={field.label} />
            );
        });

        return (
            <div>
                {fields}
            </div>
        );
    }
    render() {
        return (
            <div className="ui container">
                <Message
                    color='orange'
                    lines={[
                        'Tell us about yourself'
                    ]} />

                <div className="ui centered grid">
                    <div className="ui six wide column">

                        <form
                            className="ui form error"
                            onSubmit={this.props.handleSubmit( this.props.showReview) } >
                            {this.renderFields()}

                            <button className="ui red button" onClick={this.props.cancelForm}>
                                Another Time
                            </button>
  
                            <button
                                type="submit"
                                className="ui green button">
                                Next
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
}

const validate = (formValues) => {
    const errors = {};

    for (let field of formFields) {
        if (!formValues[field.name]) {
            errors[field.name] = field.error || 'Please enter a value';
        }
    }

    return errors;
}

// export default reduxForm({
//     form: 'profileForm',
//     validate: validate,
//     destroyOnUnmount: false 
// })(ProfileForm);



 // pull initial values from account reducer
function mapStateToProps(state) {
    return {
        initialValues: {
            username: state.userData.username,
            first: state.userData.fullName.first,
            last: state.userData.fullName.last,
            bio: state.userData.bio
        }
    }
};

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
ProfileForm = reduxForm({
    form: 'profileForm' // a unique identifier for this form
})(ProfileForm);
  
// You have to connect() to any reducers that you wish to connect to yourself
ProfileForm = connect(
    mapStateToProps
)(ProfileForm);
  
export default ProfileForm;