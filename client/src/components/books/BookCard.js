import React from 'react';

class BookCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            src: this.props.src
        };

        this.imageRef = React.createRef();
    }
    
    determinePhoto = () => {
        if (this.imageRef.current.src.includes('nophoto')) {
            this.setState(
                {
                    src: 'http://www.lse.ac.uk/International-History/Images/Books/NoBookCover.png'
                }
            )
        }
    }

    selectBook = () => {
        this.props.onBookSelect(this.props.bookId);
    }

    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.determinePhoto);
    }

    renderButton() {
        if (this.props.showInfoButton) {
            return (
                <div className="book-card-select">
                    <button
                        className="ui button primary"
                        onClick={this.selectBook} >
                        Info
                    </button>
                </div>
            );
        };
        return;
    }

    render() {
        return (
            <div className="book-card">
                <div className="book-card-img">
                    <img ref={this.imageRef} src={this.state.src} alt={this.props.alt} />
                </div>
                {this.renderButton()}
            </div>
        );
    }
}

export default BookCard;