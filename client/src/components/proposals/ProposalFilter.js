import React from 'react';

class ProposalFilter extends React.Component {
  onFilterClick = () => {
    this.props.onFilterClick();
  };

  render() {
    return (
      <div className="proposal-filter">
        <h4 className="ui header">
          <i className="orange filter tiny icon"></i>
          Proposal Type
        </h4>

        <div className="ui raised segment">
          <div className="ui blue button">By Me</div>
          <div className="ui blue button">To Me</div>
          <div className="ui blue button">All</div>
        </div>
      </div>
    );
  }
}

export default ProposalFilter;
