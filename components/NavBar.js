'use strict';
import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    StyleSheet,
    Navigator
  } from 'react-native';
import styles from '../styles'

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style = {styles.navContainer}>
        <View style={styles.navbar}>
          <Text onPress={()=>this._navigate()}>Schedule</Text>
          <Text>Two</Text>
          <Text>Three</Text>
        </View>
      </View>
    );
  }

  _navigate(){
    /*this.props.navigator.push({
      name: 'TestScreen', // Matches route.name
    })*/
  }
}

module.exports = NavBar;