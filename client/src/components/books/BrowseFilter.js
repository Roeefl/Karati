import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Axios from 'axios';

class BrowseFilter extends React.Component {
    state = {
        genres: false
    };

    loadGenres = async () => {
        try {
            let res = await Axios.get('/api/genres');

            if (!res.data.genres) {
                return;
            }

            this.setState( {
                genres: res.data.genres
            });
        } catch(error) {
            console.log('genres Axios .put failed with error: ' + error);
        }
    }

    componentDidMount() {
        this.loadGenres();
    }

    onSelectGenre = (event, data) => {
        this.props.onSelectGenre(data.value);
    }

    renderDropdown() {
        if (!this.state.genres) {
            return;
        }

        let genreOptions = this.state.genres.map( genre => {
            return (
                {
                    text: genre,
                    value: genre
                }
            );
        });

        return (
            <React.Fragment>
                Show me book of genre{' '}
                <Dropdown
                    placeholder='Select Genre'
                    inline
                    clearable
                    options={genreOptions}
                    onChange={this.onSelectGenre }/>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="ui raised container centered grid">
                <div className="ui eight wide column">

                    <h2 className="ui centered header">
                        <i className="red envelope outline icon"></i>
                        Filter Results
                    </h2>
                    
                    <div className="ui raised segment">
                        {this.renderDropdown()}
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        books: state.books
    }
};

export default connect(
    mapStateToProps,
    {  }
)(BrowseFilter);
