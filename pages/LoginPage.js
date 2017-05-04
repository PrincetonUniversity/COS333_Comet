'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {Component} from 'react';
import SignupPage from './SignupPage';
import styles from '../styles';
import Firebase from '../components/Firebase';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: ''
    }
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
    <View>
      <View style={localStyles.logoContainer}>
        <Image
          style = {localStyles.logo}
          source={{uri: 'comet_logo'}}
        />
      </View>
      <View style={localStyles.loginContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder={"Email Address"}
          placeholderTextColor="rgba(255,255,255,0.7)"/>

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          placeholder={"Password"}
          placeholderTextColor="rgba(255,255,255,0.7)"/>

        <TouchableHighlight
          onPress={this.login.bind(this)}
          style={localStyles.loginButton}>
          <Text style={localStyles.loginButtonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.goToSignup.bind(this)}
          style={localStyles.transparentButton}>
          <Text style={localStyles.transparentButtonText}>New here?</Text>
        </TouchableHighlight>
      </View>
    </View>

    return (
      <View style={{flex:1, backgroundColor: '#22316C'}}>
          {content}
      </View>
    );
  }

  login(){
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((userData) =>
      {
        this.setState({
	        loading: false
	      });
        Firebase.database().ref('users/' + Firebase.auth().currentUser.uid).update({
          name: Firebase.auth().currentUser.email
        });
        this.props.navigator.replace({
          name: 'HomePage',
        });
      }
    ).catch((error) =>
    	{
	      this.setState({
	        loading: false
	      });
        alert('Login failed. ' + error.message + ' Please try again.');
    });
  }

  // Go to the signup page
  goToSignup(){
    this.props.navigator.push({
      name: 'SignupPage',
    });
  }
}

const localStyles = StyleSheet.create({
  loginContainer: {
    padding: 20,
  },
  logoContainer: {
    marginTop: 80,
    marginBottom: 40,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  loginButton: {
    padding: 15,
    marginTop: 40,
    backgroundColor: '#1C86EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  },
  transparentButton: {
     marginTop: 10,
     padding: 15
   },
   transparentButtonText: {
     color: '#1C86EE',
     textAlign: 'center',
     fontSize: 16
   },
});

module.exports = LoginPage;
