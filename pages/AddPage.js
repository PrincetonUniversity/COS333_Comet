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
      sunday: false
    };
    this.setState = this.setState.bind(this)
    this._updateLocation = this._updateLocation.bind(this)
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
    else {
      this.setState({
        startTime: startTime,
        endTime: endTime,
        startDate: startDate,
        endDate: endDate,
      }, this._addItem());
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
          <Text style={{fontFamily:'Avenir-medium',}}>{section.title}</Text>
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
            <Text style={{fontFamily:'Avenir-medium',}}>Repeats</Text>
          </View>
        </View>

        <View style={localStyles.repeatBody}>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Sun.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>Sun</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._M.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>M</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._T.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>T</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._W.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>W</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Th.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>Th</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._F.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>F</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Sat.bind(this)}/>
            <Text style={{fontFamily:'Avenir',}}>Sat</Text>
          </View>
        </View>
      </View>;

    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
              <Text onPress={()=>this.props.navigator.pop()} style={{fontSize: 15, color: '#d7dbe2', fontFamily:'Avenir-medium'}}>Cancel</Text>
          </View>
          <View style = {{flex: 3, marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.titleBarText}>New Event</Text>
          </View>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
              <Text onPress={this._checkFields.bind(this)} style={{fontSize: 15, color: '#d7dbe2', fontFamily:'Avenir-medium'}}>Add</Text>
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
    height: 50,
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
  },
  repeatBody: {
    height: 65,
    backgroundColor: 'white',
    borderColor: '#d7dbe2',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 10,
  },
  repeatItem: {
    height: 55,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 7,
  },
  locationRow: {
    height: 50,
    backgroundColor:'white',
    borderColor: '#d7dbe2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
    flexDirection: 'row',
  },
  placeHolder: {
    color: '#d7dbe2',
    fontSize: 15
  },
  locationTextStyle: {
    fontFamily:'Avenir',
  },
})

module.exports = AddPage;
