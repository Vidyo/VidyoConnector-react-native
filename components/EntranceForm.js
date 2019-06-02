import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Animated,
  Text
} from 'react-native';

export default class EntranceForm extends Component {
    render() {
        return (
            <Animated.View style={ [ styles.form, { transform: [{ translateY: this.props.eFormBounceValue }] }] }>
                <Text style={ styles.title }>{ 'Join to conference' }</Text>      
                <TextInput style = { styles.input }
                    placeholder  = { 'host' }
                    value        = { this.props.host } 
                    onChangeText = { text => { this.props.inputTextChanged({ target: 'host', text }) } }
                />
                <TextInput style = { styles.input }
                    placeholder  = { 'token' }
                    value        = { this.props.token }
                    onChangeText = { text => this.props.inputTextChanged({ target: 'token', text }) }
                />
                <TextInput style = { styles.input }
                    placeholder  = { 'displayName' }
                    value        = { this.props.displayName }
                    onChangeText = { text => this.props.inputTextChanged({ target: 'displayName', text }) }
                />
                <TextInput style = { styles.input }
                    placeholder  = { 'resourceId' }
                    value        = { this.props.resourceId } 
                    onChangeText = { text => this.props.inputTextChanged({ target: 'resourceId', text }) }
                />
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    form: {
        padding:          "2%",
        marginTop:        "8%",
        marginLeft:       "4%",
        width:            "92%",
        height:           350,
        backgroundColor:  "rgba(0, 0, 0, 0.35)",
        position:         "absolute",
        borderRadius:     7
    },
    input: {
        marginTop:          "2%",
        padding:            "2%",
        paddingTop:         "5%",
        paddingBottom:      "1%",
        borderBottomWidth:  1,
        borderColor:        "rgba(0, 0, 0, 0.25)",
        color:              "rgba(255, 255, 255, 0.5)"
    },
    title: {
        fontSize:         18,
        textAlign:        "center",
        marginTop:        "5%",
        marginBottom:     "5%",
        color:            "rgba(255, 255, 255, 0.4)"
    }
});
