import React, { Component } from 'react';
import {
    NativeModules,
    StyleSheet,
    Keyboard,
    AppState,
    Text,
    View
} from 'react-native';

import EventDispatcher from './components/EventDispatcher';
import EntranceForm    from './components/EntranceForm'
import FrameLayout     from './components/FrameLayout';
import Toolbar         from './components/Toolbar'

const VidyoConnector = NativeModules.VidyoConnectorManager;

type Props = {};
export default class App extends Component <Props> {
    
    constructor(props) {
        super(props);
        this.state = {
            /* Toolbar props */
            callButtonState:        true,
            cameraButtonState:      true,
            microphoneButtonState:  true,
            connectionStatus:       '',
            clientVersion:          '',
            /* Entrance form */
            host:                   'prod.vidyo.io',
            token:                  '',
            displayName:            'Guest',
            resourceId:             'demoRoom',
            showEntranceForm:       true,
            
            keyboardDidShow:        false,
        }
        
        connectorCreated = false;
        connected        = false;
        appState         = AppState.currentState;
    }
    
    componentWillMount() {
        this.connectOnSuccess        = EventDispatcher.addListener('Connect:onSuccess',      this._onSuccess.bind(this));
        this.connectOnFailure        = EventDispatcher.addListener('Connect:onFailure',      this._onFailure.bind(this));
        this.connectOnDisconnected   = EventDispatcher.addListener('Connect:onDisconnected', this._onDisconnected.bind(this));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',  this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',  this._keyboardDidHide.bind(this));
        
        this.setState({ connectionStatus: 'Initializing...',
                      callButtonState:  !this.connected });
    }
    
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        
        if (!this.connectorCreated) {
            this.createConnector();
        }
        this.showVideoLayout();
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        
        this.connectOnSuccess       .remove();
        this.connectOnFailure       .remove();
        this.connectOnDisconnected  .remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

        if (this.connectorCreated) {
            this.destroyConnector();
        }
    }
    
    createConnector() {
        let remoteParticipants = 8,
            logFileFilter      = 'warning all@VidyoConnector info@VidyoClient',
            logFileName        = '',
            userData           = 0;
        
        VidyoConnector.create(remoteParticipants, logFileFilter, logFileName, userData)
        .then((status) => {
              if (status) {
                this.connectorCreated = status;
                this.setState({ connectionStatus: 'Ready to connect' });
                VidyoConnector.getVersion( clientVersion => this.setState({ clientVersion }));
              }
        }).catch((error) => {
            //
        });
    }
    
    showVideoLayout() {
        VidyoConnector.showViewCustom(marginLeft   = 0,
                                      marginTop    = 0,
                                      layoutWidth  = 1,       // 100%
                                      layoutHeight = 0.88);   // 88%
    }
    
    toggleConnect() {
        this.connected ? VidyoConnector.disconnect() :
        VidyoConnector.connect(this.state.host,
                               this.state.token,
                               this.state.displayName,
                               this.state.resourceId);
    }
    
    destroyConnector() {
        VidyoConnector.destroy();
    }
    
    callButtonPressHandler(event) {
        this.setState({ callButtonState: !this.state.callButtonState });
        if (this.connectorCreated) {
            this.toggleConnect();
        }
    }
    
    cameraButtonPressHandler(event) {
        this.setState({ cameraButtonState: !this.state.cameraButtonState });
        if (this.connectorCreated) {
            VidyoConnector.setCameraPrivacy(this.state.cameraButtonState);
        }
    }
    
    microphoneButtonPressHandler(event) {
        this.setState({ microphoneButtonState: !this.state.microphoneButtonState })
        if (this.connectorCreated) {
            VidyoConnector.setMicrophonePrivacy(this.state.microphoneButtonState);
        }
    }
    
    inputTextChanged(event) {
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
    
    _onSuccess() {
        this.connected = true;
        this.setState({ connectionStatus: `Connected`,
                      callButtonState:  false,
                      showEntranceForm: false });
    }
    
    _onFailure(reason) {
        this.connected = false;
        this.setState({ connectionStatus: `Failed: ${reason}`,
                      callButtonState:  true,
                      showEntranceForm: true });
    }
    
    _onDisconnected(reason) {
        this.connected = false;
        this.setState({ connectionStatus: `Disconnected: ${reason}`,
                      callButtonState:  true,
                      showEntranceForm: true });
    }
    
    _keyboardDidShow() {
        this.setState({ keyboardDidShow: true });
    }
    
    _keyboardDidHide() {
        this.setState({ keyboardDidShow: false });
    }
    
    _handleAppStateChange(nextAppState) {
        if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
            VidyoConnector.setForegroundMode();
        } else {
            VidyoConnector.setBackgroundMode();
        }
        this.appState = nextAppState;
    }
    
    render() {
        return (
                <View>
                    <View style = { styles.header }>
                        <Text style = { styles.message }>{ this.state.keyboardDidShow ? '' : this.state.connectionStatus }</Text>
                    </View>
                    <View style = { styles.body } >
                        <FrameLayout style = { styles.frame }  />
                    </View>
                    <View
                        style = { styles.footer }>
                        <Toolbar
                            style                 = { styles.toolbar }
                            callButtonState       = { this.state.callButtonState }
                            cameraButtonState     = { this.state.cameraButtonState }
                            microphoneButtonState = { this.state.microphoneButtonState }
                            clientVersion         = { this.state.clientVersion }
                
                            showToolbar           = { !this.state.keyboardDidShow }
                
                            callButtonPressHandler       = { this.callButtonPressHandler.bind(this) }
                            cameraButtonPressHandler     = { this.cameraButtonPressHandler.bind(this) }
                            microphoneButtonPressHandler = { this.microphoneButtonPressHandler.bind(this) }
                        />
                    </View>
                    <EntranceForm
                        host              = { this.state.host }
                        token             = { this.state.token }
                        resourceId        = { this.state.resourceId }
                        displayName       = { this.state.displayName }
                        showEntranceForm  = { this.state.showEntranceForm }
                    
                        inputTextChanged  = { this.inputTextChanged.bind(this) }
                    />
                </View>
                );
    }
}

const styles = StyleSheet.create({
header:{
         height:           "3%",
         width:            "100%",
         backgroundColor:  "rgb(40, 40, 40)"
},
body: {
         height:           "88%",
         width:            "100%"
},
footer: {
         height:           "9%",
         width:            "100%",
         backgroundColor:  "rgb(0, 0, 0)",
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
},
                                 
toolbar: {
         position:         "absolute"
}
});

