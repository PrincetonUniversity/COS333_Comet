// Setup: Initialize Navigation
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    Text,
    View
  } from 'react-native';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SchedulePage from './pages/SchedulePage';
import AddPage from './pages/AddPage';
import StatsPage from './pages/StatsPage';
import LocationSearchPage from './pages/LocationSearchPage';
import Firebase from './components/Firebase'
// import Settings from './components/Settings'

var moment = require('moment');

class Comet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadedUser: false,
      user: null,
      loadedToday: false,
    }
  }

  componentWillMount() {
    console.log("IM MOUNTING");
  }
  componentWillUnmount() {
    console.log("GOODBYE")
  }

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user)=>this._func(user));
  }

  _func(user) {
    if (user) {
      this.setState({
        loadedUser: true,
        user: user
      });
      this._renderToday();
    }
    else {
      this.setState({
        loadedUser: true
      });
    }
  }

  // rendering of today's events
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
        if (child.key != 'name' && child.key != 'today') {
          var cStartDate = moment(child.val().startDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cEndDate = moment(child.val().endDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cDays = child.val().day

          // within repeat duration and correct day of week
          var count = 0
          if (todayDate >= cStartDate && todayDate <= cEndDate) {
            if(cDays.includes(" ") || cDays.includes(dayOfWeek)) {
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
        loadedToday: true
      })
    });
  }

  render() {
    console.log("in render");
    let route = this.state.user ? {name: 'HomePage'} : {name: 'LoginPage'}
    // loading screen
    if (!this.state.loadedToday) {
      console.log("Loaded today!");
      return (
        <Navigator
          initialRoute={{ name: 'LoginPage' }}
          renderScene = { this.renderScene }
        />
      )
    } else {
      console.log("not loaded today");
      return (
        <Navigator
          initialRoute={route}
          renderScene = { this.renderScene }
        />
      )
    }
  }

  renderScene(route, navigator) {
    if (route.name == 'LoginPage') {
      return <LoginPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'SignupPage') {
      return <SignupPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'HomePage') {
      return <HomePage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'SchedulePage') {
      return <SchedulePage navigator={navigator} {...route.passProps}  />
    }
    if (route.name == 'AddPage') {
      return <AddPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'StatsPage') {
      return <StatsPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'LocationSearchPage') {
      return <LocationSearchPage navigator={navigator} {...route.passProps} />
    }
    // if (route.name == 'Settings') {
    //   return <Settings navigator={navigator} {...route.passProps} />
    // }
  }
}

AppRegistry.registerComponent('Comet', () => Comet);
