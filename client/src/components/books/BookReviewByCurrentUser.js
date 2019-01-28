import Axios from 'axios';
import React from 'react';
import Message from '../shared/Message';
import * as iconNames from '../../config/iconNames';

class BookReviewByCurrentUser extends React.Component {
    state = {
        myReview: '',
    };

    closeSelf = () => {
        this.props.refetchBook();
    }

    postReview = async () => {
        const res = await Axios.post('/api/review', {
            bookID: this.props.book._id,
            review: this.state.myReview
        } );

        if (res.data.saved) {
            this.closeSelf();
        }
    }

    updateMyReview = (event) => {
        this.setState( {
            myReview: event.target.value
        } );
    }

    renderContent() {
        if (!this.props.user) {
            return;
        }

        if (!this.props.book) {
            return;
        }

        if (!this.props.user.ownedBooks) {
            return;
        }
        
        let isInMyShelf = this.props.user.ownedBooks.find( book =>
            book.bookID === this.props.book._id
        );

        if (!isInMyShelf) {
            return;
        }

        let hasBeenReviewedAlready = this.props.book.comments.find(
            comment => comment.userID === this.props.user._id
        );

        if (hasBeenReviewedAlready) {
            return;
        }

        return (
            <div className="write-book-review ui raised segment">
                <Message 
                    color='violet'
                    lines={[
                        'Leave a short personal insight on this book for others'
                    ]} />
                
                <div className="ui action input">
                    <input
                        type="text"
                        placeholder="Your Review..."
                        value={ this.state.myReview }
                        onChange={ this.updateMyReview } />
                        <button 
                            className="ui green right labeled icon button"
                            onClick={this.postReview} >
                            <i className={`${iconNames.SEND} icon`} />
                            Done
                        </button>
                </div>  
            </div>
        )
    }

    render() {
        return (
            <div className="my-review">
                {this.renderContent()}
            </div>
        );
    }
}

export default BookReviewByCurrentUser;