import React from 'react';
import SearchResultBookActions from '../shelf/SearchResultBookActions';
import BookCard from '../books/BookCard';
import Spinner from '../shared/Spinner';

class SearchResults extends React.Component {
  renderQuickAdd(goodreadsID) {
    if (!this.props.intro) return;

    return <SearchResultBookActions quickAddGoodreadsID={goodreadsID} />;
  }

  renderContent() {
    if (!this.props.results) {
      return <Spinner message="Retrieving Search Results" />;
    }

    const results = this.props.results.map(result => {
      const linkTo = this.props.intro
        ? ''
        : '/myShelf/search/book/' + result.id._;

      return (
        <div className="book-card-container column" key={result.id._}>
          {this.renderQuickAdd(result.id._)}

          <div className="ui divider"></div>

          <BookCard
            bookId={result.id._}
            src={result.image_url}
            desc={null}
            title={result.title}
            author={result.author.name}
            numOfPages={null}
            linkTo={linkTo}
          />
        </div>
      );
    });

    return <div className="ui link cards five column grid">{results}</div>;
  }

  render() {
    return <div className="search-results">{this.renderContent()}</div>;
  }
}

export default SearchResults;
