import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class MatchesWithUserCard extends React.Component {
    render() {
        console.log(this.props.data);

        const linkTo = `/myMatches/${this.props.data.ownerInfo._id}`;

        return (
            <Link to={linkTo}>
                <div className="ui fluid card">
                    <div className="image">
                        <img src={this.props.data.ownerInfo.portrait} alt="avatar" />
                    </div>
                    <div className="content">
                        <div className="header">
                        Matches with {this.props.data.ownerInfo.username}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}

function mapStateToProps(state) {
    return {
        myMatches: state.myMatches
    }
};

export default connect(
    mapStateToProps,
)(MatchesWithUserCard);