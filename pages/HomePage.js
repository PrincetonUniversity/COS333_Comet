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
import Loading from '../components/Loading';

var moment = require('moment');
var img0 = require('../constellation0.png')
var img1 = require('../constellation1.png')
var img2 = require('../constellation2.png')
var img3 = require('../constellation3.png')
var img4 = require('../constellation4.2.png')
var img5 = require('../constellation5.png')
var img6 = require('../constellation6.png')
var img7 = require('../constellation7.png')

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.userid = Firebase.auth().currentUser.uid
    this.currentEvent = null,
    this.counter = 0
    this.imgArray = [img0, img1, img2, img3, img4, img5, img6, img7]
    this.streak = 0
    this.state = {
      checked: false
    }
  }

  componentDidMount() {
    var streak = 0
    var allList = Firebase.database().ref().child('/users/' + this.userid + '/')
    allList.on('value', (snap) => {
      snap.forEach((child) => {
        if (child.key == 'counter') {
          streak = child.val();
          this.streak = streak
          this.setState({
            checked: true
          })
        }
      });
    });
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

    var streak = this.streak
    var index = 0
    var allList = Firebase.database().ref().child('/users/' + this.userid + '/')
    allList.once('value', (snap) => {
      snap.forEach((child) => {
        if (child.key == 'counter') {
          streak = child.val();
          index = child.val() % 7
          this.streak = streak
        }
      });
    });

    var img = this.imgArray[index]
    //require('../constellation4.2.png')
    if (this.state.checked == true) {
    return (
      <View style={{flex:1}}>
        <Image source={require('../skybg.jpeg')} style={localStyles.imageContainer}>
          <View style={{flex:1, flexDirection:'row', backgroundColor: 'transparent'}}>
            <View style={{flex:1, flexDirection:'row', alignItems: 'center', paddingLeft: 20, paddingTop: 21}}>
              <TouchableOpacity onPress={this._logout.bind(this)} style={{flexDirection: 'row', alignItems:'center'}}>
                <Icon name="ios-power" style={{fontSize: 25, color: 'white', fontWeight:'bold'}}/>
                <Text style={{color:'white', fontSize: 20, fontFamily:'Avenir'}}>  logout</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex:10, alignItems: 'center'}}>
            <Text style={{color:'white', fontSize: 35, fontFamily:'Avenir-medium', paddingTop: 45}}>hello nina</Text>
            <Text style={{color:'white', fontSize: 40, fontFamily:'Avenir-medium', paddingBottom: 20}}> {date} </Text>
            <Image source={img} style={localStyles.graphic}/>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Icon name="star" style={{fontSize: 33, color: 'white', fontWeight:'bold', paddingTop:50}}/>
              <Text style={{color:'white', fontSize: 33, fontFamily:'Avenir-medium', paddingTop: 50}}> {streak} </Text>
            </View>
          </View>
        </Image>
        <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }
  else return( <Loading/>)
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
    height:300,
    width:300,
  }
});

module.exports = HomePage;
