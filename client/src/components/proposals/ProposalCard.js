import React from 'react';
import './ProposalCard.css';
import ProposalIcon from './ProposalIcon';
import { Link } from 'react-router-dom';

class ProposalCard extends React.Component {
    onAccept = () => {
        this.props.onAccept(this.props.proposal);
    }

    renderAccept() {
        if (!this.props.proposal.proposedByMe && this.props.proposal.status === 4) {
            return (
                <div
                    className="ui huge orange labeled icon button"
                    onClick={this.onAccept}>
                    <i className="icon thumbs up outline white large" />
                    Accept Proposal
                </div>
            );
        }
    }

    renderTitle() {
        // if (this.props.proposal.proposedByMe) {
        //     return (
        //         <div>You proposed this swap to {this.props.proposal.owner}</div>
        //     );
        // }
        // return (
        //     <div>{this.props.proposal.owner} proposed this swap to you</div>
        // )
        return(
            <div>
                {this.props.proposal.hisBook}
            </div>
        );
    }

    renderDetails() {
        // if (this.props.proposal.proposedByMe) {
        //     return (
        //         <div>You offered {this.props.proposal.myBook} in exchange for {this.props.proposal.hisBook}</div>
        //     );
        // }
        // return (
        //     <div>He offered {this.props.proposal.hisBook} in exchange for {this.props.proposal.myBook}</div>
        // );

        return (
            <div>
                {this.props.proposal.owner}
            </div>
        );
    }

    onCardClick = () => {
        this.props.onCardClick(this.props.proposal);
    }

    render() {
        return (
            <div className="proposal-card ui card" onClick={this.onCardClick}>

                {/* <div className="ui approve">
                    {this.renderAccept()}
                </div> */}

                <div className="content">
                    <div className="center aligned header">
                        {this.renderTitle()}
                    </div>
                    <div className="center aligned description">
                        {this.renderDetails()}
                    </div>

                    {/* <div className="extra"> */}
                        {/* <div className={`ui right floated icon`}>
                            Status: {this.props.proposal.status}
                        </div> */}
                        {/* <span>
                            Proposal made on: {this.props.proposal.lastStatusDate || 'NO_DATE'}
                        </span> */}
                    {/* </div> */}
                </div>

                <div className="extra content">
                    <div className="center aligned author">
                        <ProposalIcon status={this.props.proposal.status} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ProposalCard;
