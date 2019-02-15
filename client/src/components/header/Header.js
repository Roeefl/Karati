import './Header.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withLanguage from '../withLanguage';
import { getString } from '../../locale';
import { swapLanguage } from '../../actions';

import Auth from '../auth/Auth';

import HeaderMenu from './HeaderMenu';

import icon64 from '../../icons/64.png';
import * as icons from '../../config/icons';

class Header extends React.Component {
    swapLanguage = () => {
        this.props.swapLanguage();
    }

    renderExplore() {
        if (!this.props.userData || this.props.userData.error) {
            return;
        }

        const links = [
            {
                to: '/books/browse',
                text: getString(this.props.language, 'explore.browse'),
                icon: icons.BROWSE
            },
            {
                to: '/books/swipe',
                text: getString(this.props.language, 'explore.swipe'),
                icon: icons.SWIPE
            }
        ];

        return (
            <HeaderMenu title={getString(this.props.language, 'header.explore')} links={links}/>
        );
    }

    renderMyStuff() {
        if(!this.props.userData || this.props.userData.error) {
            return;
        }

        const links = [
            {
                to: '/myShelf',
                text: getString(this.props.language, 'myShelf.button'),
                icon: icons.MY_SHELF
            },
            {
                to: '/myWishlist',
                text: getString(this.props.language, 'wishlist.button'),
                icon: icons.WISHLIST
            },
            {
                to: '/myProposals',
                text: getString(this.props.language, 'myProposals.button'),
                icon: icons.MY_PROPOSALS
            },
            {
                to: '/myMatches',
                text: getString(this.props.language, 'myMatches.button'),
                icon: icons.MY_MATCHES
            },
            {
                to: '/mySwipes',
                text: getString(this.props.language, 'mySwipes.button'),
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
                            <Auth method="google" userData={this.props.userData} swapLanguage={this.swapLanguage} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) { 
    return {
        userData: state.userData
    }
};

export default connect(
    mapStateToProps,
    { swapLanguage }
)(withLanguage(Header));
