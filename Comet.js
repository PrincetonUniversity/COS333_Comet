/*****************************/
 // handle tomorrow
 // behavior when editing events
 // restricting edits
 // removing passed events.
/*****************************/


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
import Geocoder from 'react-native-geocoding';
var moment = require('moment');
Geocoder.setApiKey('AIzaSyCNz6l77DLDP0f9pehjVuABmkxByXUm90g');

class Comet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: null,
      loadedToday: false,
      todayEvents: [],

      planLatitude: null,
      planLongitude: null,
      currLatitude: null,
      currLongitude: null,
      here: null,
      error: null,
    }
    this.currentEvent = null
    this.storedCurrentEvent = null
    this.counter = 0
    this.userid = null
    this.timer = null
    this.todayDate = new Date()
    this.streak = true
  }

  componentDidMount() {
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

/****************************** BACKGROUND TIMER ******************************/
  _startTimer() {
    var checkTime = () => {
      console.log("this is the updated today list with counter = " + this.counter + ": ")
      for (var i = 0; i < this.state.todayEvents.length; i++) {
        console.log(" - checkpoint: " + this.state.todayEvents[i].checkPoint + ", key: " + this.state.todayEvents[i]._key)
      }
      this.todayDate = new Date()

      // IF IT IS TOMORROW; YOU NEED TO RECALCULATE THE LIST. !!!
      // just grab the list once? .once?
      if (this.currentEvent._key == 'tomorrow') {
        this._renderToday();
        console.log("this is the recalculated tomorrow list.")
        for (var i = 0; i < this.state.todayEvents.length; i++) {
          console.log(" - checkpoint: " + this.state.todayEvents[i].checkPoint + ", key: " + this.state.todayEvents[i]._key)
        }
      }

      var currentEventTime = moment(this.currentEvent.checkPoint, "h:mm A") // {moment}
      if (moment() >= currentEventTime) {
        if (this.currentEvent._key != 'tomorrow') {
          this._checkEvent(this.currentEvent);
        }
        if (this.counter == this.state.todayEvents.length-1) {
          console.log("going to tomorrow")
          this.counter = 0
          this.currentEvent = {
            checkPoint: moment().add(1, 'days').hours(0).minutes(0).second(0).millisecond(0),
            _key: 'tomorrow'
          }
          this.timer = BackgroundTimer.setTimeout(checkTime, this._changeInterval())
          console.log("set tomorrow timer # " + this.timer)
          return;
        }
        else {
          var newEvent = this.state.todayEvents[this.counter + 1]
          this.currentEvent = newEvent
          this.counter = this.counter + 1
        }
      }
      else {
        console.log("waiting on " + this.currentEvent._key + " at " + this.currentEvent.checkPoint + "; will take " + this._changeInterval() + " milliseconds.")
      }
      if (this._changeInterval()) {
        this.timer = BackgroundTimer.setTimeout(checkTime, this._changeInterval())
        console.log("set timer # " + this.timer)
      }
    }

    var start = this.counter
    if (this.state.todayEvents.length > start) {
      this.currentEvent = this.state.todayEvents[start] // {moment, key}
      checkTime();
    }
    else { // if no events, just go straight for tmrw
      this.currentEvent = {
        checkPoint: moment().add(1, 'days').hours(0).minutes(0).second(0).millisecond(0),
        _key: 'tomorrow'
      }
        console.log("going to tomorrow")
        console.log("cleared timer # "+ this.timer)
        BackgroundTimer.clearTimeout(this.timer);
        this.timer = BackgroundTimer.setTimeout(checkTime, this._changeInterval())
        console.log("set tomorrow timer # " + this.timer)
    }
  }

  _changeInterval() {
    if (!this.currentEvent) {
      return 100
    }
    else {
      return(
       moment(this.currentEvent.checkPoint, "h:mm A").diff(moment()) //<--CHANGE TO FIREBASE CALL
     );
    }
  }

  _renderToday() {
    var todayEvents = []
    Firebase.database().ref('/users/' + this.userid + '/').on('value', (snap) => {
      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
          if (this._isToday(child)) {
            var difference = (moment(child.val().endTime, 'h:mm A').diff(moment(child.val().startTime, 'h:mm A')))/2
            var checkPoint = moment(moment(child.val().startTime, 'h:mm A') + difference).format('h:mm A')
            // push event to Firebase
            Firebase.database().ref('users/' + this.userid + '/today/').update({
              [child.key]: checkPoint // a string
            });
            // push *upcoming* events to todayList; phase out events that've passed
            if (moment() < moment(checkPoint, 'h:mm A')) {
              todayEvents.push({
                checkPoint: checkPoint, // a string
                _key: child.key
              });
            }
          }
          // if not today, but still in today list, delete.
          else {
            Firebase.database().ref('/users/' + this.userid + '/today/').child(child.key).remove()
          }
        }
      });
      todayEvents.sort(this._sortEvents); // sort by checkpoint time!
      this._listenForToday(); // listen for changes to 'today'

      this.setState({
        loadedToday: true,
        todayEvents: todayEvents,
      }, this._startTimer);
    });
  }

  _renderTodayList() {
     var todayList = Firebase.database().ref().child('/users/' + this.userid + '/today')
     todayList.on('value', (snap) => {
       var todayEvents = [];
       snap.forEach((child) => {
         if (moment() < moment(child.val(), 'h:mm A')) {
           todayEvents.push({
             checkPoint: child.val(), // a string
             _key: child.key
           });
         }
       });
       todayEvents.sort(this._sortEvents);
       this.counter = 0 //? correct?
       this.setState({
         todayEvents: todayEvents,
       }, this._startTimer);
     });
   }

  _isToday(child) {
    var today = this.todayDate
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
    var aTime = moment(a.checkPoint, "h:mm A")
    var bTime = moment(b.checkPoint, "h:mm A")
    if (aTime < bTime)
      return -1;
    else if (aTime > bTime)
      return 1;
    return 0;
  }

  // new today event! edit timer accordingly
  _listenForToday() {
    this._renderTodayList();
    var todayList = Firebase.database().ref('/users/' + this.userid + '/today/')
    var todayEvents = this.state.todayEvents;
    todayList.on("child_added", (snap) => {
      // cancel current timer & restart at prev point. if already passed, just increment counter.
      console.log("you added a new event for today at " + snap.val())
      if (this.timer) {
        BackgroundTimer.clearTimeout(this.timer);
        console.log("cleared timer # " + this.timer)
        this.counter = 0
      }
    });

    todayList.on("child_removed", (snap) => {
      console.log("you removed an event for today at " + snap.val())
      if (this.timer && this.counter >= 0) { // should always be true but just in case
        BackgroundTimer.clearTimeout(this.timer);
        console.log("cleared timer # " + this.timer)
        this.counter = 0
      }
    });
  }

