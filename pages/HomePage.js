// Home Page
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
      counter: 0
    }
    this.userid = Firebase.auth().currentUser.uid
    this.currentEvent = null
    this.counter = 0
  }

  componentWillMount() {
    console.log("IM MOUNTING");
    this._renderToday();
  }

  componentDidMount() {
    console.log("I'VE MOUNTED");
    //if (this.state.todayEvents.length > 0)

    var checkTime = () => {
      console.log("HELLO" + checkTime)
      //BackgroundTimer.setTimeout(checkTime, 1000);
    }
    //BackgroundTimer.setTimeout(()=>{}, 1000)
    //checkTime();
  }

  // rendering of firebase list of today's events
  _renderToday() {
    this.userid = Firebase.auth().currentUser.uid
    this.eventsRef = Firebase.database().ref()
    this.eventsRef.child('/users/' + this.userid + '/').on('value', (snap) => {
      var todayEvents = []
      var today = new Date()
      var dayOfWeeksList = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat']
      var dayOfWeek = dayOfWeeksList[today.getDay()]
      var t = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear()
      var todayDate = moment(t, "MM/DD/YYYY")

      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
          var cStartDate = moment(child.val().startDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cEndDate = moment(child.val().endDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cDays = child.val().day

          // within repeat duration and correct day of week
          var count = 0
          if (todayDate >= cStartDate && todayDate <= cEndDate) {
            if(cDays.includes(" ") || cDays.includes(dayOfWeek)) {
              // push event to list
              todayEvents.push({
                startTime: moment(child.val().startTime, "h:mm A"),
                _key: child.key
              });
              // push event to Firebase
              Firebase.database().ref('users/' + this.userid + '/today/').update({
                [child.key]: moment(child.val().startTime, 'h:mm A').format('h:mm A')
              });
              count = count + 1
            }
          }
          if (count == 0) {
            Firebase.database().ref('users/' + this.userid + '/today/').update({
              none: null
            });
          }
        }
      });
      this.setState({
        todayEvents: todayEvents,
        loadedToday: true
      })
      if (todayEvents.length > 0) {
        this.currentEvent = todayEvents[0]
      }
    });
    //console.log("EXCUSE ME: " + todayEvents.length);
  }

/*  _checkTime = () => {
    if (moment() >= this.currentEvent.startTime) {
      //console.log("this event: " + this.currentEvent._key);
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
        this.currentEvent = newEvent, //<--CHANGE THIS TO UPDATE FIREBASE EVENT
        this.counter = newCounter
      }
       // only update timer when seen event
    }
    else {
      //console.log("no match");
    }
    //BackgroundTimer.setTimeout(this._checkTime(), 100000)
  }

  _changeInterval() {
    // when interval is negative...?
    return(
       moment(this.currentEvent.startTime).diff(moment()) //<--CHANGE TO FIREBASE CALL
     );
  }*/

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
