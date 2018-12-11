import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';

import BookSearch from './books/BookSearch';
import BookEdit from './books/BookEdit';
import BookList from './books/BookList';
import BookShow from './books/BookShow';

import MyBooks from './books/MyBooks';

import MyProfile from './MyProfile';

import MyMatches from './MyMatches';

import Browse from './matches/Browse';
import Swipe from './matches/Swipe';

class App extends React.Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header />

                        <div className="book-search ui container">
                            <Route exact path="/" component={BookList} />
                            <Route exact path="/myBooks" component={MyBooks} />
                            <Route exact path="/myMatches" component={MyMatches} />
                            <Route path="/myProfile" component={MyProfile} />
                            <Route path="/books/list" component={BookList} />
                            <Route path="/books/search" component={BookSearch} />
                            <Route path="/books/edit" component={BookEdit} />
                            <Route path="/books/show" component={BookShow} />
                            <Route path="/matches/browse" component={Browse} />
                            <Route path="/matches/swipe" component={Swipe} />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null, actions)(App);