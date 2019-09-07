import React from 'react';
import './rotateplane.css';
import './Spinner.css';

const Spinner = props => {
  return (
    <div className="ui active dimmer">
      <figure className="karati-loader">
        <i className="green book icon" />
      </figure>
    </div>
  );
};

Spinner.defaultProps = {
  message: 'Loading Karati...'
};

export default Spinner;

// {/* <div className="ui big text loader"> */}
//     {/* {props.message} */}
// {/* </div> */}
