import React from 'react';
import './CompHeader.css';

const CompHeader = (props) => {
    // console.log(props);

    return (
        <div className="comp-header ui center aligned icon header">
            <i className={`${props.header.icon} icon`}></i>
            <div className="content">
                {props.header.primary}
                <div className="sub header">
                    {props.header.secondary}
                </div>
            </div>
        </div>
    );
}

CompHeader.defaultProps = {
    title: 'קראתי'
}

export default CompHeader;