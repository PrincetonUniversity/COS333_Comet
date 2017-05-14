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
        sDate: this.props.event.startDate,
        eDate: this.props.event.endDate,
        checkEdited: this._checkEdited.bind(this),
      }
    })
  }

  _checkEdited(eventName, location, days, key, startDate, endDate, startTime, endTime) {
    var scheduleData = {
      eventName: eventName,
      location: location,
      startDate: startDate.toLocaleDateString(),
      startTime: startTime.toLocaleTimeString(),
      endDate: endDate.toLocaleDateString(),
      endTime: endTime.toLocaleTimeString(),
      day: days,
    };

    var userid = Firebase.auth().currentUser.uid
    Firebase.database().ref('/users/' + userid + '/today/').child(key).remove()
    Firebase.database().ref().child('/users/' + userid + '/' + key).update(scheduleData);
  }

  // this function ensures that all changes to "today" will be reflected
  _renderToday() {
    Firebase.database().ref('/users/' + this.userid + '/').on('value', (snap) => {
      var todayEvents = []
      var today = new Date()
      var dayOfWeeksList = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat']
      var dayOfWeek = dayOfWeeksList[today.getDay()]
      var t = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear()
      var todayDate = moment(t, "MM/DD/YYYY")

      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
          var cStartDate = moment(child.val().startDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cEndDate = moment(child.val().endDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cDays = child.val().day

          // within repeat duration and correct day of week
          if (todayDate >= cStartDate && todayDate <= cEndDate) {
            if(cDays.includes(" ") || cDays.includes(dayOfWeek)) {
              var difference = (moment(child.val().endTime, 'h:mm A').diff(moment(child.val().startTime, 'h:mm A')))/2
              var checkPoint = moment(moment(child.val().startTime, 'h:mm A') + difference)

              // push event to Firebase
              Firebase.database().ref('users/' + this.userid + '/today/').update({
                [child.key]: checkPoint.format('h:mm A')
              });
            }
          }
          // if not today, but still in today list, delete.
          else {
            Firebase.database().ref('/users/' + this.userid + '/today/').child(child.key).remove()
          }
        }
      });
    });
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
                  <Icon onPress={()=>this.setModalVisible(!this.state.modalVisible)} name="close" style={{fontSize: 30, fontWeight:'bold', color: 'black'}}/>
                </View>

                <View style={{alignItems: 'center',borderBottomWidth: .8,borderBottomColor: '#eaecef',}}>
                  <Text style={{fontSize: 22, fontFamily:'Avenir-light', paddingBottom: 10, color: '#545454'}}>{this.props.event.eventName}</Text>
                </View>

                <View style={{marginTop:25}}>
                  <Text style={localStyles.locationText}>{locationText}</Text>
                  <Text style={localStyles.eventText}>{sTime} to {eTime}</Text>
                  <Text style={localStyles.eventText}>{dayDisplay}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                  <Button info bordered onPress={()=>this._deleteEvent()}
                          style={{padding: 10, marginTop: 50,width: 100,alignItems: 'center',justifyContent: 'center',}}>
                    <Text style={{color: '#5CACEE', textAlign: 'center',fontSize: 16,fontFamily:'Avenir'}}>Delete</Text>
                  </Button>
                  <Button info onPress={()=>this._editEvent()}
                          style={{padding: 10, marginTop: 50,width: 100,backgroundColor: '#5CACEE',alignItems: 'center',justifyContent: 'center',}}>
                    <Text style={{color: 'white', textAlign: 'center',fontSize: 16,fontFamily:'Avenir'}}>Edit</Text>
                  </Button>
                </View>
              </View>
           </View>
        </Modal>

        <TouchableHighlight onPress={()=>this._eventDetails()}>
          <View style={localStyles.eventContainer}>
            <Text style={localStyles.rowText}>{this.props.event.eventName}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

// <TouchableHighlight onPress={()=>this._deleteEvent()}
//                     style={styles.primaryButton}>
//   <Text style={styles.primaryButtonText}>Delete</Text>
// </TouchableHighlight>
// <TouchableHighlight onPress={()=>this._editEvent()}
//                     style={styles.primaryButton}>
//   <Text style={styles.primaryButtonText}>Edit</Text>
// </TouchableHighlight>

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
    height: 45,
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
  rowText: {
    fontSize: 15,
    alignItems: 'center',
    fontFamily:'Avenir'
  },
  eventText: {
    fontSize: 15,
    alignItems: 'center',
    fontFamily:'Avenir',
    color: 'black'
  },
  locationText: {
    fontSize: 15,
    color: 'black',
    alignItems: 'center',
    fontFamily:'Avenir',
    paddingBottom: 15,
  },
})

module.exports = EventDisplay;
