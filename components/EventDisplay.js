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
import { Container, Content, Header, Footer, FooterTab, Button, Icon, Left,
          Right, Body, Title, Tab, Tabs, Card, CardItem, H3} from 'native-base';
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
           <View style={localStyles.cardBackground}>
              <View style={localStyles.cardBody}>
                <View style={{alignItems: 'flex-end'}}>
                  <Icon onPress={()=>this.setModalVisible(!this.state.modalVisible)} name="close"/>
                </View>

                <View style={{alignItems: 'center'}}>
                  <H3 style={{fontSize: 18, color: '#7D7F94'}}>{this.props.event.eventName}</H3>
                </View>

                <View style={{marginTop:10}}>
                  <Text style={localStyles.eventText}>{locationText}</Text>
                  <Text style={localStyles.eventText}>{sTime} to {eTime}</Text>
                  <Text style={localStyles.eventText}>{dayDisplay}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent: 'space-around', marginTop: 40}}>

                  <Button block onPress={()=>this._deleteEvent()}>
                      <Text style={{color: 'white'}}>Delete</Text>
                  </Button>
                  <Button block onPress={()=>{}}>
                      <Text style={{color: 'white'}}>Edit</Text>
                  </Button>


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
  cardBackground: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardBody: {
    flex:1,
    backgroundColor: 'white',
    borderColor: '#eaecef',
    borderWidth: 1,
    paddingTop: 10,
    padding: 15,
    margin: 40,
    marginTop: 80,
    marginBottom: 80,
  },
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
  // titleText: {
  //   fontSize: 15,
  //   alignItems: 'center',
  // },
  eventText: {
    fontSize: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#483D8B',
    alignItems: 'center',
    marginTop: 10,
  },
})

module.exports = EventDisplay;
