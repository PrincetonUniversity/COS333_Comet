// Setup: Initialize Navigation
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    Text
  } from 'react-native';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

class Comet extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ name: 'LoginPage' }}
        renderScene = { this.renderScene } 
      />
    )
  }

  renderScene(route, navigator) {
    if (route.name == 'LoginPage') {
      return <LoginPage navigator={navigator} />
    }
    if (route.name == 'HomePage') {
      return <HomePage navigator={navigator} />
    }
    if (route.name == 'SignupPage') {
      return <SignupPage navigator={navigator} />
    }
  }  

}

AppRegistry.registerComponent('Comet', () => Comet);
