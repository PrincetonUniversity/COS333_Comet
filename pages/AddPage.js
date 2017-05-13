'use strict';
import React, {Component} from 'react';
import {
  AppRegistry, Text, TextInput, View, TouchableHighlight,
  ActivityIndicator, Image, Alert, ListView, AlertIOS,
  DatePickerIOS, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import styles from '../styles';
import Firebase from '../components/Firebase';
import RadioButton from '../components/RadioButton';
import Accordion from 'react-native-collapsible/Accordion';
var moment = require('moment');
var tr = require("trim");

const SECTIONS = [{title: 'Starts',}, {title: 'Ends',},
                  {title: 'Start Repeat',}, {title: 'End Repeat',}];

class AddPage extends Component {
  static defaultProps = {
    startDate: new Date(),
    endDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  };

  constructor(props) {
    super(props);
    this.props.startTime.setMinutes(0)
    var h = this.props.startTime.getHours();
    if (h == 12) {
      this.props.endTime.setHours(1)
    }
    else {
      this.props.endTime.setHours(h + 1)
    }
    this.props.endTime.setMinutes(0)
    this.itemsRef = Firebase.database().ref();
    this.state = {
      loading: false,
      eventName: '',
      location:'',
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      allEvents: []
    };
    this.setState = this.setState.bind(this)
    this._updateLocation = this._updateLocation.bind(this)
  }

  _checkRelative() {
    var allEvents = []
    Firebase.database().ref('/users/' + Firebase.auth().currentUser.uid + '/').once('value', (snap) => {
      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
            // push all events to todayList
          allEvents.push({
            startTime: child.val().startTime, // a string
            endTime: child.val().endTime,
            startDate: child.val().startDate,
            endDate: child.val().endDate,
            day: child.val().day,
            _key: child.key,
          });
        }
      });
      this.setState({
        allEvents: allEvents,
      }, this._checkFields);
    });
  }

  _checkFields() {
    var eHours = this.state.endTime.getHours()
    var eMins = this.state.endTime.getMinutes()
    var endTime = new Date(0, 0, 0, eHours, eMins, 0, 0);

    var sHours = this.state.startTime.getHours()
    var sMins = this.state.startTime.getMinutes()
    var startTime = new Date(0, 0, 0, sHours, sMins, 0, 0);

    var eDate = this.state.endDate.getDate()
    var eMonth = this.state.endDate.getMonth()
    var eYear = this.state.endDate.getFullYear()
    var endDate = new Date(eYear, eMonth, eDate, 0, 0, 0, 0);

    var sDate = this.state.startDate.getDate()
    var sMonth = this.state.startDate.getMonth()
    var sYear = this.state.startDate.getFullYear()
    var startDate = new Date(sYear, sMonth, sDate, 0, 0, 0, 0);

    // check proximity to other events
    var pass = true
    var days = [];
    if (this.state.monday == true) {days.push("M")}
    if (this.state.tuesday == true) {days.push("T")}
    if (this.state.wednesday == true) {days.push("W")}
    if (this.state.thursday == true) {days.push("Th")}
    if (this.state.friday == true) {days.push("F")}
    if (this.state.saturday == true) {days.push("Sat")}
    if (this.state.sunday == true) {days.push("Sun")}
    if (days.length == 0) {days.push(" ")}

    for (var i = 0; i < this.state.allEvents.length; i++) {
      if (this._isClose(startTime, endTime, startDate, endDate, days, this.state.allEvents[i])) {
        pass = false
        break;
      }
    }

    if (this.state.eventName === '' || this.state.day === '' || this.state.location === '') {
      Alert.alert('Error', 'Fields must not be empty.');
    }
    else if (endTime.getTime() < startTime.getTime()) {
      Alert.alert('Error', 'End time cannot come before start time.');
    }
    else if (endTime.getTime() == startTime.getTime()) {
      Alert.alert('Error', 'End time cannot be the same as start time.');
    }
    else if (endDate.getTime() < startDate.getTime()) {
      Alert.alert('Error', 'End date cannot come before start date.');
    }
    else if (pass == false) {
      Alert.alert('Error', 'Event too close to another event.');
    }
    else {
      this.setState({
        startTime: startTime,
        endTime: endTime,
        startDate: startDate,
        endDate: endDate,
      }, this._addItem());
    }
  }

  _isClose(startTime, endTime, startDate, endDate, day, other) {
    var otherStartTime = moment(other.startTime, "h:mm A")
    var otherEndTime = moment(other.endTime, "h:mm A")
    var otherDays = other.day
    var otherStartDate = moment(other.startDate, "MM/DD/YYYY")
    var otherEndDate = moment(other.endDate, "MM/DD/YYYY")

    var thisStartTime = moment(startTime.toLocaleTimeString(), 'h:mm A')
    var thisEndTime = moment(endTime.toLocaleTimeString(), 'h:mm A')
    var thisDays = day
    var thisStartDate = moment(startDate.toLocaleDateString(), 'MM/DD/YYYY')
    var thisEndDate = moment(endDate.toLocaleDateString(), 'MM/DD/YYYY')

    // on same day
    if (thisStartDate >= otherStartDate && thisStartDate <= otherEndDate) {
      var shareDays = false
      for (var i = 0; i < otherDays.length; i++) {
        if (thisDays.includes(otherDays[i])) {
          shareDays = true
        }
        else if (thisDays.length == 0 && otherDays.length == 0) {
          shareDays = true
        }
      }
      if (shareDays) {
        // now, overlapping time
        if (thisStartTime >= otherStartTime && thisStartTime <= otherEndTime) {
          return true
        }
        if (otherStartTime >= thisStartTime && otherStartTime <= thisEndTime) {
          return true
        }
      }
    }
    else {
      return false
    }
  }

  _addItem() {
    var days = [];
    if (this.state.monday == true) {days.push("M")}
    if (this.state.tuesday == true) {days.push("T")}
    if (this.state.wednesday == true) {days.push("W")}
    if (this.state.thursday == true) {days.push("Th")}
    if (this.state.friday == true) {days.push("F")}
    if (this.state.saturday == true) {days.push("Sat")}
    if (this.state.sunday == true) {days.push("Sun")}
    if (days.length == 0) {days.push(" ")}

    // a new schedule entry
    var scheduleData = {
      eventName: this.state.eventName,
      location: this.state.location,
      startDate: this.state.startDate.toLocaleDateString(),
      startTime: this.state.startTime.toLocaleTimeString(),
      endDate: this.state.endDate.toLocaleDateString(),
      endTime: this.state.endTime.toLocaleTimeString(),
      day: days,
      absent: 0,
      present: 0,
    };

    var userid = Firebase.auth().currentUser.uid
    Firebase.database().ref().child('/users/' + userid + '/').push(scheduleData);
    this.props.navigator.pop();
  }

  onStartTimeChange = (time) => {
    this.setState({startTime: time})
    this.setState({endTime: time})
  };

  onEndTimeChange = (time) => {
    this.setState({endTime: time})
  };

  onStartDateChange = (date) => {
    this.setState({startDate: date})
    this.setState({endDate: date})
  };

  onEndDateChange = (date) => {
    this.setState({endDate: date})
  };

  onTimezoneChange = (event) => {
    var offset = parseInt(event.nativeEvent.text, 10);
    if (isNaN(offset)) {
      return;
    }
    this.setState({timeZoneOffsetInHours: offset});
  };

  _M() {this.setState({monday: !(this.state.monday)});}

  _T() {this.setState({tuesday: !(this.state.tuesday)});}

  _W() {this.setState({wednesday: !(this.state.wednesday)});}

  _Th() {this.setState({thursday: !(this.state.thursday)});}

  _F() {this.setState({friday: !(this.state.friday)});}

  _Sat() {this.setState({saturday: !(this.state.saturday)});}

  _Sun() {this.setState({sunday: !(this.state.sunday)});}

  _renderHeader(section) {
    if (section.title == 'Starts') {
      var time = this.state.startTime
      var text = moment(time).format('LT')
    }
    else if (section.title == 'Ends') {
      var time = this.state.endTime
      var text = moment(time).format('LT')
    }
    else if (section.title == 'Start Repeat') {
      var date = this.state.startDate
      var text = moment(date).format('ll')
    }
    else if (section.title == 'End Repeat') {
      var date = this.state.endDate
      var text = moment(date).format('ll')
    }

    return (
      <View style={localStyles.inputRow}>
        <View style={localStyles.inputText}>
          <Text style={{fontFamily:'Avenir-medium', fontSize:17}}>{section.title}</Text>
        </View>
        <View style={localStyles.inputDate}>
          <Text style={localStyles.dateText}>{text}</Text>
        </View>
      </View>
    );
  }

  _navigateLocation() {
    this.props.navigator.push({
      name: 'LocationSearchPage',
      passProps: {
        updateLocation: this._updateLocation.bind(this),
      }
    });
  }

  _updateLocation(name, lat, long) {
    this.setState({
      location: {name : name, latitude: lat, longitude: long}
    });
  };

  _renderContent(section) {
    if (section.title == 'Starts') {
      return (
        <View>
          <DatePickerIOS
            date={this.state.startTime}
            style={{borderBottomWidth: 1, borderColor: '#d7dbe2',backgroundColor:'white'}}
            mode="time"
            minuteInterval={5}
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onStartTimeChange}/>
        </View>
      );
    }
    else if (section.title == 'Ends') {
      return (
        <View>
          <DatePickerIOS
            date={this.state.endTime}
            style={{borderBottomWidth: 1, borderColor: '#d7dbe2',backgroundColor:'white'}}
            mode="time"
            minuteInterval={5}
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onEndTimeChange}/>
        </View>
      );
    }
    else if (section.title == 'Start Repeat') {
      return (
        <View>
          <DatePickerIOS
            date={this.state.startDate}
            style={{borderBottomWidth: 1, borderColor: '#d7dbe2',backgroundColor:'white'}}
            mode="date"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onStartDateChange}/>
        </View>
      );
    }
    else if (section.title == 'End Repeat') {
      return (
        <View>
          <DatePickerIOS
            date={this.state.endDate}
            style={{borderBottomWidth: 1, borderColor: '#d7dbe2',backgroundColor:'white'}}
            mode="date"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onEndDateChange}/>
        </View>
      );
    }
  }

  render() {
    if (this.state.location == '') {
      var locationTextStyle = localStyles.placeHolder
      var locationText = 'Location'
    }
    else {
      var locationTextStyle = localStyles.locationTextStyle
      var name = this.state.location.name.split(', ')
      var top = name[0]
      if (top.length > 47) {
        var top = top.slice(0,47) + '...'
      }
      var bottom = ""
      for (var i = 1; i < name.length; i++) {
        bottom = bottom + name[i]
        if (i < name.length-1){
          bottom = bottom + ', '
        }
      }
      if (bottom.length > 47) {
        var bottom = bottom.slice(0,47) + '...'
      }
      locationText = top + '\n' + bottom
    }

    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <View style={{height: 20, backgroundColor: '#eff3f9', borderColor: '#d7dbe2', borderBottomWidth: 1}}/>
        <TextInput
          style={localStyles.inputRow}
          placeholder={"Title"}
          placeholderTextColor={'#d7dbe2'}
          onChangeText={(text) => this.setState({eventName: tr(text)})}
          maxLength = {50}/>

        <View style={{height: 1, backgroundColor: 'white', borderColor: '#d7dbe2', borderBottomWidth: 1}}/>

        <TouchableOpacity style={localStyles.locationRow}
                          onPress={() => this._navigateLocation()}
                          activeOpacity={.5}>
          <Text style={locationTextStyle}>{locationText}</Text>
        </TouchableOpacity>

        <View style={{height: 30, backgroundColor: '#eff3f9', borderColor: '#d7dbe2', borderTopWidth: 1, borderBottomWidth: 1}}/>

        <Accordion
          sections={SECTIONS}
          renderHeader={this._renderHeader.bind(this)}
          renderContent = {this._renderContent.bind(this)}
          underlayColor = '#d7dbe2'
        />

        <View style={localStyles.inputRow}>
          <View style ={localStyles.inputText}>
            <Text style={{fontFamily:'Avenir-medium', fontSize:17}}>Repeats</Text>
          </View>
        </View>

        <View style={localStyles.repeatBody}>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Sun.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>Sun</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._M.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>M</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._T.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>T</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._W.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>W</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Th.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>Th</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._F.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>F</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Sat.bind(this)}/>
            <Text style={{fontFamily:'Avenir', fontSize:17}}>Sat</Text>
          </View>
        </View>
      </View>;

    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
              <Text onPress={()=>this.props.navigator.pop()} style={{fontSize: 17, color: '#d7dbe2', fontFamily:'Avenir-medium'}}>Cancel</Text>
          </View>
          <View style = {{flex: 3, marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.titleBarText}>New Event</Text>
          </View>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
              <Text onPress={this._checkRelative.bind(this)} style={{fontSize: 17, color: '#d7dbe2', fontFamily:'Avenir-medium'}}>Add</Text>
          </View>
        </View>
        <ScrollView style={styles.container} bounces={false}>
          <View>
            {content}
          </View>
        </ScrollView>
      </View>
    );
  }
}

var localStyles = StyleSheet.create({
  inputRow: {
    height: 60,
    backgroundColor:'white',
    borderColor: '#d7dbe2',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    flexDirection: 'row',
  },
  inputText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  inputDate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateText: {
    color: '#1f1c3a',
    fontFamily:'Avenir',
    fontSize:17
  },
  repeatBody: {
    height: 70,
    backgroundColor: 'white',
    borderColor: '#d7dbe2',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 10,
  },
  repeatItem: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 7,
  },
  locationRow: {
    height: 65,
    backgroundColor:'white',
    borderColor: '#d7dbe2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
    flexDirection: 'row',
  },
  placeHolder: {
    color: '#d7dbe2',
    fontSize: 17
  },
  locationTextStyle: {
    fontFamily:'Avenir',
    fontSize:17
  },
})

module.exports = AddPage;
