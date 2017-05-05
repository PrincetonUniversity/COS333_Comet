// Home Page


/*

    WORK ON: MAKE SURE THAT IF A NEW EVENT IS ADDED, IT WILL "GO OUT OF TOMORROW"

*/
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text,
    Image, TouchableHighlight
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
      counter: 0,
      loadedToday: false,
    }
    this.userid = Firebase.auth().currentUser.uid
    this.currentEvent = null
    this.counter = 0
  }

  componentWillMount() {
    console.log("IM MOUNTING");
    this._renderToday();
  }

  // componentWillUnmount TO GET RID OF WARNINGS

  componentDidMount() {
    console.log("I'VE MOUNTED");

    if (this.state.todayEvents.length > 0) {
      console.log("I'M DOING STUFF ");
        var checkTime = () => {
          var currentEvent = this.currentEvent.startTime
          console.log(currentEvent.format('h:mm A'))
          if (moment() >= currentEvent) {
            console.log("this event: " + this.currentEvent._key);
            if (this.counter == this.state.todayEvents.length-1) {
              // no more events left; next event is "tomorrow"
              console.log("going to tomorrow")
              this.currentEvent = {
                  startTime: moment().add(1, 'days').hours(0).minutes(0).second(0).millisecond(0),
                  _key: 'tomorrow'
              }
              return;
            }
            else {
              console.log("match")
              var newCounter = this.counter + 1
              console.log("counter: " + newCounter);
              var newEvent = this.state.todayEvents[newCounter]
              this.currentEvent = newEvent,
              this.counter = newCounter
            }
          }
          else {
            console.log("no match");
          }
          BackgroundTimer.setTimeout(checkTime, this._changeInterval())
        }
      checkTime();
    }
  }

  _changeInterval() {
    return(
       moment(this.currentEvent.startTime).diff(moment()) //<--CHANGE TO FIREBASE CALL
     );
  }

  _renderToday() {
    var todayList = Firebase.database().ref().child('/users/' + this.userid + '/today')
    var realThis = this
    todayList.on('value', (snap) => {
      var todayEvents = [];
      snap.forEach((child) => {
        todayEvents.push({
          startTime: moment(child.val(), "h:mm A"),
          _key: child.key
        });
      });
      realThis.setState({
        todayEvents: todayEvents,
      });
      if (todayEvents.length > 0) {
        realThis.currentEvent = todayEvents[0]
      }
    });
  }

  _logout() {
    console.log("Inside logout")
    var userid = Firebase.auth().currentUser.uid
    Firebase.database().ref().child('/users/' + userid + '/today/').off();
    // logout, once that is complete, return the user to the login screen.
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
       </View>
         <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }
}

module.exports = HomePage;
