import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    TouchableHighlight,
    Modal,
    Image,
    StyleSheet
	} from 'react-native';
import styles from '../styles.js';
import ModalExample from './ModalExample'
import { Card, CardItem } from 'native-base';
import { Container, Content, Header, Footer, FooterTab, Button, Icon, Left,
          Right, Body, Title, Tab, Tabs } from 'native-base';
import Firebase from './Firebase'
var moment = require('moment');

class StatsDisplay extends Component {
  constructor(props) {
    super(props);
    this.eventsRef = Firebase.database().ref()
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    //this._renderToday();
  }

  componentWillUnmount() {
    this.eventsRef.child('/users/' + this.userid + '/').off();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _eventDetails(){
    this.setModalVisible(true)
  }

  render() {
    return (
      <View>
        <TouchableHighlight onPress={()=>this._eventDetails()}>
          <View style={localStyles.eventContainer}>
            <View style={localStyles.box1}>
              <Text style={localStyles.eventTitle}>{this.props.event.eventName}</Text>
            </View>
            <View style={localStyles.box2}>
              <Text style={{fontSize: 15, fontFamily:'Avenir', textAlign: 'right', color: 'green'}}>{this.props.event.presences}</Text>
            </View>
            <View style={localStyles.box3}>
              <Text style={{fontSize: 15, fontFamily:'Avenir', textAlign: 'right', color: 'red'}}>{this.props.event.absences}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

var localStyles = StyleSheet.create({
  eventContainer: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: '#eaecef',
    borderBottomWidth: 1,
    height: 45,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  eventRow: {
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eaecef',
    flexDirection: 'row'
  },
  eventTitle: {
    fontSize: 15,
    fontFamily:'Avenir'
  },
  present: {
    fontSize: 15,
    fontFamily:'Avenir',
    color: 'green'
  },
  absent: {
    fontSize: 15,
    fontFamily:'Avenir',
    color: 'red'
  },
  box1: {
    flex:10,
    paddingLeft: 15,
  },
  box2: {
    flex:1,
  },
  box3: {
    flex:1,
    paddingRight: 15,
  }
})

module.exports = StatsDisplay;
