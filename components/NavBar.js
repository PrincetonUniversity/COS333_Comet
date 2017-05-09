'use strict';
import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    StyleSheet,
    Navigator, TouchableOpacity
  } from 'react-native';
import styles from '../styles';
import {
  Container,
  Content,
  Header,
  Footer,
  FooterTab,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Title,
  Tab,
  Tabs
} from 'native-base';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style = {styles.navContainer}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={()=>this._navigate("HomePage")} style={{flex:1, alignItems:'center'}}>
            <Icon name="home" style={{fontSize: 20, color: 'white'}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this._navigate("SchedulePage")} style={{flex:1, alignItems:'center'}}>
            <Icon name="calendar" style={{fontSize: 20, color: 'white'}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this._navigate("StatsPage")} style={{flex:1, alignItems:'center'}}>
            <Icon name="stats" style={{fontSize: 20, color: 'white'}}/>
          </TouchableOpacity>
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
