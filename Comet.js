// Setup: Initialize Navigation

import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator
  } from 'react-native';
import HomePage from './pages/HomePage';

class Comet extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ name: 'HomePage' }}
        renderScene = { this.renderScene } />
    )
  }

  renderScene(route, navigator) {
    if (route.name == 'HomePage') {
      return <HomePage navigator={navigator} />
    }
    if (route.name == 'AddScreen') {
      return <AddScreen navigator={navigator} />
    }
  }       
}

AppRegistry.registerComponent('Comet', () => Comet);
