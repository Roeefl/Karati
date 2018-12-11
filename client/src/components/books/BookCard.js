import './BookCard.css';
import React from 'react';

class BookCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            src: this.props.src
        };

        this.imgRef = React.createRef();
    }
    
    determinePhoto = () => {
        if (this.imgRef.current.src.includes('nophoto')) {
            this.setState(
                {
                    src: 'http://www.lse.ac.uk/International-History/Images/Books/NoBookCover.png'
                }
            )
        }
    }

    selectBook = () => {
        if (this.props.onBookSelect)
            this.props.onBookSelect(this.props.bookId);
    }

    componentDidMount() {
        this.imgRef.current.addEventListener('load', this.determinePhoto);
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

        return;
    }

    render() {
        return (
            <div className="book-card ui card">
                <div className="image">
                    <img className="book-card-img" ref={this.imgRef} src={this.state.src} alt={this.props.desc} onClick={this.selectBook} />
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
                </div>
            </div>
        );
    }
}

export default BookCard;