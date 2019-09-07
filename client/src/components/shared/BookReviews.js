import React from 'react';
import Message from '../shared/Message';
import { formatDate } from '../../common';

class BookReviews extends React.Component {
  render() {
    if (this.props.book === false) {
      return <div></div>;
    }

    if (!this.props.book || !this.props.book.comments) {
      return <Message color="red" lines={['Error in BookReviews Component']} />;
    }

    const comments = this.props.book.comments.map(comment => {
      return (
        <div
          className="book-comment comment"
          key={Math.random().toFixed(8) * 100000000}
        >
          <div className="avatar">
            <img src={comment.portrait} alt="avatar" />
          </div>

          <div className="content">
            <div className="author">{comment.username}</div>
            <div className="metadata">
              <span className="date">{formatDate(comment.dateAdded)}</span>
            </div>
            <div className="text">{comment.content}</div>
            <div className="actions"></div>
          </div>
        </div>
      );
    });

    return (
      <div className="book-comments ui comments">
        <h3 className="ui dividing header">User Reviews </h3>
        {comments}
      </div>
    );
  }
}

export default BookReviews;
