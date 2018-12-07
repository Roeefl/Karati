import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Location from './Location';
import Header from './Header';

import BookAdd from './books/BookAdd';
import BookDelete from './books/BookDelete';
import BookEdit from './books/BookEdit';
import BookList from './books/BookList';
import BookShow from './books/BookShow';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Header />
                        <Route path="/" exact component={BookList} />
                        <Route path="/mybooks/add" exact component={BookAdd} />
                        <Route path="/mybooks/edit" exact component={BookEdit} />
                        <Route path="/mybooks/delete" exact component={BookDelete} />
                        <Route path="/mybooks/show" exact component={BookShow} />
                    </div>
                </BrowserRouter>
                <div>
                    Karati - Home
                </div>

                <Location />
            </div>
        );
    }
}

export default App;