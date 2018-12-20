import React from 'react';
import { connect } from 'react-redux';
import { selectBookFromDB, resetBookFromDB } from '../../actions';

import BookContent from '../shared/BookContent';
import BookComments from '../shared/BookComments';

class Book extends React.Component {
    componentDidMount() {
        if (this.props.selectedBookFromDB && this.props.bookId && (this.props.bookId !== this.props.selectedBookFromDB._id) ) {
            this.props.resetBookFromDB();
        }

        this.props.selectBookFromDB(this.props.bookId, false);
    }

    render() {
        return (
            <div className="book-container ui container">
                <BookContent book={this.props.selectedBookFromDB} />

                <BookComments book={this.props.selectedBookFromDB} />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    
    return {
        bookId: ownProps.match.params.bookId,
        selectedBookFromDB: state.selectedBookFromDB
    }
};

export default connect(
    mapStateToProps,
    { selectBookFromDB, resetBookFromDB }
)(Book);