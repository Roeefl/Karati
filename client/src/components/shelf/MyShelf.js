import './MyShelf.css';
import React from 'react';
import { connect } from 'react-redux';
import { updateMyShelf, fetchUser, setCurrentComponent } from '../../actions';
import BookCard from '../books/BookCard/BookCard';
import { Link } from 'react-router-dom';
import Message from '../shared/Message';
import Spinner from '../shared/Spinner';
import * as iconNames from '../../config/iconNames';

class MyShelf extends React.Component   {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'Your Book Shelf',
            secondary: 'View and update the books that you offer for swap',
            icon: iconNames.MY_SHELF
        });

        this.props.updateMyShelf();
        this.props.fetchUser();
    }

    renderMessage() {
        if (this.props.myShelf.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        `You have not added any books to your shelf yet. Bad user! *System spanks ${ ( this.props.userData ? this.props.userData.username : 'John Doe' ) }*`
                    ]} />
            );
        }

        return (
            <Message
                color='violet'
                lines={[
                    `You have ${this.props.myShelf.length || 0} Books on your shelf`
                ]} />
        );
    }

    renderContent() {
        // console.log(this.props);

        if (this.props.myShelf === false) {
            return (
                <Spinner message="Fetching Your Shelf..."/>
            );
        }

        if (this.props.myShelf.error) {
            return (
                <Message 
                    color='red'
                    lines={[
                        this.props.myShelf.error
                    ]} />
            );
        };

        const shelfBooks = this.props.myShelf.map( book => {
            let trimmedDesc = book.description.substring(0, 200);

            return (
                <div className="book-card-container four wide column" key={book._id}>
                    <BookCard
                        bookId={book._id}
                        src={book.imageURL}
                        desc={trimmedDesc}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        linkTo={'/book/' + book._id} />
                </div>
            );
        });

        return (
            <div>
                {this.renderMessage()}

                <div className="ui placeholder segment">

                    <div className="ui two column stackable center aligned grid">
                        <div className="ui vertical divider">
                            Or
                        </div>
                        <div className="middle aligned row">
                            <div className="column">
                                <div className="ui icon header">
                                    <i className={`${iconNames.BOOK} icon`} />
                                    Have more books you wanna add?
                                </div>
                                <div className="field">
                                    <div className="ui search">
                                        <Link to="/myShelf/search" className="search item">
                                            <div className="ui labeled button green icon">
                                                <i className={`${iconNames.SEARCH} icon`} /> Search
                                            </div>
                                        </Link>
                                        <div className="results"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui icon header">
                                    <i className={`${iconNames.ADD} icon`} />
                                    Add a book to our database
                                </div>
                                <div className="ui labeled blue icon button disabled">
                                <i className={`${iconNames.ADD} icon`} /> Create custom book
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="my-shelf-grid ui link cards grid">
                    {shelfBooks}
                </div>

            </div>
        );
    }

    render() {
        return (
            <div className="my-shelf ui container">
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        myShelf: state.myBooks
    };
}

export default connect(
    mapStateToProps,
    { updateMyShelf, fetchUser, setCurrentComponent }
)(MyShelf);