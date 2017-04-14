// Schedule Page

'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text, 
    Image,
    ListView,
    TouchableHighlight
  } from 'react-native';
import styles from '../styles';
import NavBar from '../components/NavBar';
import Firebase from '../components/Firebase';
import EventDisplay from '../components/EventDisplay';
import TitleBar from '../components/TitleBar';

class SchedulePage extends Component {
  constructor(props) {
    super(props);
    this.eventsRef = Firebase.database().ref()
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  // initial state
  componentDidMount() {
    this._listenForEvents(this.eventsRef);
  }

  _navigate(){
    this.props.navigator.push({
      name: 'AddPage'
    })
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
          startTime: child.val().startTime,
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
      <View style = {{flex:1, marginTop: 22}}>
       <View style = {styles.screenContainer}>   
         <TitleBar title='Your Scheduled Events'/>
         <ListView dataSource = {this.state.dataSource} 
                    renderRow={this._renderEvent.bind(this)}/>
        <TouchableHighlight onPress={()=>this._navigate()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Add New Item</Text>
        </TouchableHighlight>


      </View>
         <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }  
}

module.exports = SchedulePage;

