import './Header.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './Auth';
import CompHeader from './CompHeader';

class Header extends React.Component { 
    renderSwipe() {
        if (this.props.auth) {
            return (
                <Link to="/books/swipe" className="swipe item">
                    <i className="icon heart outline" />
                    Swipe
                </Link>
            );
        }
        return;
    }

    renderRightMenu() {
        if (this.props.auth) {
            return (
                <div className="right menu">
                    <Link to="/myMatches" className="item">
                        <i className="icon list alternate outline" />
                        My Matches
                    </Link>

                    <Link to="/myShelf" className="item">
                        <i className="icon list alternate outline" />
                        My Shelf
                    </Link>

                    <Link to="/mySwipes" className="item">
                        <i className="icon list alternate outline" />
                        My Swipes
                    </Link>

                    <Link to="/myProfile" className="item">
                        <i className="icon smile outline" />
                        My Profile
                    </Link>
                    
                    <Auth method="google" loggedIn={this.props.auth} />
                </div>
            );
        }
        return (
            <div className="right menu">
                <Auth method="google" loggedIn={this.props.auth} />
            </div>
        );
    }

    render() {
        return (
            <div className="ui inverted vertical masthead center aligned segment">
                <div className="ui container">
                    <div className="top-header ui secondary inverted menu">
                        <Link to="/" className="header item">
                            <i className="icon book" />
                            Karati
                        </Link>

                        <Link to="/books/browse" className="browse item">
                            <i className="icon handshake outline" />
                            Browse
                        </Link>

                        {this.renderSwipe()}
    
                        {this.renderRightMenu()}
                    </div>
                </div>
                
                <CompHeader />
            </div>
        );
    }
}

function mapStateToProps(state) {
    // console.log(state.auth);    
    return {
        auth: state.auth
    }
};

export default connect(mapStateToProps)(Header);