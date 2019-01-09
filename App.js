import React, { Component } from 'react';
import {
    Platform,
    TouchableHighlight,
    Dimensions,
    StyleSheet,
    Animated,
    Keyboard,
    AppState,
    Text,
    View
} from 'react-native';

import EntranceForm    from './components/EntranceForm'
import FrameLayout     from './components/FrameLayout';
import Toolbar         from './components/Toolbar'
import CreateVidyoConnector from './bridge/VidyoConnector';

const { width, height } = Dimensions.get('screen');
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

            isEntranceFormHidden:   false,
            isToolbarHidden:        false,
            keyboardDidShow:        false,

            toolbarBounceValue:     new Animated.Value(0),
            eFormBounceValue:       new Animated.Value(0),        
        }
        vidyoConnector   = null;
        connected        = false;
        appState         = AppState.currentState;
    }
    
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',  this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',  this._keyboardDidHide.bind(this));

        this.setState({ connectionStatus: 'Initializing...',
                        callButtonState:  !this.connected });
    }
    
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);

        if (!this.vidyoConnector) {
            this.createConnector().then((vidyoConnector) => {
                this.vidyoConnector.ShowViewAt({
                    viewId: null,
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                });
                this.vidyoConnector.GetVersion().then( clientVersion => this.setState({ clientVersion }));

                this.registerVCEventListeners();

                this.setState({ connectionStatus: 'Ready to connect' });
            }).catch((error) => {
                //
            });
        }
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

        if (this.vidyoConnector) {
            this.destroyConnector();
        }
    }
    
    createConnector() {
        let viewId             = null,                      //
            viewStyle          = 'ViewStyleDefault',
            remoteParticipants = 8,
            logFileFilter      = 'warning all@VidyoConnector info@VidyoClient',
            logFileName        = '',
            userData           = 0;
        
        return CreateVidyoConnector({ viewId, viewStyle, remoteParticipants, logFileFilter, logFileName, userData })
        .then((vidyoConnector) => {
            this.vidyoConnector = vidyoConnector;
            if (vidyoConnector) {
                return Promise.resolve(vidyoConnector);
            }
            return Promise.reject(new Error('CreateVidyoConnector returns null'));
        }).catch((error) => {
            return Promise.reject(error);
        });
    }
    
    toggleConnect() {
        if (this.connected) {
            this.vidyoConnector.Disconnect();
        } else {
            let { host, token, displayName, resourceId } = this.state;

            this.vidyoConnector.Connect({ host, token, displayName, resourceId,
                onSuccess: () => {
                    this.connected = true;
                    this.setState({ connectionStatus:       `Connected`,
                                    callButtonState:        false,
                                    isEntranceFormHidden:   true });
                    this._resetToggles(false);
                },
                onFailure: (reason) => {
                    this.connected = false;
                    this.setState({ connectionStatus:       `Failed: ${reason}`,
                                    callButtonState:        true,
                                    isEntranceFormHidden:   false });
                    this._resetToggles(true);
                },
                onDisconnected: (reason) => {
                    this.connected = false;
                    this.setState({ connectionStatus:       `Disconnected: ${reason}`,
                                    callButtonState:        true,
                                    isEntranceFormHidden:   false });
                    this._resetToggles(true);
                }
            }).then(() => {
                // Success
            }).catch((error) => {
                // Failure
            });
        }
    }
    
    destroyConnector() {
        this.vidyoConnector.Destroy();
    }
    
    callButtonPressHandler(event) {
        this.setState({ callButtonState: !this.state.callButtonState });
        if (this.vidyoConnector) {
            this.toggleConnect();
        }
    }
    
    cameraButtonPressHandler(event) {
        this.setState({ cameraButtonState: !this.state.cameraButtonState });
        if (this.vidyoConnector) {
            this.vidyoConnector.SetCameraPrivacy({ privacy: this.state.cameraButtonState });
        }
    }
    
    microphoneButtonPressHandler(event) {
        this.setState({ microphoneButtonState: !this.state.microphoneButtonState })
        if (this.vidyoConnector) {
            this.vidyoConnector.SetMicrophonePrivacy({ privacy: this.state.microphoneButtonState });
        }
    }
    
    registerVCEventListeners() {
        // RegisterParticipantEventListener
        this.vidyoConnector.RegisterParticipantEventListener({
            onParticipantJoined: (participant) => {
                this.setState({ connectionStatus: participant.name + ' joined' });
                console.log('onParticipantJoined', participant);
            },
            onParticipantLeft: (participant) => {
                this.setState({ connectionStatus: participant.name + ' left' });
                console.log('onParticipantLeft', participant);
            },
            onDynamicParticipantChanged: (participants) => {
                console.log('onDynamicParticipantChanged', participants);
            },
            onLoudestParticipantChanged: (participant, audioOnly) => {
                this.setState({ connectionStatus: participant.name + ' is speaking' });
                console.log('onLoudestParticipantChanged', participant, audioOnly);
            }
        });
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

    _keyboardDidShow() {
        this.setState({ keyboardDidShow: true });
    }
    
    _keyboardDidHide() {
        this.setState({ keyboardDidShow: false });
    }
    
    _handleAppStateChange(nextAppState) {
        if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.vidyoConnector && this.vidyoConnector.SetForegroundMode();
        } else {
            this.vidyoConnector && this.vidyoConnector.SetBackgroundMode();
        }
        this.appState = nextAppState;
    }

    _toggleEntranceForm() {
        const { eFormBounceValue, isEntranceFormHidden } = this.state;

        Animated.spring(eFormBounceValue, {
            toValue: isEntranceFormHidden ? -400 : 0,
            velocity: 2,
            tension: 1,
            friction: 4,
        }).start();

        this.setState({ isEntranceFormHidden: !isEntranceFormHidden });
    }

    _toggleToolbar() {
        const { toolbarBounceValue, isToolbarHidden } = this.state;

        Animated.spring(toolbarBounceValue, {
            toValue: isToolbarHidden ? 0 : 150,
            velocity: 3,
            tension: 1,
            friction: 8,
        }).start();

        this.setState({ isToolbarHidden: !isToolbarHidden });
    }

    _resetToggles(hiddern) {
        this.setState({ isToolbarHidden: hiddern, isEntranceFormHidden: !hiddern });
        this._toggleEntranceForm();
        this._toggleToolbar();
    }

    render() {
        return (
            <TouchableHighlight onPress = { this._toggleToolbar.bind(this) }>
                <View>
                    <View style = { styles.body } >
                        <FrameLayout style = { styles.frame } />
                        <View style = { styles.banner }>
                            <Text style = { styles.message }>{ this.state.keyboardDidShow ? '' : this.state.connectionStatus }</Text>
                        </View>
                    </View>
                    <Animated.View
                        style = { [ styles.footer, { transform: [{ translateY: this.state.toolbarBounceValue }] } ] }>
                        <Toolbar
                            style                 = { styles.toolbar }
                            callButtonState       = { this.state.callButtonState }
                            cameraButtonState     = { this.state.cameraButtonState }
                            microphoneButtonState = { this.state.microphoneButtonState }
                            clientVersion         = { this.state.clientVersion }
                
                            hideToolbar           = { this.state.keyboardDidShow }
                
                            callButtonPressHandler       = { this.callButtonPressHandler.bind(this) }
                            cameraButtonPressHandler     = { this.cameraButtonPressHandler.bind(this) }
                            microphoneButtonPressHandler = { this.microphoneButtonPressHandler.bind(this) }
                        />
                    </Animated.View>
                    <EntranceForm
                        host                  = { this.state.host }
                        token                 = { this.state.token }
                        resourceId            = { this.state.resourceId }
                        displayName           = { this.state.displayName }

                        eFormBounceValue      = { this.state.eFormBounceValue }
                        isEntranceFormHidden  = { this.state.isEntranceFormHidden }
                    
                        inputTextChanged  = { this.inputTextChanged.bind(this) }
                    />
                </View>
            </TouchableHighlight>
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
        marginTop:        height-250,
        height:           180,
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

