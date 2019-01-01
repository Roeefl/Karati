import { connect } from 'react-redux';

import React from 'react';
import './Message.css';

class Message extends React.Component {
    state ={
        closed: false
    };

    close = () => {
        this.setState({
            closed: true
        });
    }
    
    render() {
        if (this.state.closed) {
            return (
                <div></div>
            );
        }
        
        const lines = this.props.lines.map( line => {
            return (
                <li key={ Math.random().toFixed(8) * 100000000 }>
                    {line}               
                </li>
            );
        });
    
        return (
            <div className={`ui info message ${this.props.color}`}>
                <i className="close icon" onClick={this.close} />
                <div className="header">
                    Hey { ( this.props.userData ? this.props.userData.username : 'John Doe' ) } !  
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
        userData: state.userData
    }
};

export default connect(
    mapStateToProps
)(Message);