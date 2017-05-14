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
import {
  Form, Item, Input, Label, Button
} from 'native-base';
import React, {Component} from 'react';
import SignupPage from './SignupPage';
import styles from '../styles';
import Firebase from '../components/Firebase';
import Loading from '../components/Loading';

export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
    }
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <Loading/> :
      <Image source={require('../gaussian.png')} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <Image
              style = {styles.logo}
              source={require('../comet_logo.png')}
            />
          </View>

          <Item underline>
              <Input placeholder='Email address'
                style={{fontSize: 16, color: 'rgba(255,255,255,0.7)',fontFamily: 'Avenir'}}
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                placeholderTextColor="rgba(255,255,255,0.7)"/>
          </Item>

          <Item underline>
              <Input placeholder='Password'
                style={{fontSize: 16, color: 'rgba(255,255,255,0.7)',fontFamily: 'Avenir'}}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
                secureTextEntry={true}
                placeholderTextColor="rgba(255,255,255,0.7)"/>
          </Item>

          <Button block onPress={this.login.bind(this)} style={{backgroundColor: '#1C86EE', marginTop: 60, marginBottom: 20, marginHorizontal: 40, alignItems: 'center', justifyContent: 'center',}} >
              <Text style={styles.loginButtonText}>Login</Text>
          </Button>
          <Button bordered block onPress={this.goToSignup.bind(this)} style={{marginHorizontal: 40, alignItems: 'center', justifyContent: 'center',}} >
              <Text style={styles.loginButtonText}>New here?</Text>
          </Button>
      </Image>

      // <TouchableHighlight
      //   onPress={this.login.bind(this)}
      //   style={styles.loginButton}>
      //   <Text style={styles.loginButtonText}>Login</Text>
      // </TouchableHighlight>
      //
      // <TouchableHighlight
      //   onPress={this.goToSignup.bind(this)}
      //   style={styles.transparentButton}>
      //   <Text style={styles.transparentButtonText}>New here?</Text>
      // </TouchableHighlight>


  	return (
      <View style={{flex:1}}>
          {content}
      </View>
		);
  }

  login() {
    this.setState({
      loading: true
    });
    // Log in and display an alert to tell the user what happened.
    Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((userData) =>
      {
        this.setState({
	        loading: false
	      });
        var ref = Firebase.database().ref('users/' + Firebase.auth().currentUser.uid);
        var hasCounter = false;
        ref.once("value")
          .then(function(snapshot) {
            console.log("in here")
            hasCounter = snapshot.child("counter").exists();
            if (!hasCounter) {
              Firebase.database().ref('users/' + Firebase.auth().currentUser.uid).update({
                counter: 0,
              });
            }
            console.log(hasCounter + "inside snapshot");
        });
        Firebase.database().ref('users/' + Firebase.auth().currentUser.uid).update({
          name: Firebase.auth().currentUser.email,
        });
        console.log(hasCounter)

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
