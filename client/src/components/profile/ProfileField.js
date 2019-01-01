import React from 'react';

class ProfileField extends React.Component {
    renderError = ( {error, touched} ) => {
        if (touched && error) {
            return (
                <div className="ui small error message">
                    <div className="header">
                        {error}
                    </div>
                </div>
            );
        }
    }

    render() {
        const highlightError = ( (this.props.meta.error && this.props.meta.touched) ? 'error' : '');

        return (
            <div className={`field ${highlightError}`}>
                <label>
                    {this.props.label}
                </label>

                <input {...this.props.input} autoComplete="off" />

                {this.renderError(this.props.meta)}
            </div>
        );
    }
};

export default ProfileField;