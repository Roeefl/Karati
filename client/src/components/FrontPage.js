import React from 'react';

import { connect } from 'react-redux'   ;
import { updateRecentlyAdded } from '../actions';

import Message from './shared/Message';
import Spinner from './shared/Spinner';

import BookCard from './books/BookCard';

import logo from '../icons/karati-50.png';

class FrontPage extends React.Component {
    componentDidMount() {
        // if (this.props.auth && !this.props.auth.passedIntro) {
        // }

        this.props.updateRecentlyAdded();
    }

    renderContent() {
        if (!this.props.recentlyAdded) {
            return (
                <Spinner message="Fetching Recently Added Books..."/>
            );
        }

        if (this.props.recentlyAdded.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        'No recently added books found in the system. Odd.'
                    ]} />
            );
        }

        const recentlyAdded = this.props.recentlyAdded.map( book => {
            return (
                <div className="book-card-container two wide column" key={book._id}>
                    <BookCard
                        bookId={book._id}
                        src={book.imageURL}
                        desc={''}
                        title={book.title}
                        author={book.author}
                        numOfPages={book.numOfPages}
                        linkTo={'/book/' + book._id} />
                </div>
            );
        });

        return (
            <div className="my-matches-grid ui link cards grid">
                {recentlyAdded}
            </div>
        );
    }

    render() {
        return (
            <div className="front-page ui container">

                <div className="ui vertical stripe segment">
                    <div className="ui middle aligned stackable grid container">
                        <div className="row">
                            <div className="ten wide column">
                            <img src={logo} alt='karati-logo' className="ui bordered rounded image" />
                                <h3 className="ui header">Karati is a book swapping app</h3>
                                <p>Which allows easy and enjoyable book exchange with people nearby</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="center aligned column">
                                <a className="ui large green button" href="/login/google">Sign up to give it a try</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ui vertical stripe quote segment">
                    <div className="ui equal width stackable internally celled grid">
                        <div className="center aligned row">
                            <div className="column">
                                <h3>"Amazing"</h3>
                                <p>The developer</p>
                            </div>
                            <div className="column">
                                <h3>"This app sucks ass"</h3>
                                <p>Again, the developer.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ui vertical stripe segment">
                    <div className="ui text container">
                        <h3 className="ui header">Add your books and browse books of others</h3>
                        <p>It takes less than a minute to get going</p>
                        <a className="ui large green button" href='https://www.urbandictionary.com/define.php?term=kbye'>Leave me alone, dude</a>
                    </div>
                </div>

                <h3 className="ui block header green inverted">
                    Recently Added
                </h3>

                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        recentlyAdded: state.recentlyAdded
    };
}

export default connect(
    mapStateToProps,
    { updateRecentlyAdded }
)(FrontPage);