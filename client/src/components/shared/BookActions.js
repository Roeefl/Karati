import React from 'react';

import './BookActions.css';

import Axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { updateMyShelf } from '../../actions';


class BookActions extends React.Component {
    state = {
        addBookComponentType: 1 // Add Button
    }

    componentWillReceiveProps() {
        if (this.state.addBookComponentType !== 1)
            this.setState( { addBookComponentType: 1 } );
    }

    addToMyShelf = async () => {
        this.setState( { addBookComponentType: 2 } ); // Fetching

        try {
            const res = await Axios.post('/api/myShelf', { goodreadsID: this.props.selectedBookFromSearch.goodreadsID } );
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
            console.log('POST /api/myShelf/:id failed with error: ' + error);
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
                        className="add-to-my-shelf ui large button green"
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
                        <p>Go to {this.renderMyShelfLink()} to see all your books.</p>
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

    render() {
        return (
            <div className="book-actions ui centered grid">
                <div className="ui center aligned six wide column">
                    <div className="middle aligned content">
                        {this.renderAddButton()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        selectedBookFromSearch: state.selectedBookFromSearch
    };
}

export default connect(
    mapStateToProps,
    { updateMyShelf }
)(BookActions);