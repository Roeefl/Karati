import './BookCard.css';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Highly reuseable book component used by virtually every part of the app.
 * Keep it as customizable as possible
 *
 * @class BookCard
 * @extends {React.Component}
 */
class BookCard extends React.Component {
    selectBook = () => {
        if (this.props.selectBook) {
            this.props.selectBook(this.props.bookId, this.props.myBook || null);
        }
    }

    renderNumOfPages() {
        if (this.props.numOfPages) {
            return  (
                <span className="number-of-pages">
                    <i className="icon file alternate outline"></i>
                    {this.props.numOfPages} Pages
                </span>
            );
        }
    }

    renderExtraContent() {
        if (this.props.ranking) {
            return (
                <div className="extra content">
                    <span className="right floated">
                        {this.props.ranking}
                    </span>
                    {this.renderNumOfPages()}
                </div>
            );
        }
    }

    renderMeta() {
        if (this.props.author) {
            return (
                <div className="meta">
                    {this.props.author}
                </div>
            );
        }
    }

    renderDesc() {
        if (this.props.desc) {
            return (
                <div className="description">
                    <div dangerouslySetInnerHTML={{ __html: this.props.desc }} />
                </div>
            );
        }
    }

    renderCard() {
        const withDesc = (this.props.desc ? 'with-desc' : '');

        return (
            <div 
                className={`book-card ui card ${withDesc} ${this.props.cardColor || ''}`}
                onClick={this.selectBook}>
                <div className="ui centered image">
                    <img
                        src={this.props.src}
                        alt={this.props.desc} />
                </div>
                <div className={`content book-card-data ${this.props.pickedClass}`}>

                    <div className="header">
                        {this.props.title}
                    </div>

                    {this.renderMeta()}
                    {this.renderDesc()}
                </div>
                {this.renderExtraContent()}
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