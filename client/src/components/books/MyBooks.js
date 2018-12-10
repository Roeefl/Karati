import Axios from 'axios';

import './MyBooks.css';

import { connect } from 'react-redux';
import { updateMyBooks } from '../../actions';

import React from 'react';

import BookCard from './BookCard';

class MyBooks extends React.Component   {
    fetchMyBooks = async () => {
        const res = await Axios.get('/api/mybooks');

        console.log(res.data);

        if (res.data.error != 30) {
            this.props.updateMyBooks(res.data.myBooks);
        }
    }

    componentDidMount() {
        this.fetchMyBooks();
    }

    render() {
        const results = this.props.myBooks.map( book => {
            console.log(book);
            return (
                <BookCard key={book._id} src={book.imageURL} alt={book.description} onBookSelect={null} showInfoButton={false} />
            );
        });

        return (
            <div className="search-results ten wide column">
                <div className="search-results-count ui segment">
                    You own {this.props.myBooks.length} Books
                </div>
                <div className="search-results-grid ui segment">
                    {results}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        myBooks: state.myBooks
    };
}

export default connect(
    mapStateToProps,
    { updateMyBooks }
)(MyBooks);