'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

class RadioButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: false,
    };
  }

  _func(press) {
    this.setState({pressed: press});
    this.props.call();
  }

  render() {
    if (this.state.pressed == false) {
      return (
        <TouchableOpacity style={localStyles.button}
                          onPress={()=>this._func(!this.state.pressed)}/>
      );
    }
    else if (this.state.pressed == true) {
      return (
        <TouchableOpacity style={localStyles.button}
                          onPress={()=>this._func(!this.state.pressed)}>
            <View style={localStyles.pressedInside}/>
        </TouchableOpacity>
      );
    }
  }
}

var localStyles = StyleSheet.create({
  button: {
    height: 15,
    width: 15,
    backgroundColor:'white',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 2,
    borderRadius: 1.5,
  },
  pressedInside: {
    flex: 1,
    backgroundColor: 'navy'
  }
})

module.exports = RadioButton;
