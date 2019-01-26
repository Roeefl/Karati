import './Header.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './Auth';

import HeaderMenu from './HeaderMenu';

import icon64 from '../icons/64.png';
import * as iconNames from '../config/iconNames';

class Header extends React.Component {  
    renderExplore() {
        if (!this.props.userData || this.props.userData.error) {
            return;
        }

        const links = [
            {
                to: '/books/browse',
                text: 'Browse Books',
                icon: iconNames.BROWSE
            },
            {
                to: '/books/swipe',
                text: 'Swipe',
                icon: iconNames.SWIPE
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
                icon: iconNames.MY_SHELF
            },
            {
                to: '/myWishlist',
                text: 'My Wishlist',
                icon: iconNames.WISHLIST
            },
            {
                to: '/myProposals',
                text: 'My Proposals',
                icon: iconNames.MY_PROPOSALS
            },
            {
                to: '/myMatches',
                text: 'My Matches',
                icon: iconNames.MY_MATCHES
            },
            {
                to: '/mySwipes',
                text: 'My Swipes',
                icon: iconNames.MY_SWIPES
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