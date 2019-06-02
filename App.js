import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Animated,
    Keyboard,
    AppState,
    Text,
    View
} from 'react-native';

import Toolbar            from './components/Toolbar';
import EntranceForm       from './components/EntranceForm'
import VidyoConnectorView from './components/VidyoConnectorView';

type Props = {};
const { height: scrHeight } = Dimensions.get('screen');

export default class App extends Component <Props> {

    constructor(props) {
        super(props);
        this.state = {
            /* Toolbar props */
            callButtonState:        false,
            cameraButtonState:      false,
            microphoneButtonState:  false,
            connectionStatus:       '',
            clientVersion:          '',
            /* Entrance form */
            host:                   'prod.vidyo.io',
            token:                  '',
            displayName:            'Guest',
            resourceId:             'experimental',

            connectorMode:          'VIDYO_CONNECTORMODE_Foreground',

            isEntranceFormHidden:   false,
            isToolbarHidden:        false,
            keyboardDidShow:        false,

            toolbarBounceValue:     new Animated.Value(0),
            eFormBounceValue:       new Animated.Value(0),

            connected:              false,
            
            appState:               AppState.currentState
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',  this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',  this._keyboardDidHide);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    onConnect = (payload) => {
        const { status, reason } = payload;
        this.setState({
            connectionStatus:       reason,
            callButtonState:        !!status,
            connected:              !!status
        }, () => {
            this._toggleEntranceForm(!!status);
            this._toggleToolbar(!!status);
        });
    }

    onDisconnect = (payload) => {
        this.setState({ 
            connected:              false,
            connectionStatus:       payload.reason,
            callButtonState:        false
        }, () => {
            this._toggleEntranceForm(false);
            this._toggleToolbar(false);
        });
    }

    onParticipantJoined = (payload) => {
        this.setState({ connectionStatus: payload.participant.name + ' joined' });
    }

    onParticipantLeft = (payload) => {
        this.setState({ connectionStatus: payload.participant.name + ' left' });
    }

    _toggleConnect() {
        if (this.state.connected) {
            this.vidyoConnector.disconnect();
        } else {
            let { host, token, displayName, resourceId } = this.state;
            this.vidyoConnector.connect(host, token, displayName, resourceId);
        }
    }

    _inputTextChanged = (event) => {
        switch(event.target) {
            case 'host':
                this.setState({ host: event.text });
                break;
            case 'token':
                this.setState({ token: event.text });
                break;
            case 'resourceId':
                this.setState({ resourceId: event.text });
                break;
            case 'displayName':
                this.setState({ displayName: event.text });
                break;
        }
    }

    _toolbarTogglePressHandler = (event) => {
        this._toggleToolbar(!this.state.isToolbarHidden);
    }

    _callButtonPressHandler = (event) => {
        this.setState({
            callButtonState: !this.state.callButtonState
        }, () => {
            this._toggleConnect();
        });
    }

    _cameraButtonPressHandler = (event) => {
        this.setState({ cameraButtonState: !this.state.cameraButtonState });
    }

    _microphoneButtonPressHandler = (event) => {
        this.setState({ microphoneButtonState: !this.state.microphoneButtonState });
    }

    _keyboardDidShow = () => {
        this.setState({ keyboardDidShow: true });
    }
    
    _keyboardDidHide = () => {
        this.setState({ keyboardDidShow: false });
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.setState({ connectorMode: "VIDYO_CONNECTORMODE_Foreground" });
        } else if(nextAppState === 'background') {
            this.setState({ connectorMode: "VIDYO_CONNECTORMODE_Background" });
        }
        this.setState({ appState: nextAppState });
    }

    _toggleEntranceForm = (hidden=true) => {
        const { eFormBounceValue, isEntranceFormHidden } = this.state;
        if (isEntranceFormHidden === hidden) {
            return;
        }
        Animated.spring(eFormBounceValue, {
            toValue:    !isEntranceFormHidden ? -400 : 0,
            velocity:   2,
            tension:    1,
            friction:   4,
        }).start();
        this.setState({ isEntranceFormHidden: hidden });
    }

    _toggleToolbar = (hidden=true) => {
        const { toolbarBounceValue, isToolbarHidden } = this.state;
        if (isToolbarHidden === hidden) {
            return;
        }
        Animated.spring(toolbarBounceValue, {
            toValue:    isToolbarHidden ? 0 : 70,
            velocity:   3,
            tension:    1,
            friction:   8,
        }).start();
        this.setState({ isToolbarHidden: hidden });
    }

    _resetToggles = (hiddern) => {
        this.setState({
            isToolbarHidden: hiddern,
            isEntranceFormHidden: hiddern
        }, () => {
            this._toggleEntranceForm();
            this._toggleToolbar();
        });
    }

    render() {
      return (
        <View>
          <View style = { styles.body } >
            <VidyoConnectorView 
              ref                         = {ref => this.vidyoConnector = ref}
              style                       = {styles.frame}

              viewStyle                   = "ViewStyleDefault"
              remoteParticipants          = {8}
              logFileFilter               = "warning all@VidyoConnector info@VidyoClient"
              logFileName                 = ""
              userData                    = {0}

              cameraPrivacy               = {this.state.cameraButtonState}
              microphonePrivacy           = {this.state.microphoneButtonState}

              mode                        = {this.state.connectorMode}

              onConnect                   = {this.onConnect}
              onDisconnect                = {this.onDisconnect}
              onParticipantJoined         = {this.onParticipantJoined}
              onParticipantLeft           = {this.onParticipantLeft}

            />
            <View style = { styles.banner }>
              <Text style = { styles.message }>{ this.state.keyboardDidShow ? '' : this.state.connectionStatus }</Text>
            </View>
          </View>
          <Animated.View
                style = { [ styles.footer, { transform: [{ translateY: this.state.toolbarBounceValue }] } ] }>
            <View>
              <Toolbar
                callButtonState       = { this.state.callButtonState }
                cameraButtonState     = { this.state.cameraButtonState }
                microphoneButtonState = { this.state.microphoneButtonState }
                clientVersion         = { this.state.clientVersion }
          
                isToolbarHidden       = { this.state.isToolbarHidden || this.state.keyboardDidShow }
      
                togglePressHandler           = { this._toolbarTogglePressHandler }
                callButtonPressHandler       = { this._callButtonPressHandler }
                cameraButtonPressHandler     = { this._cameraButtonPressHandler }
                microphoneButtonPressHandler = { this._microphoneButtonPressHandler }
              />
            </View>
          </Animated.View>
          <EntranceForm
            host                  = { this.state.host }
            token                 = { this.state.token }
            resourceId            = { this.state.resourceId }
            displayName           = { this.state.displayName }

            eFormBounceValue      = { this.state.eFormBounceValue }
            isEntranceFormHidden  = { this.state.isEntranceFormHidden }
                    
            inputTextChanged  = { this._inputTextChanged }
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
    banner:{
        position:         "absolute",
        width:            "100%",
        backgroundColor:  "rgba(40, 40, 40, 0.5)"
    },
    body: {
        height:           "100%",
        width:            "100%",
        backgroundColor:  "rgba(0, 0, 0, 0.4)"
    },
    footer: {
        position:         "absolute",
        marginTop:        scrHeight-210,
        width:            "100%"
    },
    frame: {
        marginTop:        0,
        width:            "100%",
        height:           "100%",
        backgroundColor:  "rgb(20, 20, 20)",
    },
    message: {
        textAlign:        "center",
        color:            "rgb(180, 180, 180)"
    }
});

