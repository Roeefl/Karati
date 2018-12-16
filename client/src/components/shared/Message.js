import { connect } from 'react-redux';

import React from 'react';
import './Message.css';

class Message extends React.Component {
    render() {
        const lines = this.props.lines.map( line => {
            return (
                <li key={ Math.random().toFixed(8) * 100000000 }>
                    {line}               
                </li>
            );
        });
    
        return (
            <div className={`ui info message ${this.props.color}`}>
                <div className="header">
                    Hey { ( this.props.auth ? this.props.auth.username : 'John Doe' ) } !  
                </div>
                <ul className="list">
                    {lines}
                </ul>
            </div>
        );
    }
}

Message.defaultProps = {
    color: 'purple',
    lines: [
        'This is',
        'A message component'
    ]
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(
    mapStateToProps
)(Message);