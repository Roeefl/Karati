import './SearchResults.css';

import React from 'react';

import BookCard from './books/BookCard';

class SearchResults extends React.Component {
    onBookSelect = (bookId) => {
        this.props.onBookSelect(bookId);
    }

    render() {
        console.log(this.props.results);
        const results = this.props.results.map( result => {
            return (
                <div className="book-card-container four wide column" key={result.id._}>
                    <BookCard
                        bookId={result.id._}
                        src={result.image_url}
                        desc={null}
                        title={result.title}
                        author={result.author.name}
                        numOfPages={null}
                        onBookSelect={this.onBookSelect} />
                </div>
            );
        });

        return (
            <div className="search-results ten wide column">
                <div className="ui link cards grid">
                    {results}
                </div>
            </div>
        );
    }
}

export default SearchResults;