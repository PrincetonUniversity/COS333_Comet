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

const SECTIONS = [{title: 'Starts',}, {title: 'Ends',}];

class EditPage extends Component {
  static defaultProps = {
    startDate: new Date(),
    endDate: new Date(),
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  };

  constructor(props) {
    super(props);
    this.props.startDate.setMinutes(0)
    var h = this.props.startDate.getHours();
    if (h == 12) {
      this.props.endDate.setHours(1)
    }
    else {
      this.props.endDate.setHours(h + 1)
    }
    this.props.endDate.setMinutes(0)
    this.itemsRef = Firebase.database().ref();
    this.state = {
      loading: false,
      eventName: this.props.eventName,
      location: {name : this.props.location.name, latitude: this.props.location.latitude, longitude: this.props.location.longitude},
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      keyID: this.props.keyID,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
    };
    this.complete = false
    this.setState = this.setState.bind(this)
    this._updateLocation = this._updateLocation.bind(this)
  }

  _checkFields() {
    if (this.state.eventName === '' || this.state.day === '' || this.state.location === '') {
      Alert.alert('Error', 'Fields must not be empty.');
    }
    else if (this.state.endDate.getTime() < this.state.startDate.getTime()) {
      Alert.alert('Error', 'End date cannot come before start date.');
    }
    else {
      this._updateItem();
    }
  }

  _updateItem() {
    var days = [];
    if (this.state.monday == true) {days.push("M")}
    if (this.state.tuesday == true) {days.push("T")}
    if (this.state.wednesday == true) {days.push("W")}
    if (this.state.thursday == true) {days.push("Th")}
    if (this.state.friday == true) {days.push("F")}
    if (days.length == 0) {days.push(" ")}

    //(eventName, location, days, key, startDate, endDate

    this.props.checkEdited(this.state.eventName, this.state.location, days, this.state.keyID,
                              this.state.startDate, this.state.endDate)
    this.props.navigator.pop();
    // a new schedule entry
  /*  var scheduleData = {
      eventName: this.state.eventName,
      location: this.state.location,
      startDate: this.state.startDate.toLocaleDateString(),
      startTime: this.state.startDate.toLocaleTimeString(),
      endDate: this.state.endDate.toLocaleDateString(),
      endTime: this.state.endDate.toLocaleTimeString(),
      day: days,
    };

    var userid = Firebase.auth().currentUser.uid
    Firebase.database().ref('/users/' + userid + '/today/').child(this.state.keyID).remove()
    Firebase.database().ref().child('/users/' + userid + '/' + this.state.keyID).update(scheduleData);
    this._wait();*/
  }

  _wait() {
    if (this.complete == true) {
      this.props.navigator.pop();
    }
    else {
      this._wait();
    }
  }

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

  _renderHeader(section) {
    if (section.title == 'Starts') {
      var date = this.state.startDate
    }
    else if (section.title == 'Ends') {
      var date = this.state.endDate
    }
    var text = moment(date).format('ll') + '   ' + moment(date).format('LT')
    return (
      <View style={localStyles.inputRow}>
        <View style={localStyles.inputText}>
          <Text>{section.title}</Text>
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
            date={this.state.startDate}
            style={{borderBottomWidth: 1, borderColor: '#d7dbe2',backgroundColor:'white'}}
            mode="datetime"
            minuteInterval={5}
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onStartDateChange}/>
        </View>
      );
    }
    else if (section.title == 'Ends') {
      return (
        <View>
          <DatePickerIOS
            date={this.state.endDate}
            style={{borderBottomWidth: 1, borderColor: '#d7dbe2',backgroundColor:'white'}}
            mode="datetime"
            minuteInterval={5}
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
          defaultValue={this.state.eventName}
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
            <Text>Repeats</Text>
          </View>
        </View>

        <View style={localStyles.repeatBody}>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._M.bind(this)}/>
            <Text>M</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._T.bind(this)}/>
            <Text>T</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._W.bind(this)}/>
            <Text>W</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._Th.bind(this)}/>
            <Text>Th</Text>
          </View>
          <View style = {localStyles.repeatItem}>
            <RadioButton call={this._F.bind(this)}/>
            <Text>F</Text>
          </View>
        </View>
      </View>;

    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
              <Text onPress={()=>this.props.navigator.pop()} style={{fontSize: 15, color: 'navy'}}>Cancel</Text>
          </View>
          <View style = {{flex: 3, marginTop: 20, alignItems: 'center'}}>
              <Text style={styles.titleBarText}>Edit Event</Text>
          </View>
          <View style = {{flex: 1, marginTop: 20, marginRight: 17, flexDirection: 'row', justifyContent:'flex-end'}}>
              <Text onPress={this._checkFields.bind(this)} style={{fontSize: 15, color: 'navy'}}>Save</Text>
          </View>
        </View>
        <ScrollView style={styles.container}>
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
    color: 'navy'
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
  },
})

module.exports = EditPage;
