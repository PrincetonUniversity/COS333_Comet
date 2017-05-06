// Home Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, StatusBar, Image, ListView, TouchableHighlight,
        Modal, StyleSheet} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
          Body, Title, Tab, Tabs, H1, H2, H3} from 'native-base';
import NavBar from '../components/NavBar';
import styles from '../styles';
import Coordinates from '../components/Coordinates';
import Firebase from '../components/Firebase';
import BackgroundTimer from 'react-native-background-timer';
// import LinearGradient from 'react-native-linear-gradient';
// import Settings from '../components/Settings';
var moment = require('moment');

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state={
      loading: false,
      currentEvent: null, //currentEvent is a {moment, key}
      todayEvents: [], // {startTime: moment, _key: key}
      counter: 0
    }
    this.userid = Firebase.auth().currentUser.uid
    this.currentEvent = null,
    this.counter = 0
  }

  componentWillMount() {
    console.log("IM MOUNTING");
    this._renderToday();
  }

  componentDidMount() {
    BackgroundTimer.setTimeout((()=>{console.log("tic")}), 1000);
  }

  componentWillUnmount() {
    var userid = Firebase.auth().currentUser.uid
    Firebase.database().ref().child('/users/' + userid + '/today/').off();
  }

  // build list of today events
  _renderToday() {
    var todayList = Firebase.database().ref().child('/users/' + this.userid + '/today')
    todayList.on('value', (snap) => {
      var todayEvents = [];
      snap.forEach((child) => {
        todayEvents.push({
          startTime: moment(child.val(), "h:mm A"),
          _key: child.key
        });
      });
      this.setState({
        todayEvents: todayEvents,
      });
      if (todayEvents.length > 0) {
        this.currentEvent = todayEvents[0]
      }
    });
  }

  _checkTime = () => {
    //var timerExists = true;
    console.log("CURRENT STATE ", this.state)
    if (moment() >= this.currentEvent.startTime) {
      console.log("state 1");
      console.log("this event: " + this.currentEvent._key);
      if (this.counter == this.state.todayEvents.length-1) {
        const timeoutId = BackgroundTimer.setTimeout(() => {
    // this will be executed once after 10 seconds
    // even when app is the the background
  	     console.log('tac');}, 10000);
        return(BackgroundTimer.clearTimeout(timeoutId));
      }
      var newCounter = this.counter + 1
      var newEvent = this.state.todayEvents[newCounter]
        //duration: moment.duration(15000).seconds(),
      console.log("next event: " + newEvent._key);
      this.currentEvent = newEvent, //<--CHANGE THIS TO UPDATE FIREBASE EVENT
      this.counter = newCounter
    }
    else {
      console.log("state 2");
    }
    BackgroundTimer.setTimeout(this._checkTime(), this._changeInterval());
  }

  _changeInterval() {
    return(
       moment(this.currentEvent.startTime).diff(moment()) //<--CHANGE TO FIREBASE CALL
       //interval = 1000
     );
  }

  // _navigate(){
  //   this.props.navigator.push({
  //     name: 'Settings'
  //   })
  // }
  // _renderEvent(event) {
  //   return (
  //     <Settings event={event}></Settings>
  //   );
  // }

  render() {
    return (
      <View style={styles.container}>
      <Container style={{flex:10}}>
          <Header style={{ backgroundColor: '#483D8B', }}>
            <Left>
              <View>
                <Icon name="ios-settings" style={{fontSize: 30, color: 'white', fontWeight:'bold'}}/>
              </View>
            </Left>
            <Body>
              <Title style={{color: 'white'}}>Comet</Title>
            </Body>
            <Right/>
          </Header>
          <StatusBar
             barStyle="light-content"
          />

          <View style={localStyles.background}>
            <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={localStyles.welcome}>Hi, Margaret!</Text>
              <Image style = {{width: 250, height: 250, justifyContent: 'center'}}
                source={{uri: 'stars'}}
              />
              <Text style={{marginTop: 15, justifyContent: 'center'}}>Your Current Location:</Text>
              <Coordinates/>
            </View>
          </View>
        </Container>
        <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  welcome: {
    justifyContent: 'center',
    fontSize: 25,
    color: 'rgba(255,255,255,0.7)'
  },
  background: {
		flex:10,
		flexDirection: 'column',
		backgroundColor: '#8F8FBC',
	},
  // linearGradient: {
  //   flex: 1,
  //   paddingLeft: 15,
  //   paddingRight: 15,
  //   borderRadius: 5
  // },
})

module.exports = HomePage;
