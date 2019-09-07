import React from 'react';
import { Link } from 'react-router-dom';
import * as icons from '../../config/icons';

class SwapProposed extends React.Component {
  render() {
    return (
      <div className="ui placeholder raised segment">
        <div className="ui segment">
          <Link to="/myProposals">
            <div className="ui huge violet labeled icon button">
              <i className="icon zip white large" />
              My Proposals
            </div>
          </Link>
        </div>

        <h2 className="ui centered header">
          <i className={`${icons.MY_SWIPES} violet icon`} />
          Congrats {this.props.myUsername}! Awesome job. You proposed{' '}
          {this.props.hisUsername} to swap books with each other. Give him some
          time to think about it!
        </h2>

        <h3 className="ui centered header">
          You can view your proposals in your{' '}
          <Link to="/myProposals">My Proposals</Link> section
        </h3>

        <div className="ui divider" />

        <div className="ui two column stackable center aligned grid">
          <div className="ui vertical divider">In Exchange For</div>

          <div className="middle aligned row">
            <div className="column">
              <div className="ui icon header">
                <i className="violet book icon"></i>
                {this.props.myBook}
              </div>
            </div>

            <div className="column">
              <div className="ui icon header">
                <i className="orange book icon"></i>
                {this.props.hisBook}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SwapProposed;
