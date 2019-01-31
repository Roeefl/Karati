import './Header.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './Auth';

import HeaderMenu from './HeaderMenu';

import icon64 from '../icons/64.png';
import * as icons from '../config/icons';

class Header extends React.Component {  
    renderExplore() {
        if (!this.props.userData || this.props.userData.error) {
            return;
        }

        const links = [
            {
                to: '/books/browse',
                text: 'Browse Books',
                icon: icons.BROWSE
            },
            {
                to: '/books/swipe',
                text: 'Swipe',
                icon: icons.SWIPE
            }
        ];

        return (
            <HeaderMenu title='Explore Books Around You' links={links}/>
        );
    }

    renderMyStuff() {
        if(!this.props.userData || this.props.userData.error) {
            return;
        }

        const links = [
            {
                to: '/myShelf',
                text: 'My Shelf',
                icon: icons.MY_SHELF
            },
            {
                to: '/myWishlist',
                text: 'My Wishlist',
                icon: icons.WISHLIST
            },
            {
                to: '/myProposals',
                text: 'My Proposals',
                icon: icons.MY_PROPOSALS
            },
            {
                to: '/myMatches',
                text: 'My Matches',
                icon: icons.MY_MATCHES
            },
            {
                to: '/mySwipes',
                text: 'My Swipes',
                icon: icons.MY_SWIPES
            }
        ];

        return (
            <HeaderMenu title='My Stuff' links={links}/>
        );
    }

    render() {
        return (
            <div className="ui inverted vertical masthead center aligned segment">
                <div className="ui container">
                    <div className="top-header ui large secondary inverted menu">
                        <Link to="/" className="header item">
                            <img src={icon64} alt='karati-logo' className="ui rounded image" />
                        </Link>

                        {this.renderExplore()}

                        {this.renderMyStuff()}
    
                        <div className="right menu">
                            <Auth method="google" userData={this.props.userData} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    // console.log(state.userData);    
    return {
        userData: state.userData
    }
};

export default connect(mapStateToProps)(Header);