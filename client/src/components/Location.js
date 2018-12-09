import React from 'react';
import Spinner from './Spinner';

class Location extends React.Component {
    state = {
        lat: null,
        long: null,
        errorMsg: ''
    }

    componentDidMount() {
        window.navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState(
                    {
                        lat: position.coords.latitude,
                        long: position.coords.longitude                    
                    }
                );
            },
            (err) => {
                this.setState(
                    {
                        errorMsg: err.message
                    }
                )
            }
        );
    }

    renderContent () {
        if (this.state.errorMsg && !this.state.lat) {
            return (
                <div>
                    Error: {this.state.errorMessage}
                </div>
            );
        }

        if (this.state.lat && !this.state.errorMsg) {
            return (
                <div>Lat: {this.state.lat}</div>
            );
        }

        return (
            <Spinner message="Loading Karati App..." />
        );
    }

    render() {
        return (
            <div className="border-red">
                {this.renderContent()}
            </div>
        );
    }
}

export default Location;