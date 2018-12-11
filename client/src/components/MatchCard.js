import './MatchCard.css';

import React from 'react';

class MatchCard extends React.Component {
    // selectBook = () => {
    //     if (this.props.onBookSelect)
    //         this.props.onBookSelect(this.props.bookId);
    // }

    render() {
        console.log(this.props.matchData);
        let myBook = this.props.matchData.myBook;
        let otherBook = this.props.matchData.otherBook;

        return (
            <div className="match-card ui card">
                {/* <div className="image">
                    <img className="match-card-img" src={this.state.src} alt={this.props.desc} onClick={this.selectBook} />
                </div>
                <div className="content book-card-title-author">
                    <div className="header">{this.props.title}</div>
                    <div className="meta">
                        {this.props.author}
                    </div>
                    <div className="description">
                        {this.props.desc}
                    </div>
                </div>
                <div className="extra content">
                    <span className="right floated">
                        Good
                    </span>
                    {this.renderNumOfPages()}
                </div> */}

                <div className="match-book other-book">
                    <div className="match-book-container">
                        <div className="owner">
                            <div className="owner-inner">
                                <div>This book is offered for exchange by:</div>
                                <div>{otherBook.owner}</div>
                            </div>
                        </div>
                        <div className="details">
                            <div className="image">
                                <img src={otherBook.imageURL}/>
                            </div>
                            <div className="info">
                                <div className="upper">
                                    <div className="title">{otherBook.title}</div>
                                    <div className="author">{otherBook.author}</div>
                                </div>
                                <div className="lower">
                                    <div className="desc">{otherBook.desc}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swap">
                    <button className="swap-books">
                        <i className="fas fa-retweet"></i>
                        <span>Swap!</span>
                    </button>
                </div>
                <div className="match-book my-book">
                    <div className="match-book-container">
                        <div className="owner">
                            <div className="owner-inner">Your Book:</div>
                        </div>
                        <div className="details">
                            <div className="image">
                                <img src={myBook.imageURL}/>
                            </div>
                            <div className="info">
                                <div className="upper">
                                    <div className="title">{myBook.title}</div>
                                    <div className="author">{myBook.author}</div>
                                </div>
                                <div className="lower">
                                    <div className="desc">{myBook.desc}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MatchCard;