
// Setup: Initialize Navigation
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    Text,
    View,
  } from 'react-native';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SchedulePage from './pages/SchedulePage';
import AddPage from './pages/AddPage';
import StatsPage from './pages/StatsPage';
import LocationSearchPage from './pages/LocationSearchPage';
import Firebase from './components/Firebase';
import Loading from './components/Loading';
import BackgroundTimer from 'react-native-background-timer';
var moment = require('moment');

class Comet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
      loadedToday: false,
    }
  }

  componentWillMount() {
    console.log("IM MOUNTING");
    const unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
      // If the user is logged in take them to the home screen
      if (user != null) {
        this.setState({page: 'HomePage'});
        this._renderToday();
        return;
      }
      // otherwise have them login
      this.setState({page: 'LoginPage'});
      unsubscribe();
    });
  }

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
              // push event to Firebase
              Firebase.database().ref('users/' + this.userid + '/today/').update({
                [child.key]: moment(child.val().startTime, 'h:mm A').format('h:mm A')
              });
              count = count + 1
            }
          }
          // if not today, but still in today list, delete.
          else {
            Firebase.database().ref('/users/' + this.userid + '/today/').child(child.key).remove()
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
    if (this.state.page == 'HomePage') {
      if (this.state.loadedToday) {
        return (
          <Navigator
            initialRoute={{name: this.state.page}}
            renderScene = { this.renderScene }
          />
        )
      }
      else {
        return <Loading/>
      }
    }
    else if (this.state.page == 'LoginPage'){
      return (
        <Navigator
          initialRoute={{name: this.state.page}}
          renderScene = { this.renderScene }
        />
      )
    } else {
      return (
        <Loading/>
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
  }
}

AppRegistry.registerComponent('datepicker', () => Comet);
