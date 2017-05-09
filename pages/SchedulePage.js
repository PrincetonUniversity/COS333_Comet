// Schedule Page
'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, View, Text, Image, ListView, TouchableHighlight,
        Modal, ScrollView} from 'react-native';
import {Container, Content, Header, Footer, FooterTab, Button, Icon, Left, Right,
        Body, Title, Tab, Tabs, Card, CardItem, StatusBar} from 'native-base';
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
      }),
    };
    this.userid = Firebase.auth().currentUser.uid
  }

  // initial state
  componentDidMount() {
    this._renderToday();
    this._listenForEvents(this.eventsRef);
  }

  componentWillUnmount() {
    //this.eventsRef.off();
    this.eventsRef.child('/users/' + this.userid + '/').off();
    //this.eventsRef.child('/users/' + userid + '/today/').off();
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
      <EventDisplay event={event} navigator={this.props.navigator}></EventDisplay>
    );
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

  _listenForEvents(eventsRef) {
    var allList = Firebase.database().ref('/users/' + this.userid + '/')

    // build list of today events & all events
    allList.on('value', (snap) => {
      console.log("I'VE CHANGED.")
      var todayEvents = [];
      var allEvents = [];
      snap.forEach((child) => {
        // put today events in todayEvents
        if (snap.child('today/' + child.key).exists()) {
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
        // put all events into allEvents
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
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
      todayEvents.sort(this._sortEvents);
      allEvents.sort(this._sortEvents);
      this.setState({
        todayEvents: this.state.todayEvents.cloneWithRows(todayEvents),
        allEvents: this.state.allEvents.cloneWithRows(allEvents),
      });
    });
  }

  // sort events by their start times
  _sortEvents(a, b) {
    var aTime = moment(a.startTime, "h:mm A")
    var bTime = moment(b.startTime, "h:mm A")
    if (aTime < bTime)
      return -1;
    else if (aTime > bTime)
      return 1;
    return 0;
  }

  render() {
    return (
    <View style={styles.container}>
    <Container style={{flex:10}}>
      <Header style={{ backgroundColor: '#2f3d77'}}>
        <Left />
        <Body>
          <Title style={{color: 'white', fontFamily:'Avenir-medium'}}>Your Schedule</Title>
        </Body>
        <Right>
          <View style={{paddingRight: 5}}>
            <Icon onPress={()=>this._navigate()} name="add" style={{fontSize: 30, color: 'white', fontWeight:'bold'}}/>
          </View>
        </Right>
      </Header>
      <View style={styles.screenContainer}>

         <Card>
             <CardItem header style={{backgroundColor: '#eaecef', height:35}}>
                 <Text style={{color: 'black', fontSize: 14, fontFamily:'Avenir-medium'}}>{"Today's Events:"}</Text>
             </CardItem>
             <ListView dataSource = {this.state.todayEvents}
                 renderRow={this._renderEvent.bind(this)}
                 enableEmptySections={true}
                 bounces={false}/>
         </Card>

         <Card>
             <CardItem header style={{backgroundColor: '#eaecef', height:35}}>
                 <Text style={{color: 'black', fontSize: 14, fontFamily:'Avenir-medium'}}>All Events:</Text>
             </CardItem>
             <ListView dataSource = {this.state.allEvents}
                 renderRow={this._renderEvent.bind(this)}
                 enableEmptySections={true}
                 bounces={false}/>
          </Card>

         </View>
    </Container>
    <NavBar navigator={this.props.navigator}/>
    </View>
  );
  }
}


module.exports = SchedulePage;
