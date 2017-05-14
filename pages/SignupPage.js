'use strict';
import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  H1, Form, Item, Input, Label, Button
} from 'native-base';
import styles from '../styles';
import LoginPage from './LoginPage';
import Firebase from '../components/Firebase';

export default class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,
      email: '',
      password: ''
    }
  }

  // A method to passs the username and password to firebase and make a new user account
  signup() {
    this.setState({
      // When waiting for the firebase server show the loading indicator.
      loading: true
    });

    // Make a call to firebase to create a new user.
    Firebase.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.password).then(() => {
        // then and catch are methods that we call on the Promise returned from
        // createUserWithEmailAndPassword
        Alert.alert('Congrats!', 'Your account was created.');
        this.setState({
          // Clear out the fields when the user logs in and hide the progress indicator.
          email: '',
          password: '',
          loading: false
        });
        this.props.navigator.pop();
    }).catch((error) => {
      // Leave the fields filled when an error occurs and hide the progress indicator.
      this.setState({
        loading: false
      });
      alert("Account creation failed: " + error.message );
    });
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
    <Image source={require('../gaussian.png')} style={styles.imageContainer}>
      <View style={styles.logoContainer}>
        <Text style={{color: 'white', fontSize: 30, fontFamily: 'Avenir-light', marginTop: 80, marginBottom: 30}}>Welcome!</Text>
      </View>

      <Item underline>
          <Input placeholder='Email address'
            style={{fontSize: 16, color: 'rgba(255,255,255,0.7)', fontFamily: 'Avenir'}}
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
            placeholder={"Email address"}
            placeholderTextColor="rgba(255,255,255,0.7)"/>
      </Item>

      <Item underline>
          <Input placeholder='Password'
            style={{fontSize: 16, color: 'rgba(255,255,255,0.7)', fontFamily: 'Avenir'}}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
            placeholderTextColor="rgba(255,255,255,0.7)"/>
      </Item>

      <Button block onPress={this.signup.bind(this)}
              style={{backgroundColor: '#1C86EE', marginTop: 60, marginBottom: 20, marginHorizontal: 40, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.loginButtonText}>Signup</Text>
      </Button>
      <Button bordered block onPress={this.goToLogin.bind(this)}
              style={{marginHorizontal: 40, alignItems: 'center', justifyContent: 'center'}} >
          <Text style={styles.loginButtonText}>Go back to login</Text>
      </Button>
    </Image>

    // <TouchableHighlight
    //   onPress={this.goToLogin.bind(this)}
    //   style={styles.transparentButton}>
    //   <Text style={styles.transparentButtonText}>Go back to login</Text>
    // </TouchableHighlight>
    //
    // <TouchableHighlight
    //   onPress={this.signup.bind(this)}
    //   style={styles.loginButton}>
    //   <Text style={styles.loginButtonText}>Signup</Text>
    // </TouchableHighlight>

    // A simple UI with a toolbar, and content below it.
    return (
      <View style={{flex:1}}>
          {content}
      </View>
    )
  }
  // Go to the login page
  goToLogin(){
    this.props.navigator.pop();
  }
}

module.exports = SignupPage;
