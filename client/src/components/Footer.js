import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Auth from './Auth';

import icon64 from '../icons/64.png';

class Footer extends React.Component {  
    render() {
        return (
            <div className="ui inverted vertical masthead center aligned segment">
                <div className="ui container">
                    <div className="top-header ui large secondary inverted menu">
                        <Link to="/" className="header item">
                            <img src={icon64} alt='karati-logo' className="ui rounded image" />
                        </Link>
    
                        <div className="left menu">
                            <Auth method="google" userData={this.props.userData} />
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

export default connect(mapStateToProps)(Footer);