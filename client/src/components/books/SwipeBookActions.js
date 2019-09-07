import React from 'react';

class SwipeBookActions extends React.Component {
  likeBook = () => {
    this.props.swipeBook(true);
  };

  rejectBook = () => {
    this.props.swipeBook(false);
  };

  render() {
    return (
      <div className="book-actions">
        <div
          className="ui negative labeled icon button"
          onClick={this.rejectBook}
        >
          <i className="icon thumbs down outline"></i>
          No Thanks
        </div>
        <div
          className="ui positive labeled icon button"
          onClick={this.likeBook}
        >
          <i className="icon heart outline"></i>
          Yep, I want this
        </div>
      </div>
    );
  }
}

export default SwipeBookActions;
