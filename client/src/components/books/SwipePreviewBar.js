import React from 'react';
import './SwipePreviewBar.css';

class SwipePreviewBar extends React.Component {
  render() {
    const images = this.props.books.slice(0, 8).map((currBook, index) => {
      const isFirst = index === 0 ? 'first-img' : '';

      return (
        <div className="swipe-preview-image column" key={currBook.bookID}>
          <img
            className={`ui circular image ${isFirst}`}
            src={currBook.imageURL}
            alt={currBook.desc}
          />
        </div>
      );
    });

    return (
      <div className="swipe-preview-bar ui segment container relaxed grid">
        <div className="eight column row">{images}</div>
      </div>
    );
  }
}

export default SwipePreviewBar;
