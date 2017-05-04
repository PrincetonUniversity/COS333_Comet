// Stats Page
'use strict';
import React, { Component } from 'react';
import {
  Container,
  Content,
  Header,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  Title,
  Tab,
  Tabs,
} from 'native-base';
import {
  AppRegistry,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles';


class StatsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

        <View style={styles.container}>
        <Container style={{flex:10}}>
            <Header style={{ backgroundColor: '#483D8B' }}>
              <Left/>
              <Body>
                <Title style={{color: 'white'}}>Attendance</Title>
              </Body>
              <Right/>
            </Header>
            <StatusBar
               barStyle="light-content"
            />

            <Text></Text>
            <Text></Text>

            <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Body>
                <Icon ios='ios-ionic' android="md-ionic" style={{fontSize: 300, color: '#5CACEE'}}/>
              </Body>
              <Content/>
              <Body>
                <Button rounded style={{backgroundColor: '#5CACEE', alignItems: 'center'}}>
                  <Text> 78 Absences </Text>
                </Button>
              </Body>
            </View>

          </Container>
          <NavBar navigator={this.props.navigator}/>
        </View>
    );
  }
}

module.exports = StatsPage;
