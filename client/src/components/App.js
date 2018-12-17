import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import './App.css';

import Header from './Header';

// import BookEdit from './books/BookEdit';
import Book from './books/Book';

import MyShelf from './shelf/MyShelf';
import SearchBooks from './shelf/SearchBooks';
import SearchBookExpanded from './shelf/SearchBookExpanded';

import MyProfile from './MyProfile';

import MyMatches from './MyMatches';

import Browse from './books/Browse';
import Swipe from './books/Swipe';

import FrontPage from './FrontPage';
import Intro from './Intro';



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

                        <main className="ui container">
                            <Route exact path="/" component={ () => (
                                (this.props.auth && !this.props.auth.passedIntro) ? (
                                        <Redirect to="/intro" />
                                    ) : (
                                        <FrontPage />
                                    )
                                )}
                            />
                            
                            <Route path="/intro" component={Intro} />

                            <Route exact path="/myShelf" component={MyShelf} />
                            <Route exact path="/myShelf/search" component={SearchBooks} />
                            <Route path="/myShelf/search/book/:bookId" component={SearchBookExpanded} />

                            <Route exact path="/myMatches" component={MyMatches} />
                            <Route path="/myProfile" component={MyProfile} />

                            {/* <Route path="/books/edit" component={BookEdit} /> */}

                            <Route path="/books/browse" component={Browse} />
                            <Route path="/books/swipe" component={Swipe} />
                            <Route path="/book/:bookId" component={Book} />
                        </main>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state.auth);    
    return {
        auth: state.auth
    }
};

export default connect(
    mapStateToProps, actions
)(App);