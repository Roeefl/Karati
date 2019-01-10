import React from 'react';

import { connect } from 'react-redux';
import { selectBookFromBrowsing } from '../../actions';

import BrowseFilter from './BrowseFilter';
import BookCard from './BookCard/BookCard';

import './BrowseContainer.css';

class BrowseContainer extends React.Component {
    state = {  
        filter: false
    }

    selectBook = (bookId) => {
        let currBook = this.props.books.find( book => 
            book.bookID == bookId
        );

        if (!currBook) {
            return;
        }

        this.props.selectBookFromBrowsing(currBook);
    }

    onSelectGenre = (genre) => {
        console.log(genre);

        this.setState({
            filter: (genre.length > 1 ? genre : false)
        })
    }

    render() {
        const books = this.props.books.map( book => {
            // console.log(book);

            let trimmedDesc = book.desc.substring(0, 200);

            let isHidden = (this.state.filter ? 'hidden' : 'shown');
            if (this.state.filter) {
                if (book.genres.includes(this.state.filter)) {
                    isHidden = 'shown';
                }
            }

            return (
                <div className={`book-card-container three wide column ${isHidden}`} key={book.bookID}>
                    <BookCard
                        bookId={book.bookID}
                        src={book.imageURL}
                        desc={trimmedDesc}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        linkTo={'/book/' + book.bookID}
                        selectBook={this.selectBook} />
                        
                    <div>
                        Offered for exchange by {book.ownedBy}
                    </div>
                </div>
            );
        });

        return (
            <div className="browse-container">
                <BrowseFilter onSelectGenre={this.onSelectGenre} />

                <div className="ui container grid">
                    {books}    
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        userData: state.userData,
        books: state.books
    }
};

export default connect(
    mapStateToProps,
    { selectBookFromBrowsing }
)(BrowseContainer);