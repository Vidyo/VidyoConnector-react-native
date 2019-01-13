import { NativeModules } from 'react-native';
import EventEmitter from './EventEmitter';
import VCIParticipant from './model/VCIParticipant';
import VCILocalCamera from './model/VCILocalCamera';

const VCNative = NativeModules.VidyoConnectorManager;
const eventListeners = {};

class VCExtention {
    Destroy() {
        VCNative.destroy();
    }
}

export const ConnectorMode = {
    VIDYO_CONNECTORMODE_Foreground: "VIDYO_CONNECTORMODE_Foreground",
    VIDYO_CONNECTORMODE_Background: "VIDYO_CONNECTORMODE_Background"
}

/* API */
class VidyoConnector extends VCExtention {

    Connect({ host, token, displayName, resourceId, onSuccess, onFailure, onDisconnected }) {
        eventListeners.connect = {
            connectOnSuccess: EventEmitter.addListener('Connect:onSuccess', () => {
                eventListeners.connect.connectOnSuccess.remove();
                onSuccess();
            }),
            connectOnFailure: EventEmitter.addListener('Connect:onFailure', (payload) => {
                let { reason } = payload;
                eventListeners.connect.connectOnDisconnected.remove();
                eventListeners.connect.connectOnFailure.remove();
                onFailure(reason);
            }),
            connectOnDisconnected: EventEmitter.addListener('Connect:onDisconnected', (payload) => {
                let { reason } = payload;
                eventListeners.connect.connectOnDisconnected.remove();
                eventListeners.connect.connectOnFailure.remove();
                onDisconnected(reason);
            })
        };

        return VCNative.connect(host, token, displayName, resourceId);
    }

    Disconnect() {
        VCNative.disconnect().catch((error) => {
            // Failure
        });
    }

    GetVersion() {
        return VCNative.getVersion();
    }

    RegisterParticipantEventListener({ onJoined, onLeft, onDynamicChanged, onLoudestChanged }) {
        eventListeners.participant = {
            onJoined: EventEmitter.addListener('Participant:onJoined', (payload) => {
                let { participant } = payload;
                let vciParticipant = new VCIParticipant(participant);
                onJoined(vciParticipant);
            }),
            onLeft: EventEmitter.addListener('Participant:onLeft', (payload) => {
                let { participant } = payload;
                let vciParticipant = new VCIParticipant(participant);
                onLeft(vciParticipant);
            }),
            onDynamicChanged: EventEmitter.addListener('Participant:onDynamicChanged', (payload) => {
                let { participants } = payload;
                let vciParticipants = participants.map( participant => {
                    return new VCIParticipant(participant);
                });
                onDynamicChanged(vciParticipants);
            }),
            onLoudestChanged: EventEmitter.addListener('Participant:onLoudestChanged', (payload) => {
                let { participant, audioOnly } = payload;
                let vciParticipants = new VCIParticipant(participant);
                onLoudestChanged(vciParticipants, audioOnly);
            })
        };

        return VCNative.registerParticipantEventListener();
    }

    RegisterLocalCameraEventListener({ onAdded, onRemoved, onSelected, onStateUpdated }) {
        eventListeners.localCamera = {
            onAdded: EventEmitter.addListener('LocalCamera:onAdded', (payload) => {
                let { localCamera } = payload
                let vciLocalCamera = new VCILocalCamera(localCamera);
                onAdded(vciLocalCamera);
            }),
            onRemoved: EventEmitter.addListener('LocalCamera:onRemoved', (payload) => {
                let { localCamera } = payload
                let vciLocalCamera = new VCILocalCamera(localCamera);
                onRemoved(vciLocalCamera);
            }),
            onSelected: EventEmitter.addListener('LocalCamera:onSelected', (payload) => {
                let { localCamera } = payload
                let vciLocalCamera = new VCILocalCamera(localCamera);
                onSelected(vciLocalCamera);
            }),
            onStateUpdated: EventEmitter.addListener('LocalCamera:onStateUpdated', (payload) => {
                let { localCamera, state } = payload
                let vciLocalCamera = new VCILocalCamera(localCamera);
                onStateUpdated(vciLocalCamera, state);
            })
        };

        return VCNative.registerLocalCameraEventListener();
    }

    SelectDefaultCamera() {
        return VCNative.selectDefaultCamera();
    }

    SelectDefaultMicrophone() {
        return VCNative.selectDefaultMicrophone();
    }

    SelectDefaultSpeaker() {
        return VCNative.selectDefaultSpeaker();
    }

    SelectLocalCamera(device) {
        let localCamera = device ? device.localCamera : {};
        return VCNative.selectLocalCamera(localCamera);
    }

    SelectLocalMicrophone(device) {
        let localMicrophone = device ? device.localMicrophone : {};
        return VCNative.selectLocalMicrophone(localMicrophone);
    }

    SelectLocalSpeaker(device) {
        let localSpeaker = device ? device.localSpeaker : {};
        return VCNative.selectLocalSpeaker(localSpeaker);
    }

    SetCameraPrivacy({ privacy }) {
        return VCNative.setCameraPrivacy(privacy);
    }

    SetMicrophonePrivacy({ privacy }) {
        return VCNative.setMicrophonePrivacy(privacy);
    }

    ShowViewAt({ viewId, x, y, width, height }) {
        return VCNative.showViewAt(x, y, width, height);
    }

    SetMode({ mode }) {
        return VCNative.setMode(mode);
    }

}

export function CreateVidyoConnector({ viewId, viewStyle, remoteParticipants, logFileFilter, logFileName, userData }) {
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
