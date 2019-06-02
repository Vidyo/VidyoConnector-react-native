import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

export default class Toolbar extends Component {

  get computedSources() {
    return {
      callButtonImage:       this.props.callButtonState       ? require('../assets/callEnd.png')       : require('../assets/callStart.png'),
      cameraButtonImage:     this.props.cameraButtonState     ? require('../assets/cameraOff.png')     : require('../assets/cameraOn.png'),
      microphoneButtonImage: this.props.microphoneButtonState ? require('../assets/microphoneOff.png') : require('../assets/microphoneOn.png')
    }
  }

  render() {
    if (this.props.isToolbarHidden) {
      return (
        <View style={ styles.wrapper }>
          <TouchableOpacity
              style   = { styles.arrowHelperButton }
              onPress = { this.props.togglePressHandler }>
            <Image 
              style  = { styles.arrowHelperImage }
              source = { require('../assets/toolbar-arrow-up.png') }
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={ styles.wrapper }>
          <TouchableOpacity
              style   = { styles.arrowHelperButton }
              onPress = { this.props.togglePressHandler }>
            <Image 
              style  = { styles.arrowHelperImage }
              source = { require('../assets/toolbar-arrow-down.png') }
            />
          </TouchableOpacity>
          <View style = { styles.toolbar }>
            <View style = { styles.toolbarLeft } />
            <View style = { styles.toolbarCenter }>
              <TouchableHighlight 
                  style   = { styles.toolbarButton } 
                  onPress = { this.props.cameraButtonPressHandler }>
                <Image 
                    style  = { styles.buttonImage }
                    source = { this.computedSources.cameraButtonImage }
                />
              </TouchableHighlight>
              <TouchableHighlight 
                  style   = { styles.toolbarButton } 
                  onPress = { this.props.callButtonPressHandler }>
                <Image 
                    style   = { styles.buttonImage }
                    source  = { this.computedSources.callButtonImage }
                />
              </TouchableHighlight>
              <TouchableHighlight 
                  style   = { styles.toolbarButton } 
                  onPress = { this.props.microphoneButtonPressHandler }>
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
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection:     "column",
    alignItems:        "center",
    justifyContent:    "center",
    width:             "100%"
  },
  toolbar: {
    flexDirection:     "row",
    alignItems:        "flex-end",
    height:             50
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
    backgroundColor:    "rgba(0, 0, 0, 0.25)",
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
    width:               23,
    height:              23
  },
  text: {
    fontSize:            12,
    color:              "rgba(60, 60, 60, 0.25)",
    marginTop:          "85%"
  },
  arrowHelperButton: {
    backgroundColor:    "rgba(0, 0, 0, 0.15)",
    flexDirection:      "row",
    alignItems:         "center",
    justifyContent:     "center",
    margin:              20,
    width:               40,
    height:              20,
    borderRadius:        20
  },
  arrowHelperImage: {
    width:               16,
    height:              12,
    opacity:             0.3,
    marginTop:           20,
    marginBottom:        20,
  }
});
