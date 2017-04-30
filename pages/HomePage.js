// Home Page
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text,
    Image
  } from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles';
import Coordinates from '../components/Coordinates';
import Firebase from '../components/Firebase';
import BackgroundTimer from 'react-native-background-timer';
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
    /*if (this.state.todayEvents.length > 0) {
      this._checkTime();
    }*/
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

  render() {
    return (
      <View style = {{flex:1}}>
       <View style = {styles.screenContainer}>
        <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style = {{width: 200, height: 200, justifyContent: 'center'}}
                 source={{uri: 'https://previews.123rf.com/images/natalyon/natalyon1502/natalyon150200013/36745703-Doodle-space-elements-collection-in-black-and-white-ISS-moonwalker-planet-comet-moon-astronaut-alien-Stock-Vector.jpg'}}
          />
          <Text style={{justifyContent: 'center'}}>Welcome to Comet!</Text>
          <Text style={{marginTop: 15, justifyContent: 'center'}}>Your Current Location:</Text>
          <Coordinates/>
        </View>
       </View>
         <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }

}

module.exports = HomePage;
