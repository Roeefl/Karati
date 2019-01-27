import React from 'react';

import { Link } from 'react-router-dom';

import './SwipeCard.css';

class SwipeCard extends React.Component {
    render() {
        let iconClass = (this.props.swipe.liked ? 'up' : 'down');
        let iconColor = (this.props.swipe.liked ? 'green' : 'red');
        let linkTo = ('/book/' + this.props.swipe.book._id);

        return (
            <Link to={linkTo} className="swipe-card item">
                    <div className="ui image">
                        <img
                            src={this.props.swipe.book.imageURL}
                            alt={this.props.swipe.book.desc} />
                    </div>

                    <div className="middle aligned content">
                        <div className="header">
                            {this.props.swipe.book.title}
                        </div>
                        <div className="description">
                            {this.props.swipe.book.author}
                        </div>

                        <div className="extra">
                            <div className={`ui right floated icon`}>
                                <i className={`icon outline huge thumbs ${iconClass} ${iconColor}`} />
                            </div>
                            {/* <span>
                                Swiped on {this.props.swipe.dateAdded}
                            </span> */}
                        </div>
                    
                    </div>
            </Link>
        );
    }
}

export default SwipeCard;