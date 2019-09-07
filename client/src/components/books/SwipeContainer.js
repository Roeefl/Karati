import React from 'react';

import SwipePreviewBar from './SwipePreviewBar';
import BookCard from './BookCard/BookCard';
import SwipeBookActions from './SwipeBookActions';

class SwipeContainer extends React.Component {
  swipeBook = liked => {
    this.props.swipeBook(liked);
  };

  render() {
    const { books } = this.props;
    const book = books[0];
    // let trimmedDesc = book.desc.substring(0, 140);

    return (
      <div className="ui container">
        <div>Fetched {books.length} Available Matches</div>

        <SwipePreviewBar books={books} />

        <div className="ui center aligned raised segment container">
          <div className="book-card-container">
            <BookCard
              bookId={book.bookID}
              src={book.imageURL}
              title={book.title}
              author={book.author}
              numOfPages={book.numOfPages}
              linkTo={'/book/' + book.bookID}
            />
          </div>

          <div>Offered for exchange by {book.ownedBy}</div>

          <SwipeBookActions swipeBook={this.swipeBook} />
        </div>
      </div>
    );
  }
}

export default SwipeContainer;
