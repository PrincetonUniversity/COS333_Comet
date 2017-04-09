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
      <View style = {styles.navContainer}>
        <View style={styles.navbar}>
          <Text>One</Text>
          <Text>Two</Text>
          <Text>Three</Text>

        </View>
      </View>
    );
  }
}

module.exports = NavBar;