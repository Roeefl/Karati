import React from 'react';
import { connect } from 'react-redux';
import { fetchMyMatches, setCurrentComponent } from '../../actions';
import BookCard from '../books/BookCard/BookCard';
import Spinner from '../shared/Spinner';

class MatchesWithUser extends React.Component {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: `Swap Options`,
            secondary: 'Pick which one of your books you are willing to swap with which one of theirs',
            icon: 'exchange'
        });

        this.props.fetchMyMatches();
    }

    renderBookCard = (book) => {
        let trimmedDesc = book.description.substring(0, 200);
        
        return (
            <div className="column" key={book._id}>
                <BookCard
                    bookId={book._id}
                    src={book.imageURL}
                    desc={trimmedDesc}
                    title={book.title}
                    author={book.author}
                    numOfPages={book.numOfPages} />
            </div>
        );
    }

    renderContent() {
        console.log(this.props);

        if ( !this.props.matchesWithUser || Object.keys(this.props.matchesWithUser).length === 0 ) {
            return (
                <Spinner message="Retrieving matches with user..."/>
            );
        };

        const myBooks = this.props.matchesWithUser.myBooks.map( book => this.renderBookCard(book) );

        const hisBooks = this.props.matchesWithUser.hisBooks.map( book => this.renderBookCard(book) );

        return (
            <div className="ui container">
                <h2 className="ui centered header red">
                    <i className="icon green user"/>
                    Here are your swap options with {this.props.matchesWithUser.ownerInfo.username}
                </h2>

                <h2 className="ui centered header red">
                    <i className="icon green book"/>
                    Your books that {this.props.matchesWithUser.ownerInfo.username} is interested in:
                </h2>
                <div className="ui link cards six column grid">
                    {myBooks}
                </div>

                <h2 className="ui centered header red">
                    <i className="icon green book"/>
                    {this.props.matchesWithUser.ownerInfo.username}'s books that you marked as interested in:
                </h2>
                <div className="ui link cards six column grid">
                    {hisBooks}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="matches-with-user">
                {this.renderContent()}
            </div>
        );
    }
}

function mapStateToProps(state ,ownProps) {
    console.log(state);

    return {
        matchesWithUser: (state.myMatches ?  state.myMatches.find( dataObject =>
            dataObject.ownerInfo._id === ownProps.match.params.userId
        ) : {} ),
        userId: ownProps.match.params.userId,
    }
};

export default connect(
    mapStateToProps,
    { fetchMyMatches, setCurrentComponent }
)(MatchesWithUser);