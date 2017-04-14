// Stats Page

'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text, 
    Image
  } from 'react-native';
import styles from '../styles';
import NavBar from '../components/NavBar';

class StatsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style = {{flex:1}}>
       <View style = {styles.screenContainer}>   
        <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{justifyContent: 'center'}}>Stats Page</Text>
        </View>
       </View>
         <NavBar navigator={this.props.navigator}/>
      </View>
    );
  }  
}

module.exports = StatsPage;
