import VCILocalCamera from '../model/VCILocalCamera'

class SelectedDevices {
    constructor() {
        this.selectedCamera       = null;
        this.selectedMicrophone   = null;
        this.selectedSpeaker      = null;
    }
}

export default class DeviceController {

    constructor() {
        this.localCameraList        = [];
        this.localMicrophoneList    = [];
        this.localSpeakerList       = [];

        this.selectedDevices        = new SelectedDevices();
    }

    get SelectedCamera() {
        return this.selectedDevices.selectedCamera;
    }
    set SelectedCamera(camera) {
        return this.selectedDevices.selectedCamera = camera;
    }
    get SelectedMicrophone() {
        return this.selectedDevices.selectedMicrophone;
    }
    set SelectedMicrophone(microphone) {
        return this.selectedDevices.selectedCamera = microphone;
    }
    get SelectedSpeaker() {
        return this.selectedDevices.selectedSpeaker;
    }
    set SelectedSpeaker(speaker) {
        return this.selectedDevices.selectedSpeaker = speaker;
    }

    addLocalCamera(localCamera) {
        this.localCameraList.push(localCamera);
    }

    addLocalMicrophone(localCamera) {
        this.localCameraList.push(localCamera);
    }

    addLocalSpeaker(localCamera) {
        this.localCameraList.push(localCamera);
    }

    removeLocalCamera(localCamera) {
        if (this.SelectedCamera && this.SelectedCamera.id === localCamera.id) {
            this.SelectedCamera = null;
        }
        this.localCameraList = this.localCameraList.filter( camera => {
            return camera.id != localCamera.id;
        });
    }

    removeLocalMicrophone(localMicrophone) {
        if (this.SelectedMicrophone && this.SelectedMicrophone.id === localMicrophone.id) {
            this.SelectedMicrophone = null;
        }
        this.localMicrophoneList = this.localMicrophoneList.filter( microphone => {
            return microphone.id != localMicrophone.id;
        });
    }

    removeLocalSpeaker(localSpeaker) {
        if (this.SelectedSpeaker && this.SelectedSpeaker.id === localSpeaker.id) {
            this.SelectedSpeaker = null;
        }
        this.localSpeakerList = this.localSpeakerList.filter( speaker => {
            return speaker.id != localSpeaker.id
        });
    }

}