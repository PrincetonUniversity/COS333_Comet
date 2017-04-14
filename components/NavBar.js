'use strict';
import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    StyleSheet,
    Navigator
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
          <Icon onPress={()=>this._navigate("HomePage")} name="home" style={{fontSize: 20, color: 'black'}}/>
          <Icon onPress={()=>this._navigate("SchedulePage")} name="calendar" style={{fontSize: 20, color: 'black'}}/>
          <Icon onPress={()=>this._navigate("StatsPage")} name="stats" style={{fontSize: 20, color: 'black'}}/>
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