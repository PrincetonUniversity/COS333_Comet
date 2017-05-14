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
  Tabs,
  Item,
  CardItem,
  Card
} from 'native-base';
import {Pie, Bar} from 'react-native-pathjs-charts';
import {
  AppRegistry,
  StyleSheet,
  View,
  StatusBar,
  ListView
} from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles';
import StatsDisplay from '../components/StatsDisplay';
import Firebase from '../components/Firebase';
export default class StatsPage extends Component {
  constructor(props) {
    super(props);
    this.eventsRef = Firebase.database().ref()
    this.userid = Firebase.auth().currentUser.uid
    this.state = {
      totalAbsences: 1,
      totalPresences: 1,
      allEvents: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentDidMount() {
    var allList = Firebase.database().ref('/users/' + this.userid + '/')
    var tAbsences = 1
    var tPresences = 1
    // build list of today events & all events
    allList.on('value', (snap) => {
      snap.forEach((child) => {
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
          tAbsences += child.val().absent
          tPresences += child.val().present
        }
      });
      this.setState({
        totalAbsences: tAbsences,
        totalPresences: tPresences,
      });
    });
    this._listenForEvents(this.eventsRef);
  }

   _listenForEvents(eventsRef) {
    var allList = Firebase.database().ref('/users/' + this.userid + '/')

    // build list of today events & all events
    allList.on('value', (snap) => {
      var todayEvents = [];
      var allEvents = [];
      snap.forEach((child) => {
        // put all events into allEvents
        if (child.key != 'name' && child.key != 'today' && child.key != 'counter') {
          allEvents.push({
            eventName: child.val().eventName,
            absences: child.val().absent,
            presences: child.val().present,
          });
        }
      });
    //  allEvents.sort(this._sortEvents);
      this.setState({
        allEvents: this.state.allEvents.cloneWithRows(allEvents),
      });
    });
  }

  // sort events by their start times
  _sortEvents(a, b) {
    var aTime = moment(a.startTime, "h:mm A")
    var bTime = moment(b.startTime, "h:mm A")
    if (aTime < bTime)
      return -1;
    else if (aTime > bTime)
      return 1;
    return 0;
  }

 /* _renderEvent(event) {
    return (
      <View style={localStyles.eventRow}>
        <View style={localStyles.box1}>
          <Text style={{fontSize: 15, fontFamily:'Avenir'}}>{event}</Text>
        </View>
        <View style={localStyles.box2}>
          <Text style={{fontSize: 15, fontFamily:'Avenir', textAlign: 'right', color: 'green'}}>40</Text>
        </View>
        <View style={localStyles.box2}>
          <Text style={{fontSize: 15, fontFamily:'Avenir', textAlign: 'right', color: 'red'}}>10</Text>
        </View>
      </View>
    );
  }*/
  _renderEvent(event) {
    return (
      <StatsDisplay event={event} navigator={this.props.navigator}></StatsDisplay>
    );
  }

  render() {
    var a = this.state.totalAbsences
    var b = this.state.totalPresences
    var absentCounts = []
    var absentNames = []

    let StreakData = [{
      "name": "Absences",
      "count": a,
    }, {
      "name": "Presences",
      "count": b,
    }]

     let StreakOptions = {
      margin: {
        top: 1,
        left: 1,
        right: 1,
        bottom: 1
      },
      width: 300,
      height: 300,
      color: '#2980B9',
      r: 0,
      R: 110,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: 'Avenir',
        fontSize: 10,
        fontWeight: true,
        color: '#ECF0F1'
      }
    }
    return (

        <View style={styles.container}>
        <Container style={{flex:10}}>
            <Header style={{ backgroundColor: '#000048' }}>
              <Left/>
              <Body>
                <Title style={{color: 'white', fontFamily:'Avenir-medium'}}>Your Stats</Title>
              </Body>
              <Right/>
            </Header>
            <StatusBar
               barStyle="light-content"
            />

            <View style={styles.screenContainer}>
              <Body>
                    <Pie
                data={StreakData}
                options={StreakOptions}
                accessorKey="count" />
                <Text style={{color: 'green', fontSize: 30, fontFamily:'Avenir-light'}}>{this.state.totalPresences}
                  <Text style={{color: '#545454', fontSize: 30, fontFamily:'Avenir-light'}}> |
                    <Text style={{color: 'red', fontSize: 30, fontFamily:'Avenir-light'}}> {this.state.totalAbsences}
                    </Text>
                  </Text>
                </Text>
              </Body>
              <Content/>
              <Card>
                  <CardItem header style={{backgroundColor: '#5CACEE', height:35}}>
                      <Text style={{color: 'white', fontSize: 14, fontFamily:'Avenir-medium'}}>{"Your Events:"}</Text>
                  </CardItem>
                  <ListView dataSource={this.state.allEvents}
                    renderRow={this._renderEvent.bind(this)}
                    enableEmptySections={true}
                    bounces={false}/>
              </Card>
            </View>

          </Container>
          <NavBar navigator={this.props.navigator}/>
        </View>
    );
  }
}

const localStyles = StyleSheet.create({
  eventRow: {
    alignItems: 'center',
    padding: 12,
    borderWidth: .5,
    borderColor: '#eaecef',
    flexDirection: 'row'
  },
  eventTitle: {
    fontSize: 15,
    fontFamily:'Avenir'
  },
  present: {
    fontSize: 15,
    fontFamily:'Avenir',
    color: 'green'
  },
  absent: {
    fontSize: 15,
    fontFamily:'Avenir',
    color: 'red'
  },
  box1: {
    flex:8,
  },
  box2: {
    flex:1,
  },
});

module.exports = StatsPage;
