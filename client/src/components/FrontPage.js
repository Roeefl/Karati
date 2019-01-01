import React from 'react';

import './FrontPage.css';

import { connect } from 'react-redux'   ;
import { updateFeeds } from '../actions';

import { Link } from 'react-router-dom';

import Message from './shared/Message';
import Spinner from './shared/Spinner';

import FeedCard from './books/FeedCard';

import icon256 from '../icons/256.png';
// import icon64 from '../icons/64.png';
// import icon128 from '../icons/128.png';

class FrontPage extends React.Component {
    componentDidMount() {
        this.props.updateFeeds();
    }

    renderFeed(feed, dark) {
        if (!feed || !feed.data) {
            const spinnerMsg = `Fetching ${feed.title.colored} ${feed.title.rest}...`;

            return (
                <Spinner message={spinnerMsg} />
            );
        }

        if (feed.data.length === 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        `No ${feed.title} found in the system. Super strange`
                    ]} />
            );
        }

        // console.log(feed);

        const feedColumns = feed.data.slice(0,4).map( book => {
            return (
                <div className="feed-item four wide column" key={book._id}>
                    <FeedCard
                        dark={dark}
                        bookId={book._id}
                        src={book.imageURL}
                        title={book.title}
                        author={book.author}
                        linkTo={'/book/' + book._id} />
                </div>
            );
        });

        return (
            <div className="ui link cards grid">
                {feedColumns}
            </div>
        );
    }

    renderBookFeeds() {
        let dark = false;

        const feeds = this.props.feeds.map( feed => {
            let bgColor = (dark ? 'bg-black' : 'bg-white');
            let textColor = (dark ? 'text-white' : 'text-blak');
            dark = !dark;

            return (
                <div className={`books-feed ui vertical stripe ${bgColor}`} key={feed.title.colored}>
                    <div className="ui container    ">
                        <h1 className={`ui centered header ${textColor}`}>
                            <i className={`icon ${feed.iconName} ${feed.iconColor}`} />
                            {feed.title.colored} {feed.title.rest}
                        </h1>

                        {this.renderFeed(feed, dark)}         
                    </div>           
                </div>
            );
        });

        return (
            <div className="feeds">
                {feeds}
            </div>
        );
    }

    render() {
        return (
            <div className="front-page">

                <div className="ui vertical stripe first-gradient">
                    <div className="ui middle aligned stackable grid container">
                        <div className="center aligned row rtl app-logo">
                            <div className="column">
                                <h1 className="ui header">קראתי</h1>
                                <h3 className="ui header">קראת? החלפת!</h3>
                            </div>
                        </div>
                        <div className="centered row">
                            <div className="one wide column">
                            </div>
                            <div className="center aligned four wide column">
                                <h1>Give away your old, dusty books</h1>
                                <em>Add some of my old books up for exchange</em>
                                <Link to="/myShelf">
                                    <div className="ui huge violet labeled icon button">
                                        <i className="icon zip white large" />
                                        My Shelf
                                    </div>
                                </Link>
                            </div>
                            <div className="six wide column ui center aligned">
                                    <img src={icon256} alt="karati-logo"/>
                            </div>
                            <div className="four wide center aligned column">
                                <h1>Dive into new, untold adventures</h1>
                                <em>See whats up for grabs around my location</em>
                                <Link to="/books/browse">
                                    <div className="ui huge orange labeled icon button">
                                        <i className="icon delicious white large" />
                                        Books Nearby
                                    </div>
                                </Link>
                            </div>
                            <div className="one wide column">
                            </div>
                        </div>
                    </div>
                </div>

                {this.renderBookFeeds()}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        
        feeds: [
            {
                data: state.feeds.recentlyAdded,
                title: {
                    colored: 'Recently',
                    rest: 'marked as owned'
                },
                iconName: 'paper plane outline',
                iconColor: 'orange'
            },
            {
                data: state.feeds.mostPopular,
                title: {
                    colored: 'Most',
                    rest: 'popular books'
                },
                iconName: 'heartbeat',
                iconColor:' pink'
            },
            {
                title: {
                    colored: 'Owned',
                    rest: 'by the most people'
                },
                data: state.feeds.mostPopular,
                iconName: 'hand paper outline',
                iconColor: 'blue'
            }
        ]
    };
}

export default connect(
    mapStateToProps,
    { updateFeeds }
)(FrontPage);