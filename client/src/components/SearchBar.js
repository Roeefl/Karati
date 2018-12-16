import React from 'react';

import './SearchBar.css';

class SearchBar extends React.Component {
    state = {
        term: ''
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.term);
    }
    
    render() {
        return (
            <div className="search-bar ui segment">
                <form
                    className="ui form"
                    onSubmit={this.onFormSubmit}>
                      <h4 className="ui dividing header">Search to add the books you own</h4>
                    <div className="ui action left icon input">
                        <i className="icon search"/>
                        <input
                            type="text"
                            placeholder="A song of Ice and Fire..." 
                            value={this.state.term}
                            onChange={ (e) => this.setState( {term: e.target.value} ) } />
                        <button className="ui button green">Search</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;