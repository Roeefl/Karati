import './SearchResults.css';

import React from 'react';

import BookCard from './books/BookCard';

class SearchResults extends React.Component {
    onBookSelect = (bookData) => {
        this.props.onBookSelect(bookData);
    }

    render() {
        const results = this.props.results.map( result => {
            return (
                <BookCard key={result.id._} data={result} onBookSelect={this.onBookSelect} />
            );
        });

        return (
            <div className="search-results ten wide column">
                <div className="search-results-grid ui segment">
                    {results}
                </div>
            </div>
        );
    }
}

export default SearchResults;