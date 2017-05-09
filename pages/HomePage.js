// Home Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, StatusBar, Image, ListView, TouchableHighlight,
        Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
          Body, Title, Tab, Tabs, H1, H2, H3} from 'native-base';
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
    var dateString = moment().format('LLLL').split(',')
    var date = (dateString[0] + ", " + dateString[1]).toLowerCase()

    var streak = 0
    var allList = Firebase.database().ref().child('/users/' + this.userid + '/')
    allList.on('value', (snap) => {
      snap.forEach((child) => {
        if (child.key == 'counter') {
          streak = child.val();
        }
      });
    });

    return (
      <View style={{flex:1}}>
        <Image source={require('../skybg.jpeg')} style={localStyles.imageContainer}>
          <View style={{flex:1, flexDirection:'row', backgroundColor: 'transparent'}}>
            <View style={{flex:1, flexDirection:'row', alignItems: 'center', paddingLeft: 20, paddingTop: 21}}>
              <TouchableOpacity onPress={this._logout.bind(this)} style={{flexDirection: 'row', alignItems:'center'}}>
                <Icon name="ios-power" style={{fontSize: 25, color: 'white', fontWeight:'bold'}}/>
                <Text style={{color:'white', fontSize: 15, fontFamily:'Avenir'}}>  logout</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex:10, alignItems: 'center'}}>
            <Text style={{color:'white', fontSize: 22, fontFamily:'Avenir-medium', paddingTop: 40}}>hello nina</Text>
            <Text style={{color:'white', fontSize: 30, fontFamily:'Avenir-medium', paddingBottom: 20}}>{date}</Text>
            <Image source={require('../constellation4.2.png')} style={localStyles.graphic}/>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Icon name="star" style={{fontSize: 30, color: 'white', fontWeight:'bold', paddingTop:50}}/>
              <Text style={{color:'white', fontSize: 25, fontFamily:'Avenir-medium', paddingTop: 50}}> {streak} days</Text>
            </View>
          </View>
        </Image>
        <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  imageContainer: {
    flex: 10,
    flexDirection: 'column',
    width: undefined,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 10,
    flexDirection: 'row',
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  graphic: {
    height:275,
    width:275,
  }
});

module.exports = HomePage;
