// import './SearchDetails.css';

import React from 'react';
import { connect } from 'react-redux';

const SearchDetails = ( { selectedBook} ) => {
    if (!selectedBook) {
        return (
            <div className="search-details six wide column">
                <div className="search-details-segment ui segment">
                    No Book Selected
                </div>
            </div>
        );
    };

    return (
        <div className="search-details six wide column">
            <div className="book-info ui card">
                <div className="image dimmable">
                    <div className="ui blurring inverted dimmer transition hidden">
                        <div className="content">
                            <div className="center">
                                <div className="ui teal button">Add Friend</div>
                            </div>
                        </div>
                    </div>
                    <img src={selectedBook.image_url} alt={selectedBook.desc} />
                </div>
                <div className="content">
                    <div className="header">
                        {selectedBook.title}
                    </div>
                    <div className="meta">
                        {selectedBook.author.name}
                    </div>
                    <div className="description">
                        {selectedBook.description}
                    </div>
                </div>
                <div className="extra content">
                    <span className="right floated created">Arbitrary</span>
                    <span className="friends">
                        Arbitrary
                    </span>
                </div>
            </div>  
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedBook: state.selectedBook
    };
}

export default connect(
    mapStateToProps
)(SearchDetails);