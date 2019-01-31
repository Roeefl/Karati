import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser, setCurrentComponent } from '../../actions';
import Spinner from '../shared/Spinner';
import Message from '../shared/Message';
import BookCard from '../books/BookCard/BookCard';
import * as icons from '../../config/icons';

class MyWishlist extends Component {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'Your Wishlist',
            secondary: 'View your wishlist and stuff',
            icon: icons.WISHLIST
        });

        this.props.fetchUser();
    }

    renderWishlist() {
        if (this.props.wishlist === false) {
            return (
                <Spinner message="Fetching Your Wishlist..."/>
            );
        }

        if (this.props.wishlist.error) {
            return (
                <Message 
                    color='red'
                    lines={[
                        this.props.wishlist.error
                    ]} />
            );
        };

        const wishlistBooks = this.props.wishlist.map( book => {
            return (
                <div className="book-card-container four wide column" key={book._id}>
                    <BookCard
                        bookId={book._id}
                        src={book.imageURL}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        linkTo={'/book/' + book._id} />
                </div>
            );
        });

        return (
            <div className="my-shelf-grid ui link cards grid">
                Wishlist: 
                {wishlistBooks}
            </div>
        )
    }
    
    render() {
        return (
            <div className="my-wishlist ui container">
                {this.renderWishlist()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wishlist: (state.userData ? state.userData.wishlist : false)
    };
}

export default connect(
    mapStateToProps,
    { fetchUser, setCurrentComponent }
)(MyWishlist);