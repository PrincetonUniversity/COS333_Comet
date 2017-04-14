'use strict';
import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Alert,
  ListView,
  AlertIOS,
} from 'react-native';
import styles from '../styles';
import Firebase from '../components/Firebase';

var tr = require("trim");

class AddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // used to display a progress indicator if waiting for a network response.
      loading: false,
      eventName: '',
      day: '',
      startTime: '',
      endTime: '',
      location:'',
    }
    this.itemsRef = Firebase.database().ref();
  }

  _checkFields() {
    if (this.state.eventName === '' || this.state.day === '' || this.state.startTime === '' || this.state.endTime === '' || this.state.location === '') {
      Alert.alert('Error', 'Fields must not be empty.');
    }
    else {
      this._addItem();
    }
  }
  _addItem() { 
    this.itemsRef.push({ eventName: this.state.eventName, day: this.state.day, startTime: this.state.startTime, endTime: this.state.endTime, location: this.state.location})
    this.props.navigator.pop();
  }

  render() {
    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ? <ActivityIndicator size="large"/> :
      <View>
        <TextInput
          style={styles.textInput}
          placeholder={"Event Name"}
          onChangeText={(text) => this.setState({eventName: tr(text)})} />

        <TextInput
          style={styles.textInput}
          placeholder={"Day of the Week"}
          onChangeText={(text) => this.setState({day: tr(text)})} />

        <TextInput
          style={styles.textInput}
          placeholder={"Start Time"} 
          onChangeText={(text) => this.setState({startTime: tr(text)})} />

        <TextInput
          style={styles.textInput}
          placeholder={"End Time"} 
          onChangeText={(text) => this.setState({endTime: tr(text)})} />

        <TextInput
          style={styles.textInput}
          placeholder={"Location"} 
          onChangeText={(text) => this.setState({location: tr(text)})} />

        <TouchableHighlight onPress={this._checkFields.bind(this)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Add</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={()=>this.props.navigator.pop()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Go Back to Schedule</Text>
        </TouchableHighlight>
      </View>;

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          {content}
        </View>
      </View>
    );
  }

}

module.exports = AddPage;
