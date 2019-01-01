import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class MatchesWithUserCard extends React.Component {
    render() {
        console.log(this.props.data);

        const imageURL = 'https://semantic-ui.com/images/avatar/large/elliot.jpg';
        const linkTo = `/myMatches/${this.props.data.ownerInfo._id}`;

        return (
            <Link to={linkTo}>
                <div className="ui fluid card">
                    <div className="image">
                        {/* <Link to={linkTo}> */}
                            <img src={imageURL} alt="avatar" />
                        {/* </Link> */}
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