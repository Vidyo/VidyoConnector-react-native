import { NativeModules } from 'react-native';
import EventEmitter from './EventEmitter';
import VCIParticipant from './model/VCIParticipant';

export const VCNative = NativeModules.VidyoConnectorManager;

class VCExtention {
    Destroy() {
        VCNative.destroy();
    }
    /* VCConnectorModeBackground */
    SetBackgroundMode() {
        VCNative.setBackgroundMode();
    }
    /* VCConnectorModeForeground */
    SetForegroundMode() {
        VCNative.setForegroundMode();
    }
}

/* API */
class VidyoConnector extends VCExtention {

    Connect({ host, token, displayName, resourceId, onSuccess, onFailure, onDisconnected }) {
        this.connectOnSuccess = EventEmitter.addListener('Connect:onSuccess', () => {
            this.connectOnSuccess.remove();
            onSuccess();
        });
        this.connectOnFailure = EventEmitter.addListener('Connect:onFailure', (payload) => {
            let { reason } = payload;
            this.connectOnDisconnected.remove();
            this.connectOnFailure.remove();
            onFailure(reason);
        });
        this.connectOnDisconnected = EventEmitter.addListener('Connect:onDisconnected', (payload) => {
            let { reason } = payload;
            this.connectOnDisconnected.remove();
            this.connectOnFailure.remove();
            onDisconnected(reason);
        });

        return VCNative.connect(host, token, displayName, resourceId).then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    /* void Disconnect */
    Disconnect() {
        VCNative.disconnect().catch((error) => {
            // Failure
        });
    }

    GetVersion() {
        return VCNative.getVersion()
        .then((version) => {
            return Promise.resolve(version);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    RegisterParticipantEventListener({  onParticipantJoined,
                                        onParticipantLeft,
                                        onDynamicParticipantChanged,
                                        onLoudestParticipantChanged 
                                    }) {
        this.onParticipantJoined = EventEmitter.addListener('Participant:onParticipantJoined', (payload) => {
            let { participant } = payload;
            let vciParticipant = new VCIParticipant(participant);
            onParticipantJoined(vciParticipant);
        });
        this.onParticipantLeft = EventEmitter.addListener('Participant:onParticipantLeft', (payload) => {
            let { participant } = payload;
            let vciParticipant = new VCIParticipant(participant);
            onParticipantLeft(vciParticipant);
        });
        this.onDynamicParticipantChanged = EventEmitter.addListener('Participant:onDynamicParticipantChanged', (payload) => {
            let { participants } = payload;
            let vciParticipants = participants.map( participant => {
                return new VCIParticipant(participant);
            });
            onDynamicParticipantChanged(vciParticipants);
        });
        this.onLoudestParticipantChanged = EventEmitter.addListener('Participant:onLoudestParticipantChanged', (payload) => {
            let { participant, audioOnly } = payload;
            let vciParticipants = new VCIParticipant(participant);
            onLoudestParticipantChanged(vciParticipants, audioOnly);
        });
        
        return VCNative.registerParticipantEventListener()
        .then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    /* boolean SetCameraPrivacy ({ privacy:Boolean }) */
    SetCameraPrivacy({ privacy }) {
        return VCNative.setCameraPrivacy(privacy)
        .then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    /* boolean SetMicrophonePrivacy ({ privacy:Boolean }) */
    SetMicrophonePrivacy({ privacy }) {
        return VCNative.setMicrophonePrivacy(privacy)
        .then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    ShowViewAt({ viewId, x, y, width, height }) {
        return VCNative.showViewAt(x, y, width, height)
        .then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

}

export default function CreateVidyoConnector({ viewId, viewStyle, remoteParticipants, logFileFilter, logFileName, userData }) {
    return VCNative.create(viewStyle, remoteParticipants, logFileFilter, logFileName, userData)
    .then((status) => {
        if (status) {
            return Promise.resolve(new VidyoConnector);
        }
        return Promise.resolve(null);
    }).catch((error) => {
        return Promise.reject(error);
    });
}
