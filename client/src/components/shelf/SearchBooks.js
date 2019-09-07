import './SearchBooks.css';

import React from 'react';
import { connect } from 'react-redux';
import { searchGoodreads, setCurrentComponent } from '../../actions';

import SearchBar from '../search/SearchBar';
import SearchResults from '../search/SearchResults';

import Message from '../shared/Message';

class SearchBooks extends React.Component {
  componentDidMount() {
    this.props.setCurrentComponent({
      primary: 'Search Books',
      secondary: 'Search for books in our database to add to your shelf',
      icon: 'search'
    });
  }

  onSearchSubmit = term => {
    this.props.searchGoodreads(term, this.props.intro);
  };

  renderContent() {
    if (this.props.searchResults === false) {
      if (this.props.intro) return;

      return (
        <Message
          color="violet"
          lines={[
            'Search our book database to add books to your personal shelf.'
          ]}
        />
      );
    }

    if (this.props.searchResults && this.props.searchResults.length <= 0) {
      return (
        <Message
          color="red"
          lines={[
            'Could not find any results for your search. Sorry bro! try another term.'
          ]}
        />
      );
    }

    return (
      <div>
        <div className="search-container ui container">
          <SearchResults
            intro={this.props.intro}
            results={this.props.searchResults}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="search-books ui container">
        <SearchBar onSubmit={this.onSearchSubmit} />

        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchResults: state.searchResults
  };
};

export default connect(
  mapStateToProps,
  { searchGoodreads, setCurrentComponent }
)(SearchBooks);
