import React from 'react';
import { connect } from 'react-redux';
import { showBook } from '../../actions';

class Book extends React.Component {
    componentDidMount() {
        // this.props.showBook(this.)
    }

    render() {
        return (
            <div>
                <div className="ui container">
                    <div className="book-card ui card">
                        <div className="image">
                            <img className="book-card-img" src={this.props.showBook.src} alt={this.props.showBook.desc} />
                        </div>
                        <div className="content book-card-title-author">
                            <div className="header">{this.props.showBook.title}</div>
                            <div className="meta">
                                {this.props.showBook.author}
                            </div>
                            <div className="description">
                                {this.props.showBook.desc}
                            </div>
                        </div>
                        <div className="extra content">
                            <span className="right floated">
                                Good
                            </span>
                            {this.props.showBook.numOfPages}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    console.log(ownProps.match);
    
    return {
        // auth: state.auth,
        // showBook: state.showBook
    }
};

export default connect(
    mapStateToProps,
    { showBook }
)(Book);