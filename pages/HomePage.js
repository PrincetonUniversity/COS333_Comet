// Home Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, StatusBar, Image, ListView, TouchableHighlight,
        Modal, StyleSheet} from 'react-native';
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
    var userid = Firebase.auth().currentUser.uid
    var ref = Firebase.database().ref('/users/' + userid);
    ref.once("value")
      .then(function(snapshot) {
        var prevCounter = snapshot.child("counter").val();
        console.log("counter is: " + prevCounter);
        prevCounter = prevCounter + 1
        Firebase.database().ref('users/' + Firebase.auth().currentUser.uid).update({
          counter: prevCounter
        });
      })
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
//        // <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
  //<View style = {styles.screenContainer}>
//</View>
  return (
      <View style={{flex:1}}>
        <Image
          source={require('../sky.jpeg')}
          style={localStyles.container}>
            <Text style={{color:'white'}}>Welcome to Comet, {name}!</Text>
            <Text style={{marginTop: 15, justifyContent: 'center', color:'white'}}>Your Current Location:</Text>
            <Coordinates/>
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
        </Image>
        <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }

    /*
      <View style = {{flex:1}}>
          <Image style = {styles.screenContainer}
                   source={require('../sky.jpg')}>
            <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{justifyContent: 'center'}}>Welcome to Comet, {name}!</Text>
              <Text style={{marginTop: 15, justifyContent: 'center'}}>Your Current Location:</Text>
              <Coordinates/>



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
          </Image>

           <NavBar navigator={this.props.navigator}/>
        </View>
      );
    }*/

  }

  const localStyles = StyleSheet.create({
  container: {
    flex: 10,
    flexDirection: 'column',
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

  module.exports = HomePage;
