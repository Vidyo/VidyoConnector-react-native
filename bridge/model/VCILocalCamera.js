import { NativeModules } from 'react-native';

export const VCNative = NativeModules.ParticipantManager;

export default class VCILocalCamera {
    
    constructor({ id, name }) {
        this.id           = id;
        this.name         = name;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
}