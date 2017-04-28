// Home Page
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text,
    Image
  } from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles';
import Coordinates from '../components/Coordinates';
import Firebase from '../components/Firebase';
var moment = require('moment');

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state={
      loading: false,
    }
    this.userid = Firebase.auth().currentUser.uid
    this.eventsRef = Firebase.database().ref()
  }

  componentDidMount() {
    this._renderToday();
  }

  // rendering of today's events
  _renderToday() {
    this.eventsRef.child('/users/' + this.userid + '/').on('value', (snap) => {
      var todayEvents = []
      var today = new Date()
      var dayOfWeeksList = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat']
      var dayOfWeek = dayOfWeeksList[today.getDay()]
      var t = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear()
      var todayDate = moment(t, "MM/DD/YYYY")

      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today') {
          var cStartDate = moment(child.val().startDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cEndDate = moment(child.val().endDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cDays = child.val().day

          // within repeat duration and correct day of week
          if (todayDate >= cStartDate && todayDate <= cEndDate) {
            if(cDays.includes(" ") || cDays.includes(dayOfWeek)) {
              Firebase.database().ref('users/' + this.userid + '/today/').update({
                [child.key]: moment(child.val().startTime, 'h:mm A').format('h:mm A')
              });
            }
          }
        }
      });
    });
  }

  render() {
    return (
      <View style = {{flex:1}}>
       <View style = {styles.screenContainer}>
        <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style = {{width: 200, height: 200, justifyContent: 'center'}}
                 source={{uri: 'https://previews.123rf.com/images/natalyon/natalyon1502/natalyon150200013/36745703-Doodle-space-elements-collection-in-black-and-white-ISS-moonwalker-planet-comet-moon-astronaut-alien-Stock-Vector.jpg'}}
          />
          <Text style={{justifyContent: 'center'}}>Welcome to Comet!</Text>
          <Text style={{marginTop: 15, justifyContent: 'center'}}>Your Current Location:</Text>
          <Coordinates/>
        </View>
       </View>
         <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }

}

module.exports = HomePage;
