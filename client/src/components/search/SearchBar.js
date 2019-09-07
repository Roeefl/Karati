import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  state = {
    term: '',
    currTimer: null
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.term);
  };

  updateTerm = event => {
    this.setState({ term: event.target.value });

    clearTimeout(this.state.currTimer);

    if (this.state.term.length < 3) {
      return;
    }

    this.setState({
      currTimer: setTimeout(() => {
        this.props.onSubmit(this.state.term);
      }, 1000)
    });
  };

  render() {
    return (
      <div className="search-bar ui segment">
        <form className="ui form" onSubmit={this.onFormSubmit}>
          <h4 className="ui dividing header">
            Search to add the books you own
          </h4>
          <div className="ui action left icon input">
            <i className="icon search" />
            <input
              type="text"
              placeholder="A song of Ice and Fire..."
              value={this.state.term}
              onChange={this.updateTerm}
            />
            <button className="ui button green">Search</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBar;
