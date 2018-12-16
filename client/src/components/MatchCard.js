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
            <div className="match-card ui placeholder segment">
                <div class="ui two column very relaxed stackable grid">

                    <div class="middle aligned column">
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
                                        <img src={otherBook.imageURL} alt={otherBook.desc}/>
                                    </div>
                                    <div className="info">
                                        <div className="upper">
                                            <div className="title">{otherBook.title}</div>
                                            <div className="author">{otherBook.author}</div>
                                        </div>
                                        <div className="lower">
                                            <div className="desc">
                                                {otherBook.desc}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="middle aligned column">
                        <div className="match-book my-book">
                            <div className="match-book-container">
                                <div className="owner">
                                    <div className="owner-inner">Your Book:</div>
                                </div>
                                <div className="details">
                                    <div className="image">
                                        <img src={myBook.imageURL} alt={myBook.desc}/>
                                    </div>
                                    <div className="info">
                                        <div className="upper">
                                            <div className="title">{myBook.title}</div>
                                            <div className="author">{myBook.author}</div>
                                        </div>
                                        <div className="lower">
                                            <div className="desc">
                                                {myBook.desc}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ui vertical divider">
                        <div className="swap">
                            <button className="swap-books">
                                <i className="fas fa-retweet"></i>
                                <span>Swap!</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default MatchCard;