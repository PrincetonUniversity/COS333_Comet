// Schedule Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, Image, ListView, TouchableHighlight,
        Modal, ScrollView} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
        Body, Title, Tab, Tabs} from 'native-base';
import styles from '../styles';
import NavBar from '../components/NavBar';
import Firebase from '../components/Firebase';
import EventDisplay from '../components/EventDisplay';
import AddPage from './AddPage';
var moment = require('moment');

class SchedulePage extends Component {
  constructor(props) {
    super(props);
    this.eventsRef = Firebase.database().ref()
    this.state = {
      modalVisible: false,
      allEvents: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      todayEvents: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  // initial state
  componentDidMount() {
    this._listenForEvents(this.eventsRef);
  }

  componentWillUnmount() {
    var userid = Firebase.auth().currentUser.uid
    this.eventsRef.off();
    this.eventsRef.child('/users/' + userid + '/').off();
    this.eventsRef.child('/users/' + userid + '/today/').off();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _navigate(){
    this.props.navigator.push({
      name: 'AddPage'
    })
  }

  _addModal() {
    this.setModalVisible(true)
  }

  _renderEvent(event) {
    return (
      <EventDisplay event={event}></EventDisplay>
    );
  }

  _listenForEvents(eventsRef) {
    var userid = Firebase.auth().currentUser.uid
    var allList = eventsRef.child('/users/' + userid + '/')
    var todayList = eventsRef.child('/users/' + userid + '/today/')
    var today = []

    allList.on('value', (snap) => {
      var allEvents = [];
      // iterates through each event & adds them to an array
      snap.forEach((child) => {
        if (child.key == 'today') {
          todayList.on('value', (snap) => {
            snap.forEach((child) => {
              today.push(child.key);
            });
          });
        }
        else if (child.key != 'name') {
          allEvents.push({
            eventName: child.val().eventName,
            day: child.val().day,
            startDate: child.val().startDate,
            startTime: child.val().startTime,
            endDate: child.val().endDate,
            endTime: child.val().endTime,
            location: child.val().location,
            _key: child.key
          });
        }
      });
      this.setState({
        allEvents: this.state.allEvents.cloneWithRows(allEvents),
      });
    });

    // build list of today events
    allList = eventsRef.child('/users/' + userid + '/')
    allList.on('value', (snap) => {
      var todayEvents = [];
      snap.forEach((child) => {
        if (today.includes(child.key)) {
          todayEvents.push({
            eventName: child.val().eventName,
            day: child.val().day,
            startDate: child.val().startDate,
            startTime: child.val().startTime,
            endDate: child.val().endDate,
            endTime: child.val().endTime,
            location: child.val().location,
            _key: child.key
          });
        }
      });
      this.setState({
        todayEvents: this.state.todayEvents.cloneWithRows(todayEvents),
      });
    });
  }

  render() {
    return (
      <View style = {{flex:1, backgroundColor: '#eaecef'}}>
       <View style = {styles.screenContainer}>
         <View style={styles.titleBar}>
          <View style = {{flex:1, marginTop: 20, marginLeft: 17}}>
          </View>
          <View style = {{flex: 10, marginTop: 20, alignItems: 'center'}}>
             <Text style={styles.titleBarText}>Your Scheduled Events</Text>
          </View>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
            <Icon onPress={()=>this._navigate()} name="add" style={{fontSize: 30, color: 'navy', fontWeight:'bold'}}/>
          </View>
        </View>

        <Text style={{backgroundColor: '#eaecef'}}>Events for Today:</Text>
         <ListView dataSource = {this.state.todayEvents}
                    renderRow={this._renderEvent.bind(this)}
                    enableEmptySections={true}/>

        <Text style={{backgroundColor:'#eaecef'}}>All Events:</Text>
          <ListView dataSource = {this.state.allEvents}
                    renderRow={this._renderEvent.bind(this)}
                    enableEmptySections={true}/>
        </View>
        <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }
}

module.exports = SchedulePage;
