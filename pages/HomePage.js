// Home Page

import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text, 
    Image
  } from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles'

class HomePage extends Component {
  render() {
    return (
      <View style = {styles.container}>
       <View style = {{flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <Image style = {{width: 200, height: 200}}
               source={{uri: 'https://previews.123rf.com/images/natalyon/natalyon1502/natalyon150200013/36745703-Doodle-space-elements-collection-in-black-and-white-ISS-moonwalker-planet-comet-moon-astronaut-alien-Stock-Vector.jpg'}}
        />
        <Text>
          Welcome to Comet!
        </Text>
       </View>
        <NavBar></NavBar>
      </View>
    );
  }  
}

module.exports = HomePage;

//justifyContent: 'center', alignItems: 'center'