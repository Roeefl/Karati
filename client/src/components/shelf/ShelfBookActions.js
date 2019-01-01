import Axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Spinner from '../shared/Spinner';

class ShelfBookActions extends React.Component {
    state = {
        refreshNeeded: false,
        waiting: false
    };

    removeFromMyShelf = async () => {
        this.setState( {
            waiting: true
        });

        const res = await Axios.delete('/api/myShelf/' + this.props.book._id);

        this.setState({
            refreshNeeded: res.data.removed,
            waiting: false
        });
    }

    toggleShelfAvailability = async () => {
        this.setState( {
            waiting: true
        });

        const res = await Axios.put('/api/myShelf/' + this.props.book._id, {
            available: !(this.props.onShelf.available)
        });

        if (res.data.updated) {
            this.props.refreshBook();
        }

        this.setState({
            waiting: false
        });
    }
    
    renderAvailabilityButton() {
        console.log(this.props);

        if (this.props.onShelf.available) {
            return (
                <button 
                    className="ui orange left labeled icon button"
                    onClick={this.toggleShelfAvailability} >
                    <i className="ban icon"></i>
                    Mark as Unavailable
                </button>
            );
        }

        return (
            <button 
                className="ui green left labeled icon button"
                onClick={this.toggleShelfAvailability} >
                <i className="lock open icon"></i>
                Mark as Available
            </button>
        );
    }

    renderContent() {
        if (!this.props.user) {
            return;
        }

        if (!this.props.book) {
            return;
        }

        if (this.state.waiting) {
            return (
                <Spinner message="Removing from your shelf...."/>
            );
        }

        if (this.state.refreshNeeded) {
            this.setState({
                refreshNeeded: false
            });

            return (
                <Redirect to='/myShelf' />
            );
        }

        return (
            <div className="write-book-review ui raised segment grid">            
                <div className="four wide centered column">
                    <button 
                        className="ui red left labeled icon button"
                        onClick={this.removeFromMyShelf} >
                        <i className="trash alternate outline icon"></i>
                        Remove from My Shelf
                    </button>
                </div> 
                <div className="four wide centered column">
                    {this.renderAvailabilityButton()}
                </div> 
            </div>
        )
    }

    render() {
        return (
            <div className="shelf-book-actions">
                {this.renderContent()}
            </div>
        );
    }
}

export default ShelfBookActions;