import React from 'react';
import { connect } from 'react-redux';
import { selectBookFromDB, resetBookFromDB, fetchUser, setCurrentComponent } from '../../actions';

import BookContent from '../shared/BookContent';
import BookReviews from '../shared/BookReviews';
import BookReviewByCurrentUser from './BookReviewByCurrentUser';
import ShelfBookActions from '../shelf/ShelfBookActions';

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

    refetchBook = () =>{
        this.props.resetBookFromDB();
        this.props.selectBookFromDB(this.props.bookId, false);
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

        let onShelf = this.props.userData.ownedBooks.find(book =>
            book.bookID == this.props.selectedBookFromDB._id
        );

        if (!onShelf) {
            return;
        }

        return (
            <ShelfBookActions book={this.props.selectedBookFromDB} user={this.props.userData} onShelf={onShelf} refreshBook={this.props.fetchUser}/>
        );
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
    // console.log(state);
    
    return {
        userData: state.userData,
        bookId: ownProps.match.params.bookId,
        selectedBookFromDB: state.selectedBookFromDB
    }
};

export default connect(
    mapStateToProps,
    { selectBookFromDB, resetBookFromDB, fetchUser, setCurrentComponent }
)(Book);