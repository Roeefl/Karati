import Axios from 'axios';

import './SearchBooks.css';

import React from 'react';
import { connect } from 'react-redux';
import { selectBook, updateSearchResults } from '../../actions';

import SearchBar from '../SearchBar';
import SearchResults from '../SearchResults';
import SearchDetails from '../SearchDetails';

import Spinner from '../shared/Spinner';
import Message from '../shared/Message';

const DEFAULT_SEARCH_LIMIT = 8;

class SearchBooks extends React.Component {
    state = {
        ready: true
    };

    // onBookSelect = (bookId) => {
    //     let bookData = this.props.searchResults.find(book => book.id._ === bookId);
    //     this.props.selectBook(bookData);
    // }

    onSearchSubmit = async (term) => {
        try {
            this.setState( { ready: false } );

            const res = await Axios.post('/api/books/search', {
                query: term,
                limit: this.props.limit || DEFAULT_SEARCH_LIMIT
            } );

            console.log(res);

            this.props.updateSearchResults(res.data.books);
            this.setState( { ready: true } );
        } catch(error) {
            console.log('/api/books/search failed with error: ' + error);
        }
    }

    renderContent() {
        console.log(this.props);

        if (!this.props.searchResults && this.state.ready) {
            return (
                <Message 
                    color='violet'
                    lines={[
                        'Search our book database to add books to your personal shelf.'
                    ]} />
            );
        }

        if (this.props.searchResults.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        'Could not find any results for your search. Sorry bro! try another term.'
                    ]} />
            );
        }

        return (
            <div>
                <div className="ui segment">
                    Found {this.props.searchResults.length} Results
                </div>
                <div className="search-container ui container grid">
                    <div className="ui row">
                        <SearchResults
                            results={this.props.searchResults}
                            ready={ (this.state.ready) } />

                        <SearchDetails />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="search-books ui container">
                <SearchBar
                    onSubmit={this.onSearchSubmit} />

                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        searchResults: state.searchResults
    };
}

export default connect(
    mapStateToProps,
    { selectBook, updateSearchResults }
)(SearchBooks);