import './Header.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './Auth';

import HeaderMenu from './HeaderMenu';

import icon64 from '../icons/64.png';

class Header extends React.Component {  
    renderExplore() {
        if (!this.props.userData || this.props.userData.error) {
            return;
        }

        const links = [
            {
                to: '/books/browse',
                text: 'Browse Books',
                icon: 'delicious'
            },
            {
                to: '/books/swipe',
                text: 'Swipe',
                icon: 'nintendo switch'
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
                icon: 'zip'
            },
            {
                to: '/myProposals',
                text: 'My Proposals',
                icon: 'handshake outline'
            },
            {
                to: '/myMatches',
                text: 'My Matches',
                icon: 'options'
            },
            {
                to: '/mySwipes',
                text: 'My Swipes',
                icon: 'thumbs up outline'
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