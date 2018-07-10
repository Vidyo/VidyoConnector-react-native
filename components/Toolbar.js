import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

export default class Toolbar extends Component {

  get computedSources() {
    return {
      callButtonImage:        this.props.callButtonState        ? require('../images/callStart.png')    : require('../images/callEnd.png'),
      cameraButtonImage:      this.props.cameraButtonState      ? require('../images/cameraOn.png')     : require('../images/cameraOff.png'),
      microphoneButtonImage:  this.props.microphoneButtonState  ? require('../images/microphoneOn.png') : require('../images/microphoneOff.png')
    }
  }

  render() {
    if (this.props.showToolbar) {
      return (
        <View style = { styles.toolbar }>
          <View style = { styles.toolbarLeft } />
          <View style = { styles.toolbarCenter }>
            <TouchableHighlight 
                id      = { 0 }
                style   = { styles.toolbarButton } 
                onPress = { this.props.cameraButtonPressHandler.bind(this) }>
              <Image 
                  style = { styles.buttonImage }
                  source = { this.computedSources.cameraButtonImage }
              />
            </TouchableHighlight>
            <TouchableHighlight 
                style   = { styles.toolbarButton } 
                onPress = { this.props.callButtonPressHandler.bind(this) } >
              <Image 
                  style   = { styles.buttonImage }
                  source  = { this.computedSources.callButtonImage }
              />
            </TouchableHighlight>
            <TouchableHighlight 
                style   = { styles.toolbarButton } 
                onPress = { this.props.microphoneButtonPressHandler.bind(this) }>
              <Image 
                  style   = { styles.buttonImage }
                  source  = { this.computedSources.microphoneButtonImage }
              />
            </TouchableHighlight>
          </View>
          <View style = { styles.toolbarRight }>
            <Text style = { styles.text }>
              { this.props.clientVersion }
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection:    "row",
    alignItems:       "center",
    height:            60
  },
  
  toolbarLeft: {
    paddingLeft:        10,
    width:             "30%"
  },

  toolbarCenter: {
    width:             "40%",
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center"
  },

  toolbarRight: {
    paddingRight:        10,
    width:              "30%",
    flexDirection:      "row",
    justifyContent:     "flex-end",
  },

  toolbarButton: {
    backgroundColor:    "rgb(0, 0, 0)",
    flexDirection:      "row",
    alignItems:         "center",
    justifyContent:     "center",
    marginLeft:          5,
    marginRight:         5,
    width:               50,
    height:              50,
    borderRadius:        20
  },

  buttonImage: {
    width: 25,
    height: 25
  },

  text: {
    color: "rgb(60, 60, 60)"
  }
});
