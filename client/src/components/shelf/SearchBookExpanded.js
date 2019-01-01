import React from 'react';
import { connect } from 'react-redux';
import { retrieveBookFromGoodreads, resetBookFromGoodreads } from '../../actions';

import BookContent from '../shared/BookContent';
import SearchResultBookActions from './SearchResultBookActions';

class SearchBookExpanded extends React.Component {
    componentDidMount() {
        if (this.props.selectedBookFromSearch && this.props.goodreadsID && (this.props.goodreadsID !== this.props.selectedBookFromSearch.goodreadsID) ) {
            this.props.resetBookFromGoodreads();
        }

        this.props.retrieveBookFromGoodreads(this.props.goodreadsID, true);
    }

    render() {
        return (
            <div className="book-container ui container">
                <SearchResultBookActions />
                
                <BookContent book={this.props.selectedBookFromSearch} />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    console.log(ownProps.match.params.bookId);
    console.log(state);

    return {
        goodreadsID: ownProps.match.params.bookId,
        selectedBookFromSearch: state.selectedBookFromSearch
    }
};

export default connect(
    mapStateToProps,
    { retrieveBookFromGoodreads, resetBookFromGoodreads }
)(SearchBookExpanded);