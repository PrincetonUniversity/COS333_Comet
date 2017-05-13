//to install:
// npm install react-native-pathjs-charts --save
// react-native link react-native-svg
// in node-modules/react-native-svg go to android/build.gradle change to 23.0.1 and 22

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
//import Bar from 'react-native-pathjs-charts';
import {Pie, Bar} from 'react-native-pathjs-charts';
import Svg from 'react-native-svg';

export default class StatsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let StreakData = [{
      "name": "Absences",
      "count": 50
    }, {
      "name": "Presences",
      "count": 100
    }]

    let StreakOptions = {
      margin: {
        top: 1,
        left: 1,
        right: 1,
        bottom: 1
      },
      width: 150,
      height: 150,
      color: '#2980B9',
      r: 20,
      R: 75,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: 'Arial',
        fontSize: 10,
        fontWeight: true,
        color: '#ECF0F1'
      }
    }

  let data = [
    [{
      "v": 30,
      "name": "Event 1"
    }],
    [{
      "v": 23,
      "name": "Event 2"
    }],
    [{
      "v": 19,
      "name": "Event 3"
    }],
    [{
      "v": 10,
      "name": "Event 4"
    }],
    [{
      "v": 15,
      "name": "Event 4"
    }]
  ]

  let options = {
    width: 200,
    height: 150,
    margin: {
      top: 20,
      left: 25,
      bottom: 30,
      right: 20
    },
    color: '#2980B9',
    gutter: 20,
    animate: {
      type: 'oneByOne',
      duration: 200,
      fillTransition: 3
    },
    axisX: {
      showAxis: true,
      showLines: true,
      showLabels: true,
      showTicks: true,
      zeroAxis: false,
      orient: 'bottom',
      label: {
        fontFamily: 'Arial',
        fontSize:10,
        fontWeight: true,
        fill: '#34495E'
      }
    },
    axisY: {
      showAxis: true,
      showLines: true,
      showLabels: true,
      showTicks: true,
      zeroAxis: false,
      orient: 'left',
      label: {
        fontFamily: 'Arial',
        fontSize: 10,
        fontWeight: true,
        fill: '#34495E'
      }
    }
  }
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Your Streak:
        </Text>
        <ScrollView>
          <Text></Text>
        </ScrollView>
        <Pie
          data={StreakData} />

{/*        <Text style={{backgroundColor: '#eaecef'}}>Events for Today:</Text>
         <ListView dataSource = {this.state.todayEvents}
                    renderRow={this._renderEvent.bind(this)}
                    enableEmptySections={true}/>
*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = StatsPage;
