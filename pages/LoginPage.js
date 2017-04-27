'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator
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
    this.ref = Firebase.database().ref();
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder={"Email Address"}/>

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          placeholder={"Password"} />

        <TouchableHighlight
          onPress={this.login.bind(this)}
          style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.goToSignup.bind(this)}
          style={styles.transparentButton}>
          <Text style={styles.transparentButtonText}>New here?</Text>
        </TouchableHighlight>
      </View>;

  	return (
  		<View style={styles.container}>
        <View style={styles.body}>
          {content}
        </View>
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
        //var user = firebase.auth().currentUser;
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

module.exports = LoginPage;
