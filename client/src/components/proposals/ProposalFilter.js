import React from 'react';

class ProposalFilter extends React.Component {
    onFilterClick = () => {
        this.props.onFilterClick();
    }

    render() {
        return (
            <div className="proposal-filter">

                <h2 className="ui centered header">
                    <i className="red envelope outline icon"></i>
                    Proposal Type
                </h2>
                
                <div className="ui raised segment">
                    <div className="ui blue button">
                        By Me
                    </div>
                    <div className="ui blue button">
                        To Me
                    </div>
                    <div className="ui blue button">
                        All
                    </div>
                </div>

            </div>
        );
    }
}

export default ProposalFilter;
