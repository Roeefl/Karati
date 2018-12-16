import './MyShelf.css';

import React from 'react';

import { connect } from 'react-redux';
import { updateMyShelf } from '../../actions';

import BookCard from '../books/BookCard';

import { Link } from 'react-router-dom'

import Message from '../shared/Message';
import Spinner from '../shared/Spinner';

class MyShelf extends React.Component   {
    componentDidMount() {
        this.props.updateMyShelf();
    }

    renderContent() {
        if (!this.props.myShelf) {
            return (
                <Spinner message="Fetching Your Shelf..."/>
            );
        }

        if (this.props.myShelf.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        `You have not added any books to your shelf yet. Bad user! *System spanks ${ ( this.props.auth ? this.props.auth.username : 'John Doe' ) }*`
                    ]} />
            );
        }

        const shelfBooks = this.props.myShelf.map( book => {
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
            <div className="my-matches-grid ui link cards grid">
                {shelfBooks}
            </div>
        );
    }

    render() {
        return (
            <div className="my-shelf ten wide column">
                <Message
                    color='violet'
                    lines={[
                        `You have ${this.props.myShelf.length || 0} Books on your shelf`
                    ]} />

                <div className="ui placeholder segment">

                    <div className="ui two column stackable center aligned grid">
                        <div className="ui vertical divider">
                            Or
                        </div>
                        <div className="middle aligned row">
                            <div className="column">
                                <div className="ui icon header">
                                    <i className="book icon"></i>
                                    Have more books you wanna add?
                                </div>
                                <div className="field">
                                    <div className="ui search">
                                        <Link to="/myShelf/search" className="search item">
                                            <div className="ui labeled button green icon">
                                                {/* <input className="prompt" type="text" placeholder="Search book database..." /> */}
                                                <i className="search icon"></i>Search
                                            </div>
                                        </Link>
                                        <div className="results"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui icon header">
                                    <i className="plus icon"></i>
                                    Add a book to our database
                                </div>
                                <div className="ui labeled blue icon button disabled">
                                <i className="plus icon"></i>Create custom book
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="my-shelf-grid ui link cards grid">
                    {this.renderContent()}
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        myShelf: state.myBooks
    };
}

export default connect(
    mapStateToProps,
    { updateMyShelf }
)(MyShelf);