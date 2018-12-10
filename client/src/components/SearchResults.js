import './SearchResults.css';

import React from 'react';

import BookCard from './books/BookCard';

class SearchResults extends React.Component {
    onBookSelect = (bookId) => {
        this.props.onBookSelect(bookId);
    }

    render() {
        const results = this.props.results.map( result => {
            return (
                <BookCard key={result.id._} bookId={result.id._} src={result.image_url} alt={result.desc} showInfoButton={true} onBookSelect={this.onBookSelect} />
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