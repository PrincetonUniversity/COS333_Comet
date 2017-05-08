import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

class Coordinates extends Component {
    constructor(props) {
        super(props);

        this.state = {
        latitude: null,
        longitude: null,
        error: null,
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
            });
    },
    (error) => this.setState({ error: error.message }),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1 },
    );
    }

    render() {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color:'white'}}>Latitude: {this.state.latitude}</Text>
            <Text style={{color:'white'}}>Longitude: {this.state.longitude}</Text>
            {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
            </View>
            );
    }
}

module.exports = Coordinates;
