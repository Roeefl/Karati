import React, { Component } from 'react';
import * as icons from '../../config/icons';

class MiniSwipeItemList extends Component {
    renderList() {
        const swipeList = this.props.swipes
        .filter( swipe => swipe.userID === this.props.myUserId)
        .map( swipe => this.props.myShelf.find( book => swipe.bookID === book._id) )
        .map( book => {
            return (
                <div className="item" key={`${book._id}`}>
                    <div className="ui tiny image">
                        <img src={book.imageURL} />
                    </div>
                    <div className="content">
                        <div className="header">
                            {book.author}
                        </div>
                        <div className="description">
                            {book.title}
                        </div>
                    </div>
                </div>
            );
        });
    
        if (swipeList.length < 1)
            return;

        return (
            <React.Fragment>
                <h2 className="ui centered header">
                    <i className={`${icons.USER} icon green`}/>
                    This user already liked {swipeList.length} of your books:
                </h2>

                <div className="ui items">
                    {swipeList}
                </div>
            </React.Fragment>
        );
    }
    render() {
        return  (
            <div className="swipe-item-list">
                {this.renderList()}
            </div>
        );
    }
}

export default MiniSwipeItemList;