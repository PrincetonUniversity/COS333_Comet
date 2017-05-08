'use strict';
import React, {Component} from 'react';
import {AppRegistry, Navigator, Text, View,} from 'react-native';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SchedulePage from './pages/SchedulePage';
import AddPage from './pages/AddPage';
import EditPage from './pages/EditPage';
import StatsPage from './pages/StatsPage';
import LocationSearchPage from './pages/LocationSearchPage';
import Firebase from './components/Firebase';
import Loading from './components/Loading';
import BackgroundTimer from 'react-native-background-timer';
var moment = require('moment');

class Comet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
      loadedToday: false,
      todayEvents: [],
      todayDate: new Date()
    }
    this.currentEvent = null
    this.counter = 0
    this.userid = null
  }

  componentWillMount() {
    console.log("IM MOUNTING");
    const unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({page: 'HomePage'});
        this.userid = Firebase.auth().currentUser.uid
        this._renderToday(); // first rendering + start timer
        return;
      }
      else {
        this.setState({page: 'LoginPage'});
        unsubscribe();
      }
    });
  }

  componentWillUnmount() {
    Firebase.database().ref().child('/users/' + this.userid + '/').off()
    Firebase.database().ref().child('/users/' + this.userid + '/today/').off()
  }

  _startTimer() {
    if (this.state.todayEvents.length > 0) {
      this.currentEvent = this.state.todayEvents[0] // {moment, key}
      this._listenForToday(); // keep track of changes to 'today'

      var checkTime = () => {
        //this._renderTodayList(); // re-render todayList to catch any updates
        var currentEventTime = this.currentEvent.startTime // {moment}
        console.log(currentEventTime.format("h:mm A"))
        console.log("current event: " + this.currentEvent._key)
        if (moment() >= currentEventTime) {
          if (this.counter == this.state.todayEvents.length-1) {
            // no more events left; next event is "tomorrow"
            console.log("going to tomorrow")
            this.currentEvent = {
              startTime: moment().add(1, 'days').hours(0).minutes(0).second(0).millisecond(0),
              _key: 'tomorrow'
            }
            // IMPORTANT: HERE, THE FUNCTION NEEDS TO RECALCULATE 'TODAY'
            var timeoutID = BackgroundTimer.setTimeout(checkTime, this._changeInterval())
            console.log("tomorrow id: " + timeoutID)
            return;
          }
          else {
            var newEvent = this.state.todayEvents[this.counter + 1]
            this.currentEvent = newEvent
            this.counter = this.counter + 1
          }
        }
        else {
          console.log("no match");
        }
        var timeoutID = BackgroundTimer.setTimeout(checkTime, this._changeInterval())
        console.log("id: " + timeoutID)
      }
      checkTime();
    }
  }

  _changeInterval() {
    if (!this.currentEvent) {
      return 100
    }
    else {
      return(
       moment(this.currentEvent.startTime).diff(moment()) //<--CHANGE TO FIREBASE CALL
     );
    }
  }

  _renderToday() {
    var todayEvents = []
    Firebase.database().ref('/users/' + this.userid + '/').on('value', (snap) => {
      /*var today = new Date()
      var dayOfWeeksList = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat']
      var dayOfWeek = dayOfWeeksList[today.getDay()]
      var t = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear()
      var todayDate = moment(t, "MM/DD/YYYY")*/

      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
          /*var cStartDate = moment(child.val().startDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cEndDate = moment(child.val().endDate, 'MM/DD/YYYY').subtract(1, 'months')
          var cDays = child.val().day*/
          if (this._isToday(child)) {

          // within repeat duration and correct day of week
          //if (todayDate >= cStartDate && todayDate <= cEndDate) {
            //if(cDays.includes(" ") || cDays.includes(dayOfWeek)) {
              // push event to Firebase
              Firebase.database().ref('users/' + this.userid + '/today/').update({
                [child.key]: moment(child.val().startTime, 'h:mm A').format('h:mm A')
              });
              // push event to todayList
              todayEvents.push({
                startTime: moment(child.val().startTime, "h:mm A"),
                _key: child.key
              });

          }
          // if not today, but still in today list, delete.
          else {
            Firebase.database().ref('/users/' + this.userid + '/today/').child(child.key).remove()
          }
        }
      });
      todayEvents.sort(this._sortEvents);
      this.setState({
        loadedToday: true,
        todayEvents: todayEvents,
      }, this._startTimer);
    });
  }

  _isToday(child) {
    var today = this.state.todayDate
    var dayOfWeeksList = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat']
    var dayOfWeek = dayOfWeeksList[today.getDay()]
    var t = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear()
    var todayDate = moment(t, "MM/DD/YYYY")

    var cStartDate = moment(child.val().startDate, 'MM/DD/YYYY').subtract(1, 'months')
    var cEndDate = moment(child.val().endDate, 'MM/DD/YYYY').subtract(1, 'months')
    var cDays = child.val().day

    if (todayDate >= cStartDate && todayDate <= cEndDate) {
      if (cDays.includes(" ") || cDays.includes(dayOfWeek)) {
        return true
      }
    }
    else {
      return false
    }
  }

  _sortEvents(a, b) {
    var aTime = moment(a.startTime, "h:mm A")
    var bTime = moment(b.startTime, "h:mm A")
    if (aTime < bTime)
      return -1;
    else if (aTime > bTime)
      return 1;
    return 0;
  }

  _listenForToday() {
    var todayList = Firebase.database().ref('/users/' + this.userid + '/today')
    // check if today; edit timer accordingly
    var todayEvents = this.state.todayEvents;
    todayList.on("child_added", (snap) => {
      console.log("i've grown")
      //compareTime(); // see if current event is today
      /*snap.forEach((child) => {
        todayEvents.push({
          startTime: moment(child.val(), "h:mm A"),
          _key: child.key
        });
      });*/
      this.setState({
        todayEvents: todayEvents,
      });
    });
    todayList.on("child_removed", (snap) => {
      console.log("i've shrunk")
      var todayEvents = [];
      snap.forEach((child) => {
        todayEvents.push({
          startTime: moment(child.val(), "h:mm A"),
          _key: child.key
        });
      });
      this.setState({
        todayEvents: todayEvents,
      });
    });
    todayList.on("child_changed", (snap) => {
      console.log("i've changed")
      var todayEvents = [];
      snap.forEach((child) => {
        todayEvents.push({
          startTime: moment(child.val(), "h:mm A"),
          _key: child.key
        });
      });
      this.setState({
        todayEvents: todayEvents,
      });
    });
  }

  render() {
    if (this.state.page == 'HomePage') {
      if (this.state.loadedToday) {
        return (
          <Navigator
            initialRoute={{name: this.state.page}}
            renderScene = { this.renderScene }
          />
        )
      }
      else {
        return <Loading/>
      }
    }
    else if (this.state.page == 'LoginPage'){
      return (
        <Navigator
          initialRoute={{name: this.state.page}}
          renderScene = { this.renderScene }
        />
      )
    } else {
      return (
        <Loading/>
      )
    }
  }

  renderScene(route, navigator) {
    if (route.name == 'LoginPage') {
      return <LoginPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'SignupPage') {
      return <SignupPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'HomePage') {
      return <HomePage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'SchedulePage') {
      return <SchedulePage navigator={navigator} {...route.passProps}  />
    }
    if (route.name == 'AddPage') {
      return <AddPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'EditPage') {
      return <EditPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'StatsPage') {
      return <StatsPage navigator={navigator} {...route.passProps} />
    }
    if (route.name == 'LocationSearchPage') {
      return <LocationSearchPage navigator={navigator} {...route.passProps} />
    }
  }
}

AppRegistry.registerComponent('datepicker', () => Comet);
