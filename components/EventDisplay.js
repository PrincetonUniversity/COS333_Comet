import React, {Component} from 'react';
import {
    Text,
    AppRegistry,
    View,
    TouchableHighlight,
    Modal,
    Image,
	} from 'react-native';
import styles from '../styles.js';
import ModalExample from './ModalExample'
import { Container, Content, Card, CardItem, Body } from 'native-base';

class EventDisplay extends Component {
  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}>
           <View style={{flex:1, marginTop: 22}}>
              <View style={styles.eventCard}>
                <View style={{alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold', fontSize: 17}}>{this.props.event.eventName}</Text>
                </View>

                <View style={{marginTop:5}}>
                  <Text style={styles.eventText}>Days: {this.props.event.day}</Text>
                  <Text style={styles.eventText}>Time: {this.props.event.startTime} - {this.props.event.endTime}</Text>
                  <Text style={styles.eventText}>Location: {this.props.event.location}</Text>
                </View>

                <View style={{marginTop: 10,alignItems: 'center'}}>
                  <Image style = {{width: 250, height: 250, justifyContent: 'center'}}
                         source={{uri: 'https://ichef-1.bbci.co.uk/news/1024/media/images/82931000/jpg/_82931280_82931279.jpg'}}
                  />
                </View>

                <TouchableHighlight onPress={()=>this.setModalVisible(!this.state.modalVisible)} 
                                    style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Close</Text>
                </TouchableHighlight>
              </View>
           </View>
        </Modal>

        <TouchableHighlight onPress={()=>this._eventDetails()}>
          <View style={styles.eventContainer}>
            <Text style={styles.eventText}>{this.props.event.eventName}</Text>
          </View>
        </TouchableHighlight>
        </View>
    );
  }

  _eventDetails(){
    this.setModalVisible(true)
  }
}

module.exports = EventDisplay;