// Schedule Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, Image, ListView, TouchableHighlight,
        Modal} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
        Body, Title, Tab, Tabs} from 'native-base';
import styles from '../styles';
import NavBar from '../components/NavBar';
import Firebase from '../components/Firebase';
import EventDisplay from '../components/EventDisplay';
import AddPage from './AddPage';

class SchedulePage extends Component {
  constructor(props) {
    super(props);
    this.eventsRef = Firebase.database().ref()
    this.state = {
      modalVisible: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  // initial state
  componentDidMount() {
    this._listenForEvents(this.eventsRef);
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
    eventsRef.on('value', (snap) => {
      var events = [];
      // iterates through children & adds them to an array
      snap.forEach((child) => {
        events.push({
          eventName: child.val().eventName,
          day: child.val().day,
          startDate: child.val().startDate,
          startTime: child.val().startTime,
          endDate: child.val().endDate,
          endTime: child.val().endTime,
          location: child.val().location,
          _key: child.key
        });
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(events)
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

         <ListView dataSource = {this.state.dataSource}
                    renderRow={this._renderEvent.bind(this)}/>
        </View>
        <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }
}

module.exports = SchedulePage;
