import React, { Component } from 'react';

class ProposalIcon extends Component {
    render() {
        if (this.props.status === 4) {
            return (
                <React.Fragment>
                    <i className="icon hourglass orange outline"/> Pending
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <i className="icon green child"/> Approved
            </React.Fragment>
        );
    }
}

export default ProposalIcon;
