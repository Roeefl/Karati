import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateMyShelf } from '../actions';


class SearchDetails extends React.Component {
    state = {
        addBookComponentType: 1 // Add Button
    }

    // checkIfBookIsOwnedByUser = async () => {
    //     const res = await Axios.post('/api/myBooks/isBookOwnedByUser', { goodreadsID: this.props.selectedBook.id._ } );

    //     if (res.data.isBookOwnedByUser)
    //         this.setState( { addStage: 4 } );
    // }

    componentWillReceiveProps() {
        if (this.state.addBookComponentType !== 1)
            this.setState( { addBookComponentType: 1 } ); // Add Button

        // if (this.state.selectedBook) {
        //     this.checkIfBookIsOwnedByUser();
        // }
    }

    addToMyShelf = async () => {
        this.setState( { addBookComponentType: 2 } ); // Fetching

        try {
            const res = await Axios.post('/api/myShelf', { goodreadsID: this.props.selectedBook.id._ } );
            console.log(res);

            if (res.data.error) {
                this.setState( { addBookComponentType: 1 } ); // Add Button
                return;
            }
            this.setState( { addBookComponentType: (res.data.bookAddedToMyShelf ? 3 : 4) } ); // Successfully added / already own

            if (res.data.bookAddedToMyShelf) {
                this.props.updateMyShelf();
            }
        } catch(error) {
            console.log('/api/myShelf failed with error: ' + error);
        }
    }

    renderMyShelfLink() {
        return (
            <Link to="/myShelf" className="enforce-green">
                <i className="icon list alternate outline" />
                My Shelf
            </Link>
        );
    }

    renderAddButton() {
        if (!this.props.auth) {
            return;
        }

        switch (this.state.addBookComponentType) {
            case 1:
                return (
                    <button
                        className="add-to-my-shelf ui button green"
                        onClick={this.addToMyShelf}>
                        <i className="icon add" />
                        Add to My Shelf
                    </button>
                );
            case 2:
                return (
                    <div className="ui active inline loader"></div>
                );
            case 3:
                return (
                    <div className="ui positive message">
                        <div className="header">
                            Book was saved to your books.
                        </div>
                        <p>Go to  {this.renderMyShelfLink()} to see all your books.</p>
                    </div>
                );
            default:
                return (
                    <div className="ui negative message">
                        <div className="header">
                            You already own this book.
                        </div>
                        <p>Go to {this.renderMyShelfLink()} to see all your books.</p>
                    </div>
                );
        }
    }

    renderContent() {
        if (this.props.selectedBook) {
            return (
                <div className="book-info ui card">
                    <div className="image dimmable">
                        <div className="ui blurring inverted dimmer transition hidden">
                            <div className="content">
                                <div className="center">
                                    <div className="ui teal button">Add Friend</div>
                                </div>
                            </div>
                        </div>
                        <img src={this.props.selectedBook.image_url} alt={this.props.selectedBook.desc} />
                    </div>
                    <div className="content">
                        <div className="header">
                            {this.props.selectedBook.title}
                        </div>
                        <div className="meta">
                            {this.props.selectedBook.author.name}
                        </div>
                        <div className="description">
                            {this.props.selectedBook.description}
                        </div>
                    </div>
                    <div className="extra content">
                        {/* <span className="right floated created">Book</span> */}
                        {this.renderAddButton()}
                    </div>
                </div>  
            );
        }

        return (
            <div className="book-info ui card">

            </div>
        );
    }

    render () {
        return (
            <div className="search-details six wide column">
                {this.renderContent()}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        selectedBook: state.selectedBook
    };
}

export default connect(
    mapStateToProps,
    { updateMyShelf }
)(SearchDetails);