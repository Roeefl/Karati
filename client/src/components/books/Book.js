import React from 'react';

import Axios from 'axios';
import { connect } from 'react-redux';
import { selectBookFromDB, resetBookFromDB, fetchUser, setCurrentComponent, selectBookFromBrowsing, updateBooks } from '../../actions';
import { Link } from 'react-router-dom';

import BookContent from '../shared/BookContent';
import BookReviews from '../shared/BookReviews';
import BookReviewByCurrentUser from './BookReviewByCurrentUser';
import ShelfBookActions from '../shelf/ShelfBookActions';
import BookActions from './BookActions';

import Message from '../shared/Message';

class Book extends React.Component {
    state = {
        swiped: false
    }

    componentDidMount() {
        if (this.props.selectedBookFromDB && this.props.bookId && (this.props.bookId !== this.props.selectedBookFromDB._id) ) {
            this.props.resetBookFromDB();
        }

        this.props.selectBookFromDB(this.props.bookId, false);

        this.props.setCurrentComponent({
            primary: 'Book Info',
            secondary: 'Info about a book',
            icon: 'book'
        });
    }

    componentWillUnmount() {
        // SAFETY
        if (this.props.selectedBookFromBrowse && this.props.selectedBookFromBrowse.bookID == this.props.selectedBookFromDB._id) { 
            this.props.selectBookFromBrowsing(null); // reset selected book from swiping in case it's set to something
        }
    }

    refetchBook = () =>{
        this.props.resetBookFromDB();
        this.props.selectBookFromDB(this.props.bookId, false);
    }

    swipeBook = async (liked) => {
        var data = {
            bookID:  this.props.selectedBookFromBrowse.bookID,
            ownerID:  this.props.selectedBookFromBrowse.ownerID,
            myUserID: this.props.userData._id
        };

        try {
            const apiURL = '/api/swipe/' + (liked ? 'liked' : 'rejected');
            let res = await Axios.put(apiURL, data);

            if (res.data.swipeAdded) {
                console.log(res.data);

                this.setState( {
                    swiped: true
                });
            }

            this.props.updateBooks();
            this.props.fetchUser();
        } catch(error) {
            console.log('swipeBook Axios .put failed with error: ');
            console.log(error);
        }
    }

    renderReview() {
        if (!this.props.selectedBookFromDB) {
            return;
        }

        if (!this.props.userData) {
            return;
        }

        return (
            <BookReviewByCurrentUser book={this.props.selectedBookFromDB} user={this.props.userData} refetchBook={this.refetchBook} />
        )
    }

    renderActions() {
        if (!this.props.selectedBookFromDB) {
            return;
        }

        if (!this.props.userData || !this.props.userData.ownedBooks) {
            return;
        }

        console.log(this.props);

        let onShelf = this.props.userData.ownedBooks.find(book =>
            book.bookID == this.props.selectedBookFromDB._id
        );

        if (onShelf) {
            return (
                <ShelfBookActions book={this.props.selectedBookFromDB} user={this.props.userData} onShelf={onShelf} refreshBook={this.props.fetchUser}/>
            );
        }

        if (!this.props.selectedBookFromBrowse) {
            return;
        }

        if (this.props.selectedBookFromBrowse.bookID == this.props.selectedBookFromDB._id) {
            if (this.state.swiped) {
                return (
                    <div className="ui container">
                        <Message 
                            color='green'
                            lines={[
                                'You got it boss!'
                            ]} />
                        <Link to="/books/browse">
                            <div className="ui large violet button">
                                <i className="icon delicious" />
                                Back to Browsing
                            </div>
                        </Link>  
                    </div>
                );
            }

            return (
                <div className="ui center aligned raised segment container">
                    <BookActions swipeBook={this.swipeBook} />
                </div>
            );
        }
    }

    render() {
        return (
            <div className="book-container ui container">
                {this.renderActions()}

                {this.renderReview()}
                
                <BookContent book={this.props.selectedBookFromDB} />

                <BookReviews book={this.props.selectedBookFromDB} />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userData: state.userData,
        books: state.books,
        bookId: ownProps.match.params.bookId,
        selectedBookFromDB: state.selectedBookFromDB,
        selectedBookFromBrowse: state.selectedBookFromBrowse
    }
};

export default connect(
    mapStateToProps,
    { selectBookFromDB, resetBookFromDB, fetchUser, setCurrentComponent, selectBookFromBrowsing, updateBooks }
)(Book);