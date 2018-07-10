import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';

let eventDispatcher = null;

if (Platform.OS === 'android') {
    eventDispatcher = DeviceEventEmitter;
} else if (Platform.OS === 'ios') {
    eventDispatcher = new NativeEventEmitter(NativeModules.RNNotification);
}

module.exports = eventDispatcher;
