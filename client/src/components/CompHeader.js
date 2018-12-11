import React from 'react';

const CompHeader = (props) => {
    return (
        <div className="ui text container">
            <h1 className="ui inverted header">
                {props.primary}
            </h1>
            <h2>
                {props.secondary}
            </h2>
        </div>
    );
}

CompHeader.defaultProps = {
    primary: 'Karati',
    secondary: 'Uniting People through Reading'
}

export default CompHeader;