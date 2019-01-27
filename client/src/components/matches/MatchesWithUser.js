import React from 'react';
import { connect } from 'react-redux';
import { fetchMyMatches, setCurrentComponent, proposeSwap } from '../../actions';
import BookCard from '../books/BookCard/BookCard';
import Spinner from '../shared/Spinner';
import SwapProposed from './SwapProposed'
import * as iconNames from '../../config/iconNames';

/**
 * Shows all matches with a specific user from the URL param userId
 *
 * @class MatchesWithUser
 * @extends {React.Component}
 */
class MatchesWithUser extends React.Component {
    state = {
        hisPickedBook: null,
        myPickedBook: null
    };

    componentDidMount() {
        this.props.setCurrentComponent({
            primary: `Swap Options`,
            secondary: 'Pick which one of your books you are willing to swap with which one of theirs',
            icon: 'exchange'
        });

        this.props.fetchMyMatches();
    }

    componentWillUnmount() {
        // reset redux proposeSwap and matches for reload from server
        this.props.proposeSwap(null, null, null, null, true);   
    }

    selectBook = (bookId, myBook) => {
        if (myBook) {
            this.setState(
                {
                    myPickedBook: this.props.matchesWithUser.myBooks.find( book => book._id == bookId )
                }
            )
        } else {
            this.setState(
                {
                    hisPickedBook: this.props.matchesWithUser.hisBooks.find( book => book._id == bookId )
                }
            )
        }
    }

    proposeSwap = () => {
        // Will update status to 4 through the server
        this.props.proposeSwap( this.props.userData._id, this.props.matchesWithUser.ownerInfo._id, this.state.hisPickedBook._id, this.state.myPickedBook._id );
    }

    renderSwapButton() {
        if (this.state.hisPickedBook && this.state.myPickedBook) {
            return (
                <div
                    className='ui labeled button violet icon'
                    onClick={this.proposeSwap} >
                    <i className={`${iconNames.MY_PROPOSALS} icon`} />
                    Propose Swap!
                </div>
            )
        }
    }

    renderBookCard = (book, myBook) => {
        // if this book is the one picked from either myBooks or hisBooks - mark it as so so it can be colored
        let currentlyPicked = ( 
            (myBook && this.state.myPickedBook && this.state.myPickedBook._id == book._id) ||
            (!myBook && this.state.hisPickedBook && this.state.hisPickedBook._id == book._id)  
        );

        return (
            <div className='column' key={book._id}>
                <BookCard
                    bookId={book._id}
                    src={book.imageURL}
                    title={book.title}
                    myBook={myBook}
                    pickedClass={currentlyPicked ? 'swap-picked' : ''}
                    selectBook={this.selectBook} />
            </div>
        );
    }

    renderContent() {
        if (this.props.proposedSwap) {
            return (
                <div className="ui container">
                    <SwapProposed
                        myUsername={this.props.userData.username}
                        hisUsername={this.props.matchesWithUser.ownerInfo.username}
                        myBook={this.state.hisPickedBook.title}
                        hisBook={this.state.myPickedBook.title}     
                    />
                </div>
            );
        }

        if ( !this.props.matchesWithUser || Object.keys(this.props.matchesWithUser).length === 0 ) {
            return (
                <Spinner message="Retrieving matches with user..."/>
            );
        };

        const myBooks = this.props.matchesWithUser.myBooks.map( book => this.renderBookCard(book, true) );

        const hisBooks = this.props.matchesWithUser.hisBooks.map( book => this.renderBookCard(book, false) );

        return (
            <div className="ui container">
                {this.renderSwapButton()}

                <div className="ui divider"></div>
                
                <h2 className="ui centered header red">
                    <i className="icon green user"/>
                    Here are your swap options with {this.props.matchesWithUser.ownerInfo.username}
                </h2>

                <div className="ui divider"></div>
                
                <h2 className="ui centered header red">
                    <i className="icon green book"/>
                    {this.props.matchesWithUser.ownerInfo.username}'s books that you marked as interested in:
                </h2>
                <div className="ui link cards four column grid">
                    {hisBooks}
                </div>

                <div className="ui divider"></div>

                <h2 className="ui centered header red">
                    <i className="icon green book"/>
                    Your books that {this.props.matchesWithUser.ownerInfo.username} is interested in:
                </h2>
                <div className="ui link cards four column grid">
                    {myBooks}
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
    // console.log(state);

    return {
        userData: state.userData,
        matchesWithUser: (state.myMatches ?  state.myMatches.find( dataObject =>
            dataObject.ownerInfo._id === ownProps.match.params.userId
        ) : {} ),
        userId: ownProps.match.params.userId,
        proposedSwap: state.proposedSwap
    }
};

export default connect(
    mapStateToProps,
    { fetchMyMatches, setCurrentComponent, proposeSwap }
)(MatchesWithUser);