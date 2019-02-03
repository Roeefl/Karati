import './FeedCard.css';
import React from 'react';
import { Link } from 'react-router-dom';

class FeedCard extends React.Component {
    render() {
        return (
            <Link to={this.props.linkTo}>
                <div className={`feed-card ${ this.props.dark ? 'light' : 'dark'}`}>
                    <div className="image">
                        <img
                            src={this.props.src}
                            alt={this.props.title} />
                    </div>
                    <div className="content">
                        <div className="author">
                            {this.props.author}
                        </div>
                        <div className="title">
                            {this.props.title}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
}

export default FeedCard;
