import React from 'react';

import './BookContent.css';

import Spinner from '../shared/Spinner';
import Message from '../shared/Message';

class BookContent extends React.Component {
    render() {
        if (this.props.book === false) {
            return (
                <Spinner message="Fetching Book Data..."/>
            );  
        };
    
        if (!this.props.book || !this.props.book.title) {
            return (
                <Message 
                    color='red'
                    lines={[
                        'Error in book component'
                    ]} />
            );
        };

        const genres = this.props.book.genres.map( genre => {
            return (
                <div className="ui blue icon label book-genre" key={ Math.random().toFixed(8) * 100000000 }>
                    <i className="ui bookmark outline icon" />
                    {genre}
                    <div className="detail">Genre</div>
                </div>
            );
        });
    
        return (
            <div className="ui grid book-content">
  
                <div className="ui left aligned eight wide column grid">
                    <div className="center aligned four wide column">
                        <div className="image">
                            <img className="book-card-img" src={this.props.book.imageURL} alt={this.props.book.description} />
                        </div>
                    </div>
                    <div className="left aligned ten wide column">
                        <div className="content">
                            <div className="header">
                                {this.props.book.title}
                            </div>
                            <div className="meta author">
                                {this.props.book.author}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="two column row">
                    <div className="column">
                        <div className="ui raised segment book-ribbons">
                            <span className="ui blue ribbon label">Info</span>
                            <div className="content ui segment">
                                <div className="header">
                                    {this.props.book.title}
                                </div>
                                <div className="meta author">
                                    {this.props.book.author}
                                </div>
                            </div>
                            <span className="ui red ribbon label">Summary</span>
                            <div className="description ui segment">
                                <div dangerouslySetInnerHTML={{ __html: this.props.book.description }} />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui book-anecdote">
                            <i className="ui bookmark outline icon" /> {this.props.book.numOfPages} Pages
                        </div>
                        <div className="ui book-anecdote">
                            <i className="ui bookmark outline icon" /> Published On: {this.props.book.publicationYear}
                        </div>
                        <div className="ui book-anecdote">
                            <i className="ui bookmark up outline icon" /> Average Rating: {this.props.book.averageRating}
                        </div>
                        {genres}
                    </div>
                </div>
            </div>
        );
    }
}

export default BookContent;