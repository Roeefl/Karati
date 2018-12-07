import React from 'react';
import Temp from './Temp';

class Location extends React.Component {
    state = {
        lat: null,
        long: null,
        errorMsg: ''
    };

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

    render() {
        if (this.state.errorMsg && !this.state.lat) {
            return (
                <div>
                    Error: {this.state.errorMessage}
                </div>
            );
        }

        if (this.state.lat && !this.state.errorMsg) {
            return (
                <Temp lat={this.state.lat}/>
            );
        }

        return (
            <div>
                Loading...
            </div>

        );
    }
}

export default Location;