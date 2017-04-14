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
  Tabs
} from 'native-base';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import NavBar from '../components/NavBar';

class StatsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={{flex:1}}>
        <Container style={{flex:9}}>
            <Header style={{ backgroundColor: 'gray' }}>
              <Left>
                <Button transparent>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>Attendance Stats</Title>
              </Body>
              <Right />
            </Header>
            
            <Text> </Text>
            <Text> </Text>
            
            <Body>
              <Icon ios='ios-ionic' android="md-ionic" style={{fontSize: 300, color: 'gray'}}/>
            </Body>

            <Content />
            <Body>
            <Button style={{backgroundColor: 'gray'}}>
              <Text> 78 Absences </Text>
            </Button>
            </Body>
          </Container>
          <NavBar navigator={this.props.navigator}/>
        </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


module.exports = StatsPage;
