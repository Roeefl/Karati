import React from 'react';

class BookCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            src: this.props.data.image_url
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
        this.props.onBookSelect(this.props.data);
    }

    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.determinePhoto);
    }

    render() {
        return (
            <div className="book-card">
                <div className="book-card-img">
                    <img ref={this.imageRef} src={this.state.src} alt={this.props.data.desc} />
                </div>
                <div className="book-card-select">
                    <button
                        className="ui button primary"
                        onClick={this.selectBook} >
                        Info
                    </button>
                </div> 
            </div>
        );
    }
}

export default BookCard;