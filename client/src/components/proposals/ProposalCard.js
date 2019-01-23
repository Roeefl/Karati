import React from 'react';
import { Link } from 'react-router-dom';

class ProposalCard extends React.Component {
    renderTitle() {
        if (this.props.proposal.proposedByMe) {
            return (
                <div>You proposed this swap to {this.props.proposal.owner}</div>
            );
        }
        return (
            <div>{this.props.proposal.owner} proposed this swap to you</div>
        )
    }

    renderDetails() {
        if (this.props.proposal.proposedByMe) {
            return (
                <div>You offered {this.props.proposal.myBook} in exchange for {this.props.proposal.hisBook}</div>
            );
        }
        return (
            <div>He offered {this.props.proposal.hisBook} in exchange for {this.props.proposal.myBook}</div>
        );
    }

    render() {
        // let linkTo = ('/book/' + this.props.swipe.book._id);

        return (
            // <Link to={linkTo} className="swipe-card item">
            <div className="proposal-card item">

                <div className="ui image">
                    No_Image
                </div>

                <div className="middle aligned content">
                    <div className="header">
                        {this.renderTitle()}
                    </div>
                    <div className="description">
                        {this.renderDetails()}
                    </div>

                    <div className="extra">
                        <div className={`ui right floated icon`}>
                            <i className={`icon outline huge thumbs`} />
                        </div>
                        <span>
                            Proposal made on: {this.props.proposal.lastStatusDate || 'NO_DATE'}
                        </span>
                    </div>
                
                </div>
            </div>

            // </Link>
        );
    }
}

export default ProposalCard;
