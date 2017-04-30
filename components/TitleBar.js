import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    TouchableHighlight,
    StyleSheet
	} from 'react-native';
import styles from '../styles.js';

class TitleBar extends Component {
  render() {
    return (
      <View style={localStyles.titleBar}>
        <Text style={styles.titleBarText}>{this.props.title}</Text>
      </View>
    );
  }
}

var localStyles = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    backgroundColor: '#eaecef',
    borderColor: 'gray',
    borderBottomWidth: .5,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 22
  },
})


module.exports = TitleBar;
