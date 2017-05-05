/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

//backround timer
//npm i react-native-background-timer --save
// react-native link
//moment.js
//npm install moment

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
// import Firebase from '../components/Firebase';
// import styles from '../styles';
//import KeepAwake from "react-native-keep-awake";
import BackgroundTimer from 'react-native-background-timer';

moment = require('moment');

var events = [
// { years:2017, months:4, date:2, hours:11, minutes:53, seconds:50, milliseconds:0, },
// { years:2017, months:4, date:2, hours:11, minutes:53, seconds:55, milliseconds:0, },
// { years:2017, months:4, date:2, hours:11, minutes:54, seconds:30, milliseconds:0, },
// { years:2017, months:4, date:2, hours:11, minutes:55, seconds:30, milliseconds:0, },
// { years:2017, months:4, date:2, hours:12, minutes:1, seconds:30, milliseconds:0, },
{ years:2017, months:4, date:4, hours:22, minutes:50, seconds:30, milliseconds:0, },
{ years:2017, months:4, date:4, hours:22, minutes:51, seconds:30, milliseconds:0, },
{ years:2017, months:4, date:4, hours:22, minutes:52, seconds:50, milliseconds:0, },
];

var eventCounter = 0;

interval = 1000;

export default class Time extends Component {
  constructor(props) {
      super(props);
      this.state = {
        event: moment(events[0]),
      };
      //this.eventsRef = Firebase.database().ref()
    }

  componentWillMount() {
    console.log("IM MOUNTING");
  }
  componentWillUnmount() {
    console.log("GOODBYE")
  }
  componentDidMount() {

  checkTime = () => {
    timerExists = true;
    console.log("CURRENT STATE ", this.state)
    if ((moment().format('MMMM Do YYYY, h:mm')) === (moment(this.state.event).format('MMMM Do YYYY, h:mm'))) {
      console.log("state 1");
      this.setState({
        //duration: moment.duration(15000).seconds(),
        event: moment(events[eventCounter++]),
        // event.hours: 0
      });

    //   this.eventsRef.on('value', (snap) => {
    //   var events = [];
    //   // iterates through children & adds them to an array
    //   snap.forEach((child) => {
    //     events.push({
    //       eventName: child.val().eventName,
    //       day: child.val().day,
    //       startDate: child.val().startDate,
    //       startTime: child.val().startTime,
    //       endDate: child.val().endDate,
    //       endTime: child.val().endTime,
    //       location: child.val().location,
    //       _key: child.key
    //     });
    //   });
    // })
    }
    else {
      console.log("state 2");
      this.setState({
        //event: moment().add(1, 'days').hours(0).minutes(5).seconds(4),
      });
    }

    // if (eventCounter < events.length) {
      BackgroundTimer.setTimeout(checkTime, this.changeInterval());
    // }
    // else {
    //   BackgroundTimer.setTimeout(checkTime, this.changeInterval(moment().add(2, 'minutes')));
    // }

  }
  checkTime();
}

  changeInterval() {
    return(
       interval = moment(this.state.event).diff(moment())
       //interval = 1000
      );
  }

  render() {
    return (
      <View>

        <Text>{Date(this.state.event)}</Text>

        <Text>Current Time</Text>
        <Text>{moment().format('MMMM Do YYYY, h:mm:ss a')}</Text>
        <Text>Event Time</Text>
        <Text>{moment(this.state.event).format('MMMM Do YYYY, h:mm:ss a')}</Text>

        <Text>{interval}</Text>

      </View>
    );
  }
}

module.exports = Time;
