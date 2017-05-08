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
  H1, Form, Item, Input, Label
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
    <View>
      <View style={styles.logoContainer}>
        <H1 style={{color: 'white', marginTop: 80, marginBottom: 40}}>Welcome!</H1>
      </View>

      <Item underline>
          <Input placeholder='Username'
            style={{fontSize: 16, color: 'rgba(255,255,255,0.7)',}}
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
            placeholder={"Email Address"}
            placeholderTextColor="rgba(255,255,255,0.7)"/>
      </Item>

      <Item underline>
          <Input placeholder='Password'
            style={{fontSize: 16, color: 'rgba(255,255,255,0.7)',}}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
            placeholderTextColor="rgba(255,255,255,0.7)"/>
      </Item>

      <TouchableHighlight
        onPress={this.signup.bind(this)}
        style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Signup</Text>
      </TouchableHighlight>

      <TouchableHighlight
        onPress={this.goToLogin.bind(this)}
        style={styles.transparentButton}>
        <Text style={styles.transparentButtonText}>Go back to login</Text>
      </TouchableHighlight>

    </View>
    // <View>
    //   <View style={localStyles.logoContainer}>
    //     <H1 style={{color: 'white', marginTop: 80, marginBottom: 40}}>Welcome!</H1>
    //   </View>
    //   <View style={localStyles.loginContainer}>
    //     <TextInput
    //       style={styles.textInput}
    //       onChangeText={(text) => this.setState({email: text})}
    //       value={this.state.email}
    //       placeholder={"Email Address"}
    //       placeholderTextColor="rgba(255,255,255,0.7)"/>
    //
    //     <TextInput
    //       style={styles.textInput}
    //       onChangeText={(text) => this.setState({password: text})}
    //       value={this.state.password}
    //       secureTextEntry={true}
    //       placeholder={"Password"}
    //       placeholderTextColor="rgba(255,255,255,0.7)"/>
    //
    //     <TouchableHighlight
    //       onPress={this.signup.bind(this)}
    //       style={localStyles.loginButton}>
    //       <Text style={localStyles.loginButtonText}>Signup</Text>
    //     </TouchableHighlight>
    //
    //     <TouchableHighlight
    //       onPress={this.goToLogin.bind(this)}
    //       style={localStyles.transparentButton}>
    //       <Text style={localStyles.transparentButtonText}>Go back to login</Text>
    //     </TouchableHighlight>
    //   </View>
    // </View>

    // A simple UI with a toolbar, and content below it.
    return (
      <View style={{flex:1, backgroundColor: '#283A90'}}>
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
