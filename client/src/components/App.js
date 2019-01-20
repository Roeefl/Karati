import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import './App.css';

import Header from './Header';
import Footer from './Footer';

// import BookEdit from './books/BookEdit';
import Book from './books/Book';

import MyShelf from './shelf/MyShelf';
import SearchBooks from './shelf/SearchBooks';
import SearchBookExpanded from './shelf/SearchBookExpanded';

import MyProfile from './profile/MyProfile';
import MySettings from './profile/MySettings';
import MySwipes from './swipes/MySwipes';

import MyMatches from './matches/MyMatches';
import MatchesWithUser from './matches/MatchesWithUser';

import Browse from './books/Browse';
import Swipe from './books/Swipe';

import FrontPage from './FrontPage';
import Intro from './Intro';
import CompHeader from './CompHeader';

class App extends React.Component {
    componentDidMount() {
        console.log('fetchUser');
        this.props.fetchUser();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header />

                        <main>
                            <Route exact path="/" component={ () => (
                                (this.props.userData && !this.props.userData.error && !this.props.userData.passedIntro) ? (
                                        // <Redirect to="/intro" />
                                        <FrontPage />
                                    ) : (
                                        <FrontPage />
                                    )
                                )}
                            />

                            <div className="route-container">

                                <CompHeader header={this.props.currentComponent} />

                                <Route path="/intro" component={Intro} />

                                <Route exact path="/myShelf" component={MyShelf} />
                                <Route exact path="/myShelf/search" component={SearchBooks} />
                                <Route path="/myShelf/search/book/:bookId" component={SearchBookExpanded} />

                                <Route exact path="/myMatches" component={MyMatches} />
                                <Route exact path="/myMatches/:userId" component={MatchesWithUser} />

                                <Route path="/myProfile" component={MyProfile} />
                                <Route path="/mySettings" component={MySettings} />

                                <Route path="/mySwipes" component={MySwipes} />

                                {/* <Route path="/books/edit" component={BookEdit} /> */}

                                <Route path="/books/browse" component={Browse} />
                                <Route path="/books/swipe" component={Swipe} />

                                <Route path="/book/:bookId" component={Book} />
                            </div>

                        </main>

                        <Footer />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData,
        currentComponent: state.currentComponent
    }
};

export default connect(
    mapStateToProps, actions
)(App);