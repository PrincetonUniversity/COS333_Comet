'use strict';
import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    StyleSheet
  } from 'react-native';
import styles from '../styles'

class NavBar extends Component {
  render() {
    return (
      <View>
        <View style={styles.navbar}>
          <Text style = {{justifyContent:'center'}}>This is the NavBar</Text>
        </View>
      </View>
    );
  }
}

module.exports = NavBar;