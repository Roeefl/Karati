import './BookCard.css';
import React from 'react';
import { Link } from 'react-router-dom';

class BookCard extends React.Component {
    renderNumOfPages() {
        if (this.props.numOfPages) {
            return  (
                <span className="number-of-pages">
                    <i className="icon file alternate outline"></i>
                    {this.props.numOfPages} Pages
                </span>
            );
        }

        return;
    }

    selectBook = () => {
        if (this.props.selectBook) {
            this.props.selectBook(this.props.bookId);
        }
    }

    renderCard() {
        return (
            <div
                className={`book-card ui card ${this.props.cardColor || ''}`}
                onClick={this.selectBook}>
                <div className="ui image">
                    <img
                        src={this.props.src}
                        alt={this.props.desc} />
                </div>
                <div className="content book-card-title-author">
                    <div className="header">{this.props.title}</div>
                    <div className="meta">
                        {this.props.author}
                    </div>
                    <div className="description">
                        <div dangerouslySetInnerHTML={{ __html: this.props.desc }} />
                    </div>
                </div>
                <div className="extra content">
                    <span className="right floated">
                        Good
                    </span>
                    {this.renderNumOfPages()}
                </div>
            </div>
        );
    }

    render() {
        if (this.props.linkTo) {
            return (
                <Link to={this.props.linkTo}>
                    {this.renderCard()}
                </Link>
            )
        }

        return (
            this.renderCard()
        )
    }
}

export default BookCard;