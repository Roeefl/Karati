import React from 'react';
import './CompHeader.css';

const CompHeader = props => {
  const { icon, primary, secondary } = props.header;

  return (
    <div className="comp-header ui center aligned icon header">
      <i className={`${icon} icon`}></i>
      <div className="content">
        {primary}
        <div className="sub header">{secondary}</div>
      </div>
    </div>
  );
};

CompHeader.defaultProps = {
  title: 'קראתי'
};

export default CompHeader;
