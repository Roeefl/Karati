import React from 'react';
import SearchResultBookActions from '../shelf/SearchResultBookActions';
import BookCard from '../books/BookCard/BookCard';
import Spinner from '../shared/Spinner';

class SearchResults extends React.Component {
    renderQuickAdd(goodreadsID) {
        if (!this.props.intro)
            return;

        return (
            <SearchResultBookActions quickAddGoodreadsID={goodreadsID}/>
        );
    }

    renderContent() {
        // console.log(this.props);

        if (!this.props.ready) {
            // return (
            //     <div className="ui segment retrieving-books">
            //         <div className="ui huge indeterminate text active loader">
            //             Retrieving Books...
            //         </div> 
            //     </div>
            // );
            return (
                <Spinner message='Retrieving Search Results' />
            )
        };

        const results = this.props.results.map( result => {
            const linkTo = (this.props.intro ? '' : ('/myShelf/search/book/' + result.id._));

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
                        linkTo={linkTo} />
                </div>
            );
        });

        return (
            <div className="ui link cards five column grid">
                {results}
            </div>
        );
    }

    render() {
        // console.log(this.props.results);
        return (
            <div className="search-results">
                {this.renderContent()}
            </div>
        );
    }
}

export default SearchResults;