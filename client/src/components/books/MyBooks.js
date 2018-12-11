import Axios from 'axios';

import './MyBooks.css';

import React from 'react';

import { connect } from 'react-redux';
import { updateMyBooks } from '../../actions';

import BookCard from './BookCard';

class MyBooks extends React.Component   {
    fetchMyBooks = async () => {
        try {
            const res = await Axios.get('/api/myBooks');
            console.log(res.data);

            if (res.data.error !== 30) {
                this.props.updateMyBooks(res.data.myBooks);
            }
        } catch(error) {
            console.log('/api/myBooks failed with error: ' + error);
        }
    }

    componentDidMount() {
        this.fetchMyBooks();
    }

    render() {
        const results = this.props.myBooks.map( book => {
            let trimmedDesc = book.description.substring(0, 200);
            return (
                <div className="book-card-container three wide column" key={book._id}>
                    <BookCard
                        bookId={book._id}
                        src={book.imageURL}
                        desc={trimmedDesc}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        onBookSelect={null} />
                </div>
            );
        });

        return (
            <div className="my-books ten wide column">
                <div className="my-books-count ui segment">
                    You own {this.props.myBooks.length} Books
                </div>
                <div className="my-books-grid ui link cards grid">
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