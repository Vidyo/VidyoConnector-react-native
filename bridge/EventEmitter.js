import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';

let eventEmitter = null;

if (Platform.OS === 'android') {
    eventEmitter = DeviceEventEmitter;
} else if (Platform.OS === 'ios') {
    eventEmitter = new NativeEventEmitter(NativeModules.RNNotification);
}

module.exports = eventEmitter;
