import React from 'react';

import SwipePreviewBar from './SwipePreviewBar';
import BookCard from './BookCard/BookCard';

class SwipeContainer extends React.Component {
    likeBook = () => {
        this.props.swipeBook(true);
    }

    rejectBook = () => {
        this.props.swipeBook(false);
    }

    render() {
        let book = this.props.books[0];
        let trimmedDesc = book.desc.substring(0, 140);

        return (
            <div className="ui container">
                <div>
                    Fetched {this.props.books.length} Available Matches
                </div>

                <SwipePreviewBar books={this.props.books} />

                <div className="book-card-container">
                    <BookCard
                        bookId={book.bookID}
                        src={book.imageURL}
                        desc={trimmedDesc}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        linkTo={'/book/' + book.bookID} />
                </div>

                <div>
                    Offered for exchange by {book.ownedBy}
                </div>

                <div className="actions">
                    <div
                        className="ui negative labeled icon button"
                        onClick={this.rejectBook} >
                        <i className="icon thumbs down outline"></i>
                        No Thanks
                    </div>
                    <div
                        className="ui positive labeled icon button"
                        onClick={this.likeBook} >
                        <i className="icon heart outline"></i>
                        Yep, I want this
                    </div>
                </div>
            </div>
        );
    }
}

export default SwipeContainer;