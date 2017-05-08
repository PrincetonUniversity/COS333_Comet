// Home Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, StatusBar, Image, ListView, TouchableHighlight,
        Modal} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
          Body, Title, Tab, Tabs} from 'native-base';
import NavBar from '../components/NavBar';
import styles from '../styles';
import Coordinates from '../components/Coordinates';
import Firebase from '../components/Firebase';
import BackgroundTimer from 'react-native-background-timer';
var moment = require('moment');

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.userid = Firebase.auth().currentUser.uid
    this.currentEvent = null,
    this.counter = 0
  }

  componentWillUnmount() {
    Firebase.database().ref().child('/users/' + this.userid + '/').off()
  }

  _incrementCounter() {
    var prevCounter = 0
    var allList = Firebase.database().ref().child('/users/' + this.userid + '/')
    allList.on('value', (snap) => {
      snap.forEach((child) => {
        if (child.key == 'counter') {
          prevCounter = child.val();
        }
      });
    });
    prevCounter = prevCounter + 1;
    Firebase.database().ref('users/' + this.userid).update({
      counter: prevCounter
    });
  }

  _logout() {
    Firebase.database().ref().child('/users/' + this.userid + '/today/').off();
    Firebase.auth().signOut().then(() => {
      this.props.navigator.replace({
        name: 'LoginPage',
      });
    });
  }

  render() {
    var user = Firebase.auth().currentUser
    if (user) {
      var name = Firebase.auth().currentUser.email
    }

    return (
      <View style = {{flex:1}}>
      <View style = {styles.screenContainer}>
        <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style = {{width: 200, height: 200, justifyContent: 'center'}}
                   source={{uri: 'https://previews.123rf.com/images/natalyon/natalyon1502/natalyon150200013/36745703-Doodle-space-elements-collection-in-black-and-white-ISS-moonwalker-planet-comet-moon-astronaut-alien-Stock-Vector.jpg'}}
            />
            <Text style={{justifyContent: 'center'}}>Welcome to Comet, {name}!</Text>
            <Text style={{marginTop: 15, justifyContent: 'center'}}>Your Current Location:</Text>
            <Coordinates/>
          </View>

          <TouchableHighlight
            onPress={this._logout.bind(this)}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Logout</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this._incrementCounter.bind(this)}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Increment</Text>
          </TouchableHighlight>

         </View>
           <NavBar navigator={this.props.navigator}/>
        </View>
      );
    }
  }

  module.exports = HomePage;
