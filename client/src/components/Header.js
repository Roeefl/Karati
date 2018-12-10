import './Header.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './Auth';
import CompHeader from './CompHeader';

class Header extends React.Component {
    renderMyBooks() {
        if (this.props.auth) {
            return (
                <Link to="/myBooks" className="item">
                    <i className="icon list alternate outline" />
                    My Books
                </Link>
            );
        }
        return;
    }

    renderMyProfile() {
        if (this.props.auth) {
            return (
                <Link to="/myProfile" className="item">
                    <i className="icon smile outline" />
                    My Profile
                </Link>
            );
        }
        return;
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
    
                        <Link to="/books/search" className="search item">
                            <i className="icon search" />
                            Search
                        </Link>
    
                        <div className="right menu">
                            {this.renderMyBooks()}
                            {this.renderMyProfile()}
                            <Auth method="google" loggedIn={this.props.auth} />
                        </div>
                    </div>
                </div>
                
                <CompHeader />
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

export default connect(mapStateToProps)(Header);