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
          <Text onPress={()=>this._navigate("SchedulePage")}>Schedule</Text>
          <Text onPress={()=>this._navigate("HomePage")}>Home</Text>
          <Text onPress={()=>this._navigate("StatsPage")}>Stats</Text>
        </View>
      </View>
    );
  }

  _navigate(page){
    this.props.navigator.replace({
      name: page
    })
  }
}

module.exports = NavBar;