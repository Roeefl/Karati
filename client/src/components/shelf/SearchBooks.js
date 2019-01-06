import Axios from 'axios';

import './SearchBooks.css';

import React from 'react';
import { connect } from 'react-redux';
import { selectBookFromBrowsing, updateSearchResults, setCurrentComponent } from '../../actions';

import SearchBar from '../search/SearchBar';
import SearchResults from '../search/SearchResults';

import Message from '../shared/Message';

const DEFAULT_SEARCH_LIMIT = 10;

class SearchBooks extends React.Component {
    state = {
        ready: true
    };

    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'Search Books',
            secondary: 'Search for books in our database to add to your shelf',
            icon: 'search'
        });
    }

    // onBookSelect = (bookId) => {
    //     let bookData = this.props.searchResults.find(book => book.id._ === bookId);
    //     this.props.selectBookFromBrowsing(bookData);
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
                <div className="search-container ui container">
                        <SearchResults
                            results={this.props.searchResults}
                            ready={ (this.state.ready) } />
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
    { selectBookFromBrowsing, updateSearchResults, setCurrentComponent }
)(SearchBooks);