'use strict';
import React, { Component } from 'react';
import { 
  Container, 
  Content, 
  Header,
  Footer, 
  FooterTab, 
  Button, 
  Icon, 
  Text,
  Left,
  Right,
  Body,
  Title, 
  Tab,
  Tabs
} from 'native-base';
import {
  AppRegistry,
  StyleSheet,
  //Text,
  View
} from 'react-native';

// import Tab1 from './tabOne';
// import Tab2 from './tabTwo';

// import React, { Component, View, Text, StyleSheet } from 'react-native';

export default class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // render () {
  //   return (
  //       <Navigator
  //           initialRoute={{id: 'SplashPage', name: 'Index'}}
  //           renderScene={this.renderScene.bind(this)}
  //           configureScene={(route) => {
  //       if (route.sceneConfig) {
  //         return route.sceneConfig;
  //       }
  //       return Navigator.SceneConfigs.VerticalDownSwipeJump;
  //     }}/>
  //   );
  // }

  render() {
    return (
        <Container>
            <Header style={{ backgroundColor: 'gray' }}>
              <Left>
                <Button transparent>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>Attendance Stats</Title>
              </Body>
              <Right />
            </Header>
            
            <Text> </Text>
            <Text> </Text>
            
            <Body>
              <Icon ios='ios-ionic' android="md-ionic" style={{fontSize: 300, color: 'gray'}}/>
            </Body>

            <Content />
            <Body>
            <Button style={{backgroundColor: 'gray'}}>
              <Text> 78 Absences </Text>
            </Button>
            </Body>


            <Footer style={{ backgroundColor: 'gray' }}>
                <FooterTab>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon name="apps" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon ios='ios-analytics' android="md-analytics" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon ios='ios-grid' android="md-grid" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                    <Button style={{ backgroundColor: 'gray' }}>
                        <Icon name="person" style={{fontSize: 20, color: 'white'}}/>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('Stats', () => Stats);

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Navigator,
//   Text,
//   View,
//   ToolbarAndroid,
//   ActivityIndicator
// } from 'react-native';
// import Login from './src/pages/Login';
// import Account from './src/pages/Account';
// import Home from './src/pages/Home';
// import styles from './src/styles/baseStyles.js';
// import * as firebase from 'firebase';

// const firebaseConfig = {
//   apiKey: "AIzaSyAli8NAL2znj8XMlFtWR83E0NG41KFWnUY",
//   authDomain: "comet-e4c47.firebaseapp.com",
//   databaseURL: "https://comet-e4c47.firebaseio.com",
//   storageBucket: "comet-e4c47.appspot.com",
// };

// // Initialize the firebase app here and pass it to other components as needed. Only initialize on startup.
// const firebaseApp = firebase.initializeApp(firebaseConfig);

// class FirebaseAuth extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       // the page is the screen we want to show the user, we will determine that
//       // based on what user the firebase api returns to us.
//       page: null
//     };
//   }

//   componentWillMount(){
//     // We must asynchronously get the auth state, if we use currentUser here, it'll be null
//     const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
//       // If the user is logged in take them to the accounts screen
//       if (user != null) {
//         this.setState({page: Account});
//         return;
//       }
//       // otherwise have them login
//       this.setState({page: Home});
//       // unsubscribe this observer
//       unsubscribe();
//     });
//   }

//   render() {
//     if (this.state.page) {
//       return (
//         // Take the user to whatever page we set the state to.
//         // We will use a transition where the new page will slide in from the right.
//         <Navigator
//           initialRoute={{component: this.state.page}}
//           configureScene={() => {
//             return Navigator.SceneConfigs.FloatFromRight;
//           }}
//           renderScene={(route, navigator) => {
//             if(route.component){
//               // Pass the navigator the the page so it can navigate as well.
//               // Pass firebaseApp so it can make calls to firebase.
//               return React.createElement(route.component, { navigator, firebaseApp});
//             }
//         }} />
//       );
//     } else {
//       return (
//         // Our default loading view while waiting to hear back from firebase
//         <View style={styles.container}>
//           <ToolbarAndroid title="RN Firebase Auth" />
//           <View style={styles.body}>
//             <ActivityIndicator size="large" />
//           </View>
//         </View>
//       );
//     }
//   }
// }

// AppRegistry.registerComponent('Comet', () => FirebaseAuth);