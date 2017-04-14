import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    TouchableHighlight,
	} from 'react-native';
import styles from '../styles.js';

class TitleBar extends Component {
  render() {
    return (
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>{this.props.title}</Text>
      </View>
    );
  }
}

module.exports = TitleBar;