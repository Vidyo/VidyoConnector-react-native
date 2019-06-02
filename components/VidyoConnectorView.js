import React, {Component} from 'react';
import { View, UIManager, requireNativeComponent, findNodeHandle } from 'react-native';

import PropTypes from 'prop-types';

const { Commands } = UIManager.getViewManagerConfig('VidyoConnectorView');

class VidyoConnectorView extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.vcHandle = findNodeHandle(this.vcRef);
  }

  connect(host, token, displayName, resourceId) {
    UIManager.dispatchViewManagerCommand(this.vcHandle, Commands.connect, [host, token, displayName, resourceId]);
  }

  disconnect() {
    UIManager.dispatchViewManagerCommand(this.vcHandle, Commands.disconnect, []);
  }

  _onConnect = (event) => {
    if (this.props.onConnect) {
      const { ...payload } = event.nativeEvent
      this.props.onConnect(payload);
    }
  };

  _onDisconnect = (event) => {
    if (this.props.onDisconnect) {
      const { ...payload } = event.nativeEvent
      this.props.onDisconnect(payload);
    }
  }

  _onParticipantJoined = (event) => {
    if (this.props.onParticipantJoined) {
      const { ...payload } = event.nativeEvent
      this.props.onParticipantJoined(payload);
    }
  }

  _onParticipantLeft = (event) => {
    if (this.props.onParticipantLeft) {
      const { ...payload } = event.nativeEvent
      this.props.onParticipantLeft(payload);
    }
  }

  _onDynamicParticipantChanged = (event) => {
    if (this.props.onDynamicParticipantChanged) {
      const { ...payload } = event.nativeEvent
      this.props.onDynamicParticipantChanged(payload);
    }
  }

  _onLoudestParticipantChanged = (event) => {
    if (this.props.onLoudestParticipantChange) {
      const { ...payload } = event.nativeEvent
      this.props.onLoudestParticipantChange(payload);
    }
  }

  render() {
    return (
      <VidyoConnectorView_ ref = { _ => this.vcRef = _ } { ...this.props } 
      
        onConnect                   = {this._onConnect}
        onDisconnect                = {this._onDisconnect}

        onParticipantJoined         = {this._onParticipantJoined}
        onParticipantLeft           = {this._onParticipantLeft}
        onDynamicParticipantChanged = {this._onDynamicParticipantChanged}
        onLoudestParticipantChanged = {this._onLoudestParticipantChanged}

      />
    );
  }

}

VidyoConnectorView.propTypes = {
  viewStyle:                    PropTypes.string,
  remoteParticipants:           PropTypes.number,
  logFileFilter:                PropTypes.string,
  logFilename:                  PropTypes.string,
  userData:                     PropTypes.number,

  cameraPrivacy:                PropTypes.bool,
  microphonePrivacy:            PropTypes.bool,

  onConnect:                    PropTypes.func,
  onDisconnect:                 PropTypes.func,

  onParticipantJoined:          PropTypes.func,
  onParticipantLeft:            PropTypes.func,
  onDynamicParticipantChanged:  PropTypes.func,
  onLoudestParticipantChanged:  PropTypes.func,

  ...View.propTypes,
};

var VidyoConnectorView_ = requireNativeComponent(`VidyoConnectorView`, VidyoConnectorView, {
  nativeOnly: {
    onConnect:                    true,
    onDisconnect:                 true,

    onParticipantJoined:          true,
    onParticipantLeft:            true,
    onDynamicParticipantChanged:  true,
    onLoudestParticipantChanged:  true,
  },
});

export default VidyoConnectorView;