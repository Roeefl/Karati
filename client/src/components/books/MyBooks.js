import './MyBooks.css';

import React from 'react';

class MyBooks extends React.Component {
    state = {
        books: []
    }

    componentDidMount() {
        // const response = await Axios.get('/api/mybooks');
    }

    render() {
        return (
            <div>
                <div>
                    You own {this.state.books.length} Books
                </div>
            </div>
        );
    }
}

export default MyBooks;