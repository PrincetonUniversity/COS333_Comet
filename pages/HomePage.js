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

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state={
      loading: false,
    }
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

  _navigateSchedule(){
    this.props.navigator.push({
      name: 'SchedulePage', // Matches route.name
    })
  }

}

module.exports = HomePage;
