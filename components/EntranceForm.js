import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';

export default class EntranceForm extends Component {
    render() {
    if (this.props.showEntranceForm){
        return (
            <View style={ styles.form }>
                <Text style={ styles.title }>{ 'Join to conference' }</Text>      
                <TextInput style = { Platform.OS === 'ios' ? styles.input : {} }
                    placeholder  = { 'host' }
                    value        = { this.props.host } 
                    onChangeText = { text => { this.props.inputTextChanged({ target: 'host', text }) } }
                />
                <TextInput style = { Platform.OS === 'ios' ? styles.input : {} }
                    placeholder  = { 'token' }
                    value        = { this.props.token }
                    onChangeText = { text => this.props.inputTextChanged({ target: 'token', text }) }
                />
                <TextInput style = { Platform.OS === 'ios' ? styles.input : {} }
                    placeholder  = { 'displayName' }
                    value        = { this.props.displayName }
                    onChangeText = { text => this.props.inputTextChanged({ target: 'displayName', text }) }
                />
                <TextInput style = { Platform.OS === 'ios' ? styles.input : {} }
                    placeholder  = { 'resourceId' }
                    value        = { this.props.resourceId } 
                    onChangeText = { text => this.props.inputTextChanged({ target: 'resourceId', text }) }
                />
            </View>
          );
    }
    else {
        return null;
    }
  }
}

const styles = StyleSheet.create({
    form: {
        padding:          "2%",
        marginTop:        "6%",
        marginLeft:       "4%",
        width:            "92%",
        height:           300,
        backgroundColor:  "rgba(255, 255, 255, 0.66)",
        position:         "absolute",
    },
    input: {
        marginTop:          "2%",
        padding:            "2%",
        paddingTop:         "5%",
        paddingBottom:      "1%",
        borderBottomWidth:  1,
        borderColor:        "gray"
    },
    title: {
        fontSize:         18,
        textAlign:        "center",
        marginTop:        "5%",
        marginBottom:     "5%"
    }
});
