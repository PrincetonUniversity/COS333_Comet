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

  render() {
    var sTime = moment(this.props.event.startTime, 'h:mm A').format('h:mm A')
    var eTime = moment(this.props.event.endTime, 'h:mm A').format('h:mm A')
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
                  <Text style={localStyles.eventText}>Location: {this.props.event.location}</Text>
                  <Text style={localStyles.eventText}>Time: {sTime} - {eTime}</Text>
                  <Text style={localStyles.eventText}>Days: {this.props.event.day}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                  <TouchableHighlight onPress={()=>this._deleteEvent()}
                                      style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Delete</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={()=>{}}
                                      style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Edit</Text>
                  </TouchableHighlight>
                </View>
              </View>
           </View>
        </Modal>

        <TouchableHighlight onPress={()=>this._eventDetails()}>
          <View style={localStyles.eventContainer}>
            <Text style={localStyles.eventText}>{this.props.event.eventName}</Text>
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
  eventText: {
    fontSize: 15,
    alignItems: 'center',
  },
})

module.exports = EventDisplay;
