import React from 'react';

import { connect } from 'react-redux';
import { swipeBook, selectBookFromDB, resetBookFromDB, fetchUser, setCurrentComponent, selectBookFromBrowsing } from '../../actions';
import { Link } from 'react-router-dom';

import BookContent from '../shared/BookContent';
import BookReviews from '../shared/BookReviews';
import BookReviewByCurrentUser from './BookReviewByCurrentUser';
import ShelfBookActions from '../shelf/ShelfBookActions';
import BookActions from './BookActions';

import Message from '../shared/Message';
import * as iconNames from '../../config/iconNames';

class Book extends React.Component {
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
        if (this.props.selectedBookFromBrowse && this.props.selectedBookFromBrowse.bookID === this.props.selectedBookFromDB._id) { 
            this.props.selectBookFromBrowsing(null); // reset selected book from swiping in case it's set to something
        }
    }

    swipeBook = (liked) => {
        this.props.swipeBook(liked, this.props.selectedBookFromBrowse.bookID, this.props.selectedBookFromBrowse.ownerID, this.props.userData._id);
    }

    renderReview() {
        if (!this.props.selectedBookFromDB) {
            return;
        }

        if (!this.props.userData) {
            return;
        }

        return (
            <BookReviewByCurrentUser book={this.props.selectedBookFromDB} user={this.props.userData} />
        )
    }

    renderActions() {
        if (!this.props.selectedBookFromDB) {
            return;
        }

        if (!this.props.userData || !this.props.userData.ownedBooks) {
            return;
        }

        const onShelf = this.props.userData.ownedBooks.find(book =>
            book.bookID === this.props.selectedBookFromDB._id
        );

        if (onShelf) {
            return (
                <ShelfBookActions book={this.props.selectedBookFromDB} user={this.props.userData} onShelf={onShelf} refreshBook={this.props.fetchUser}/>
            );
        }

        if (!this.props.selectedBookFromBrowse) {
            return;
        }

        if (this.props.selectedBookFromBrowse.bookID === this.props.selectedBookFromDB._id) {
            if (this.props.userData.swipes.find( swipe => swipe.bookID === this.props.selectedBookFromBrowse.bookID )) {
                return (
                    <div className="ui container">
                        <Message 
                            color='green'
                            lines={[
                                'You got it boss!'
                            ]} />
                        <Link to="/books/browse">
                            <div className="ui large violet button">
                                <i className={`${iconNames.BROWSE} icon`} />
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

    renderAllReviews() {
        // if (this.props.showReviews) {
            return (
                <BookReviews book={this.props.selectedBookFromDB} />
            );
        // }
    }

    render() {
        return (
            <div className="book-container ui container">
                {this.renderActions()}

                {this.renderReview()}
                
                <BookContent book={this.props.selectedBookFromDB} showReviews={false} />

                {this.renderAllReviews()}
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
    { swipeBook, selectBookFromDB, resetBookFromDB, fetchUser, setCurrentComponent, selectBookFromBrowsing }
)(Book);