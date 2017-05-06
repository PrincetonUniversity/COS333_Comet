// Schedule Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, Image, ListView, TouchableHighlight,
        Modal, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
        Body, Title, Tab, Tabs, Card, CardItem} from 'native-base';
import styles from '../styles';
import Firebase from '../components/Firebase';
import Drawer from 'react-native-drawer';

class Settings extends Component {
  render() {
        return (
          //Material Design Style Drawer
          <Drawer
            type="overlay"
            openDrawerOffset={50} //50px gap on the right side of drawer
            panCloseMask={1} //can close with right to left swipe anywhere on screen
            styles={{
              drawer: {
                shadowColor: "#000000",
                shadowOpacity: 0.8,
                shadowRadius: 0,
              }
            }}
            tweenHandler={(ratio) => {
              return {
                drawer: { shadowRadius: Math.min(ratio*5*5, 5) },
                main: { opacity:(2-ratio)/2 },
              }
            }}
            content={<ControlPanel />}
            >
              <Main />
          </Drawer>
        );
    }
}

module.exports = Settings;
