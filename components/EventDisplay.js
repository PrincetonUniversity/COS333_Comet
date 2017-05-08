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

class EventDisplay extends Component {
  constructor(props) {
    super(props);
    this.eventsRef = Firebase.database().ref()
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _eventDetails(){
    this.setModalVisible(true)
  }

  _deleteEvent() {
    var userid = Firebase.auth().currentUser.uid
    var key = this.props.event._key
    Firebase.database().ref('/users/' + userid + '/').child(key).remove()
    Firebase.database().ref('/users/' + userid + '/today/').child(key).remove()
    this.setModalVisible(!this.state.modalVisible)
  }

  _editEvent() {
    this.setModalVisible(!this.state.modalVisible);
    this.props.navigator.push({
      name: 'EditPage',
      passProps: {
        eventName: this.props.event.eventName,
        location: this.props.event.location,
        days: this.props.event.day,
        keyID: this.props.event._key,
        startTime: this.props.event.startTime,
        endTime: this.props.event.endTime,
        checkEdited: this._checkEdited.bind(this),
      }
    })
  }

  _checkEdited(eventName, location, days, key, startDate, endDate) {
    var scheduleData = {
      eventName: eventName,
      location: location,
      startDate: startDate.toLocaleDateString(),
      startTime: startDate.toLocaleTimeString(),
      endDate: endDate.toLocaleDateString(),
      endTime: endDate.toLocaleTimeString(),
      day: days,
    };

    var userid = Firebase.auth().currentUser.uid
    Firebase.database().ref('/users/' + userid + '/today/').child(key).remove()
    Firebase.database().ref().child('/users/' + userid + '/' + key).update(scheduleData);
  }

  render() {
    var sTime = moment(this.props.event.startTime, 'h:mm A').format('h:mm A')
    var sDate = moment(this.props.event.startDate, 'MM/DD/YYYY').format('MM/DD/YYYY')
    var eTime = moment(this.props.event.endTime, 'h:mm A').format('h:mm A')
    var eDate = moment(this.props.event.endDate, 'MM/DD/YYYY').format('MM/DD/YYYY')

    // format date
    if (this.props.event.day.includes(" ")) {
      var dayDisplay = ""
    }
    else if (sDate == eDate) {
      str = ""
      for (var i = 0; i < this.props.event.day.length; i++) {
        str = str + this.props.event.day[i]
        if (i < (this.props.event.day.length-1)) str = str + ', '
      }
      var dayDisplay = "repeats " + str
    }
    else {
      str = ""
      for (var i = 0; i < this.props.event.day.length; i++) {
        str = str + this.props.event.day[i]
        if (i < (this.props.event.day.length)-1) str = str + ', '
      }
      var dayDisplay = "repeats " + str + " from " + sDate + " to " + eDate
    }

    // format location
    var name = this.props.event.location.name.split(', ')
    var top = name[0]
    var bottom = ""
    for (var i = 1; i < name.length; i++) {
      bottom = bottom + name[i]
      if (i < name.length-1){
        bottom = bottom + ', '
      }
    }
    var locationText = top + '\n' + bottom

    return (
      <View>
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}>
           <View style={styles.cardBackground}>
              <View style={styles.cardBody}>
                <View style={{alignItems: 'flex-end'}}>
                  <Icon onPress={()=>this.setModalVisible(!this.state.modalVisible)} name="close" style={{fontSize: 30, fontWeight:'bold', color: 'black'}}/>
                </View>

                <View style={{alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>{this.props.event.eventName}</Text>
                </View>

                <View style={{marginTop:10}}>
                  <Text style={localStyles.locationText}>{locationText}</Text>
                  <Text style={localStyles.eventText}>from {sTime} to {eTime}</Text>
                  <Text style={localStyles.eventText}>{dayDisplay}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                  <TouchableHighlight onPress={()=>this._deleteEvent()}
                                      style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Delete</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={()=>this._editEvent()}
                                      style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Edit</Text>
                  </TouchableHighlight>
                </View>
              </View>
           </View>
        </Modal>

        <TouchableHighlight onPress={()=>this._eventDetails()}>
          <View style={localStyles.eventContainer}>
            <Text style={localStyles.titleText}>{this.props.event.eventName}</Text>
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  eventCard: {
    flex:1,
    backgroundColor: 'white',
    borderColor: '#eaecef',
    borderWidth: 1,
    padding: 35,
    margin: 35,
  },
  titleText: {
    fontSize: 15,
    alignItems: 'center',
  },
  eventText: {
    fontSize: 13,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: 'navy',
    alignItems: 'center',
  },
})

module.exports = EventDisplay;
