'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';
import bsStyles from '../styles/baseStyles.js';
import styles from '../styles/styles.js';
import Login from './Login';
import React, {Component} from 'react';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,
    }
  }


  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.


    // A simple UI with a toolbar, and content below it.
  	return (
      <View style = {{flex:1}}>
       <View style = {styles.container}>   
        <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style = {{width: 200, height: 200, justifyContent: 'center'}}
                 source={{uri: 'https://previews.123rf.com/images/natalyon/natalyon1502/natalyon150200013/36745703-Doodle-space-elements-collection-in-black-and-white-ISS-moonwalker-planet-comet-moon-astronaut-alien-Stock-Vector.jpg'}}
          />
          <Text style={{justifyContent: 'center'}}>Welcome to Comet!</Text>
        </View>
       </View>
        <View style = {styles.navContainer}>
        <View style={styles.navbar}>
  
          <TouchableHighlight onPress={this.goToLogin.bind(this)}>
            <Text>Login</Text>
          </TouchableHighlight>


        </View>
      </View>
      </View>
    );
  }
  // Go to the login page
  goToLogin(){
    this.props.navigator.push({
      component: Login
    });
  }
}

AppRegistry.registerComponent('Home', () => Home);