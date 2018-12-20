import React from 'react';

import Message from '../shared/Message';

class BookComments extends React.Component {
    render() {
        if (this.props.book === false) {
            return (
               <div></div>
            );  
        };
    
        if (!this.props.book || !this.props.book.comments) {
            return (
                <Message 
                    color='red'
                    lines={[
                        'Error in Book Comments Component'
                    ]} />
            );
        };

        const imageURL = 'https://semantic-ui.com/images/avatar/large/elliot.jpg';

        const comments = this.props.book.comments.map( comment => {
            return (
                <div className="book-comment comment" key={ Math.random().toFixed(8) * 100000000 }>

                    <a className="avatar">
                        <img src={imageURL} />
                    </a>

                    <div className="content">
                        <div className="author">{comment.userID}</div>
                        <div className="metadata">
                            <span className="date">{comment.dateAdded}</span>
                        </div>
                        <div className="text">
                            {comment.content}
                        </div>
                        <div className="actions">
                            <div className="reply">Reply</div>
                        </div>
                    </div>

                </div>
            );
        });
    
        return (
            <div className="book-comments ui comments">
                <h3 className="ui dividing header">Comments</h3>
                {comments}
            </div>
        );
    }
}

export default BookComments;