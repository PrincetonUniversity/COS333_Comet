'use strict';
import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    StyleSheet,
    Navigator,
    ActivityIndicator,
  } from 'react-native';
import styles from '../styles';

class Loading extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator/>
      </View>
    );
  }
}

module.exports = Loading;
