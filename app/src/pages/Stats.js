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
  //Text,
  View
} from 'react-native';


export default class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
        <Container>
            <Header hasTabs style={{ backgroundColor: 'gray' }}>
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

            <Footer style={{ backgroundColor: 'gray' }}>
                <FooterTab>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon name="apps" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon ios='ios-analytics' android="md-analytics" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon ios='ios-grid' android="md-grid" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon name="person" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
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

AppRegistry.registerComponent('Stats', () => Stats);
