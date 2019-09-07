import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { loadGenres } from '../../actions';

class BrowseFilter extends React.Component {
  componentDidMount() {
    this.props.loadGenres();
  }

  onSelectGenre = (event, data) => {
    this.props.onSelectGenre(data.value);
  };

  renderDropdown() {
    if (!this.props.genres) {
      return;
    }

    let genreOptions = this.props.genres.map(genre => {
      return {
        text: genre,
        value: genre
      };
    });

    return (
      <React.Fragment>
        Show me book of genre{' '}
        <Dropdown
          placeholder="Select Genre"
          inline
          clearable
          options={genreOptions}
          onChange={this.onSelectGenre}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="ui raised container centered grid">
        <div className="ui eight wide column">
          <h2 className="ui centered header">
            <i className="red filter icon" />
            Filter Results
          </h2>

          <div className="ui raised segment">{this.renderDropdown()}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    books: state.books,
    genres: state.genres
  };
}

export default connect(
  mapStateToProps,
  { loadGenres }
)(BrowseFilter);
