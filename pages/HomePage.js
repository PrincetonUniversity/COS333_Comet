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
      <View style = {{flex:1}}>
       <View style = {styles.container}>   
        <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style = {{width: 200, height: 200, justifyContent: 'center'}}
                 source={{uri: 'https://previews.123rf.com/images/natalyon/natalyon1502/natalyon150200013/36745703-Doodle-space-elements-collection-in-black-and-white-ISS-moonwalker-planet-comet-moon-astronaut-alien-Stock-Vector.jpg'}}
          />
          <Text style={{justifyContent: 'center'}}>Welcome to Comet!</Text>
        </View>
       </View>
        <NavBar></NavBar>
      </View>
    );
  }  
}

module.exports = HomePage;
