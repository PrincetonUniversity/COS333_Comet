
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
import Time from './pages/Time';
var moment = require('moment');

class Comet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
    }
  }

  componentWillMount() {
    console.log("IM MOUNTING");
    const unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
      // If the user is logged in take them to the home screen
      if (user != null) {
        this.setState({page: 'HomePage'});
        return;
      }
      // otherwise have them login
      this.setState({page: 'LoginPage'});
      unsubscribe();
    });
  }

  componentDidMount () {
    BackgroundTimer.setTimeout(()=>{console.log('tic')}, 100);
  }

  render() {
      /*return (
        <View>
          <Time/>
        </View>
      );*/
    if (this.state.page) {
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