/****************************** ATTENDANCE DATA ******************************/
  _checkEvent(event) {
    this.storedCurrentEvent = event
    var eventKey = event._key
    Firebase.database().ref('users/' + this.userid + '/').once('value', (snap) => {
      var event = snap.child(eventKey).val()
      this.setState({
        //event address
        planLatitude: event.location.latitude,
        planLongitude: event.location.longitude,
      }, this._checkLocation);
    });
  }

  _checkLocation() {
    var event = this.storedCurrentEvent
    if (this.state.planLatitude && this.state.planLongitude) {
      // find current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currLatitude: position.coords.latitude, //set current coordinates
            currLongitude: position.coords.longitude,
            error: null,
          }, this._check);
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1 },
      );
    }
    console.log("CHECKED " + event._key + " at " + event.checkPoint)
  }

  _check() {
    //compare with planned location coordinates, radius currently .005
    if (Math.abs(this.state.planLatitude - this.state.currLatitude) < 0.003 &&
      Math.abs(this.state.planLongitude - this.state.currLongitude) < 0.003)
      {
        alert("Nice! You attended your event.")
        console.log("p event coordinates: (" + this.state.planLatitude + ", " + this.state.planLongitude + ")")
        console.log("p your coordinates: (" + this.state.currLatitude + ", " + this.state.currLongitude + ")")
        this._incrementPresence();
        this._incrementStreak();
      } else {
        alert("You missed your event!")
        console.log("a event coordinates: (" + this.state.planLatitude + ", " + this.state.planLongitude + ")")
        console.log("a your coordinates: (" + this.state.currLatitude + ", " + this.state.currLongitude + ")")
        this._incrementAbsence();
        this._resetStreak();
      }
  }

  _incrementPresence() {
    var key = this.storedCurrentEvent._key
    var userid = this.userid
    console.log("+1 presence for " + key)
    var ref = Firebase.database().ref('/users/' + userid + '/' + key);
    ref.once("value")
      .then(function(snapshot) {
        var prevCounter = snapshot.child("present").val();
        prevCounter = prevCounter + 1
        Firebase.database().ref('users/' + userid + '/' + key).update({
          present: prevCounter
        });
      })
  }

  _incrementAbsence() {
    var key = this.storedCurrentEvent._key
    var userid = this.userid
    var ref = Firebase.database().ref('/users/' + userid + '/' + key);
    ref.once("value")
      .then(function(snapshot) {
        var prevCounter = snapshot.child("absent").val();
        prevCounter = prevCounter + 1
        Firebase.database().ref('users/' + userid + '/' + key).update({
          absent: prevCounter
        });
        console.log("+1 absence for " + key)
      })
    return;
  }

  _incrementStreak() {
    var userid = this.userid
    var ref = Firebase.database().ref('/users/' + userid);
    console.log("congrats! incremented streak.")
    ref.once("value")
      .then(function(snapshot) {
        var prevCounter = snapshot.child("counter").val();
        prevCounter = prevCounter + 1
        Firebase.database().ref('users/' + userid).update({
          counter: prevCounter
        });
      })
  }

  _resetStreak() {
    console.log("resetted streak.")
    Firebase.database().ref('users/' + this.userid).update({
      counter: 0
    });
  }

/****************************** NAVIGATION ************************************/

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
