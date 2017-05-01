
import React, {Component} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  MapView,
  Alert,
} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
        Body, Title, Tab, Tabs} from 'native-base';
import Style from '../styles';
import Geocoder from 'react-native-geocoding';
import Firebase from '../components/Firebase';
import styles from '../styles.js';

class LocationSearchPage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      planAddr: null,
      planLatitude: null,
      planLongitude: null,
      currLatitude: null,
      currLongitude: null,
      error: null,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currLatitude: position.coords.latitude,
          currLongitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1 },
    );
  }

  render() {
    return (
      <View style={Style.container}>
        <View style={styles.titleBar}>
          <View style = {{flex: 1, marginTop: 20, marginLeft: 17, flexDirection: 'row', justifyContent:'flex-start'}}>
              <Icon onPress={()=>this.props.navigator.pop()} name="arrow-back" style={{fontSize: 20, color: 'navy'}}/>
          </View>
          <View style = {{flex: 3, marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.titleBarText}>New Event</Text>
          </View>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
          </View>
        </View>

        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          listViewDisplayed='auto' // true/false/undefined
          fetchDetails={true}

          renderDescription={(row) => row.description} // custom description render
          onPress={(data, details = "null") => { // 'details' is provided when fetchDetails = true
            //geocode the planned location
            Geocoder.setApiKey('AIzaSyCNz6l77DLDP0f9pehjVuABmkxByXUm90g');
            if (data.description == "Current location") {

            }
            Geocoder.getFromLocation(data.description).then(
              json => {
                place = json.results[0].geometry.location;
                this.setState({
                  planAddr: data.description,
                  planLatitude: place.lat,
                  planLongitude: place.lng,
                });
                this.props.updateLocation(this.state.planAddr, this.state.planLatitude, this.state.planLongitude )
                this.props.navigator.pop();
              },
              error => {
                alert("Invalid address. Please try again.");
              }
            );
          }}

          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCNz6l77DLDP0f9pehjVuABmkxByXUm90g',
            language: 'en', // language of the results
            location: 'this.state.currLatitude, this.state.currLongitude', // default current location
            radius: '50', // search radius in kilometers
            //types: 'establishment', // default: 'geocode'
          }}
          Style={{
            description: { // search results
              color: '#1faadb',
              flex: 1,
              marginLeft:5,
              flexWrap: "wrap",
            },
            predefinedPlacesDescription: { // predefined results
              fontWeight: 'bold',
              color: '#1faadb',
            },
            textInput: {
              marginLeft: 10,
              marginRight: 10,
              color: '#FFA500',
            },
          }}
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'university',
          }}

          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

          debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          //renderRightButton={() => <Text style={styles.transparentButton} style={styles.transparentButtonText}>Cancel</Text>}
        />
      </View>
    );
  }
}

module.exports = LocationSearchPage;