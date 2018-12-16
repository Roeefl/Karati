import React from 'react';

import { connect } from 'react-redux';

import BookCard from './BookCard';

class BrowseContainer extends React.Component {
    render() {
        const books = this.props.books.map( book => {
            // console.log(book);
            let trimmedDesc = book.desc.substring(0, 200);
            // console.log("key: "  + book.bookID);
            return (
                <div className="book-card-container three wide column" key={book.bookID}>
                    <BookCard
                        bookId={book.bookID}
                        src={book.imageURL}
                        desc={trimmedDesc}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        onBookSelect={null} />
                        
                    <div>
                        Offered for exchange by {book.ownedBy}
                    </div>
                </div>
            );
        });

        return (
            <div className="">
                <div className="ui segment">
                    Fetched {this.props.books.length} Books
                </div>

                <div className="ui container grid">
                    {books}    
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(
    mapStateToProps,
    { }
)(BrowseContainer);