import React from 'react';
import { connect } from 'react-redux';
import { updateMyShelf } from '../../actions';

import { Link } from 'react-router-dom';

import SearchBooks from '../shelf/SearchBooks';

import Message from '../shared/Message';
import ProgressBar from '../shared/ProgressBar';

class Intro extends React.Component {
  componentDidMount() {
    this.props.updateMyShelf();
  }

  renderContent() {
    if (this.props.myShelf.length >= 5) {
      return (
        <div className="ui container">
          <Message
            color="green"
            lines={['Awesome! off you go to browse some books around you.']}
          />

          <ProgressBar percent={100} label="Awesome!" />

          <Link to="/books/browse" className="enforce-green">
            <div className="ui positive right labeled icon button">
              <i className="icon list alternate outline"></i>
              Browse Books
            </div>
          </Link>
        </div>
      );
    }

    return (
      <div className="ui container">
        <Message
          color="violet"
          lines={[
            'Please add 5 (or more!) books to your shelf before we can let you start browsing the app,',
            'That way we make sure that you can actually get matched with others when you find some books you like.'
          ]}
        />

        <ProgressBar
          percent={this.props.myShelf.length * 20}
          label="Add 5 books to your shelf to complete!"
        />

        <SearchBooks intro={true} />
      </div>
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userData,
    myShelf: state.myBooks
  };
}

export default connect(
  mapStateToProps,
  { updateMyShelf }
)(Intro);
