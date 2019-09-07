import "./Matches.css";

import React from "react";
import { connect } from "react-redux";
import {
  swipeBook,
  updateAvailableSwipes,
  fetchUser,
  setCurrentComponent
} from "../../actions";
import withLanguage from "../withLanguage";
import { getString } from "../../locale";

import SwipeContainer from "./SwipeContainer";
import BrowseContainer from "./BrowseContainer";

import Spinner from "../shared/Spinner";
import Message from "../shared/Message";
import * as errors from "../shared/errors";

class Matches extends React.Component {
  componentDidMount() {
    const { language } = this.props;

    console.log(getString(language, "myMatches.primary"));

    this.props.setCurrentComponent({
      primary: getString(language, "myMatches.primary"),
      secondary: "Browse matches around your location",
      icon: "delicious"
    });

    this.props.updateAvailableSwipes();
  }

  onSwipeBook = async liked => {
    const book = this.props.books[0];
    this.props.swipeBook(
      liked,
      book.bookID,
      book.ownerID,
      this.props.userData._id
    );
  };

  renderContent() {
    if (!this.props.books) {
      return <Spinner message="Fetching Books..." />;
    }

    if (!this.props.userData) {
      return <Message color="red" lines={[errors.NOT_LOGGED_IN]} />;
    }

    if (this.props.books.length <= 0) {
      return (
        <Message
          color="red"
          lines={[
            "No books available nearby at the moment. Please change search filters to get more results."
          ]}
        />
      );
    }

    if (this.props.showGrid) {
      return (
        <BrowseContainer
          books={this.props.books}
          swipeBook={this.onSwipeBook}
        />
      );
    }

    return (
      <SwipeContainer books={this.props.books} swipeBook={this.onSwipeBook} />
    );
  }

  render() {
    return <div className="matches ui container">{this.renderContent()}</div>;
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    books: state.books
  };
};

export default connect(
  mapStateToProps,
  { swipeBook, updateAvailableSwipes, fetchUser, setCurrentComponent }
)(withLanguage(Matches));
