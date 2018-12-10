import Axios from 'axios';

import './BookSearch.css';

import React from 'react';
import { connect } from 'react-redux';
import { selectBook, updateSearchResults } from '../../actions';

import SearchBar from '../SearchBar';
import SearchResults from '../SearchResults';
import SearchDetails from '../SearchDetails';
import Spinner from '../Spinner';

class BookSearch extends React.Component {
    state = {
        ready: true
    };

    onBookSelect = (bookId) => {
        let bookData = this.props.searchResults.find(book => book.id._ === bookId);
        this.props.selectBook(bookData);
    }

    onSearchSubmit = async (term) => {
        this.setState({ ready: false });

        const response = await Axios.post('/api/books/search', { query: term } );
        
        console.log(response);
        this.props.updateSearchResults(response.data.books);
        this.setState({ ready: true });
    }

    renderContent() {
        if (this.state.ready) {
            return (
                <div>
                    <div className="ui segment">
                        Found {this.props.searchResults.length} Results
                    </div>
                    <div className="search-container ui container grid">
                        <div className="ui row">
                            <SearchResults results={this.props.searchResults} onBookSelect={this.onBookSelect} />

                            <SearchDetails />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Spinner message="Fetching Books..."/>
        );
    }

    render() {
        return (
            <div>
                <SearchBar onSubmit={this.onSearchSubmit} />

                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);

    return {
        searchResults: state.searchResults
    };
}

export default connect(
    mapStateToProps,
    { selectBook, updateSearchResults }
)(BookSearch);