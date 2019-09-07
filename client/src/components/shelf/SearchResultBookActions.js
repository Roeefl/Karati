import React from 'react';

import './SearchResultBookActions.css';

import Axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../shared/Message';

import { updateMyShelf, fetchUser } from '../../actions';

import * as icons from '../../config/icons';

class SearchResultBookActions extends React.Component {
  state = {
    saved: false,
    saving: false
  };

  addToMyShelf = async () => {
    try {
      this.setState({ saving: true });

      const res = await Axios.post('/api/myShelf', {
        goodreadsID: this.props.goodreadsID
      });
      console.log(res);

      if (res.data.error) {
        return;
      }

      if (res.data.bookAddedToMyShelf) {
        this.setState({ saved: true });

        this.props.updateMyShelf();
        this.props.fetchUser();
      }
    } catch (error) {
      console.log('POST /api/myShelf/:id failed with error: ' + error);
    }
  };

  renderMyShelfLink() {
    if (this.props.quickAdd) return;

    return (
      <Link to="/myShelf" className="enforce-green">
        <i className={`${icons.MY_SHELF} icon`} />
        My Shelf
      </Link>
    );
  }

  renderAddButton() {
    if (!this.props.userData) {
      return;
    }

    if (this.state.saved) {
      if (this.props.quickAdd) return;

      return (
        <div className="ui positive message">
          <div className="header">Book was saved to your books.</div>
          <p>Go to {this.renderMyShelfLink()} to see all your books.</p>
        </div>
      );
    }

    if (this.state.saving) {
      return (
        <div className="ui active inline loader">Saving to your shelf...</div>
      );
    }

    if (
      !this.props.userData.ownedBooks ||
      !this.props.userData.ownedBooks.find(
        book => book.goodreadsID === this.props.goodreadsID
      )
    ) {
      const btnText = this.props.quickAdd ? '' : 'Add to My Shelf';

      return (
        <div
          className="add-to-my-shelf ui large button green"
          onClick={this.addToMyShelf}
        >
          <i className={`${icons.ADD} icon`} />
          {btnText}
        </div>
      );
    }

    if (this.props.quickAdd)
      return (
        <div className="add-to-my-shelf ui large violet disabled button">
          <i className={`${icons.QUICK_ADD} icon`} />
        </div>
      );

    return <Message color="blue" lines={['You already own this book.']} />;
  }

  render() {
    return (
      <div className="book-actions ui centered grid">
        <div className="ui center aligned six wide column">
          <div className="middle aligned content">{this.renderAddButton()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.quickAddGoodreadsID) {
    return {
      quickAdd: true,
      userData: state.userData,
      goodreadsID: ownProps.quickAddGoodreadsID
    };
  }

  return {
    quickAdd: false,
    userData: state.userData,
    goodreadsID: state.selectedBookFromSearch.goodreadsID
  };
};

export default connect(
  mapStateToProps,
  { updateMyShelf, fetchUser }
)(SearchResultBookActions);
