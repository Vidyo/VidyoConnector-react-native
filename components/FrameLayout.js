import PropTypes from 'prop-types';
import { Platform, requireNativeComponent, ViewPropTypes } from 'react-native';

let nativeViewComponent = null;
let iface = {
  name: 'FrameLayout',
  propTypes: {
    src: PropTypes.string,
    borderRadius: PropTypes.number,
    resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch']),
    ...ViewPropTypes, // include the default view properties
  },
};

if (Platform.OS === 'android') {
    nativeViewComponent = requireNativeComponent('RCTFrameLayout', iface);
} else if (Platform.OS === 'ios') {
    nativeViewComponent = requireNativeComponent('VidyoConnector', iface);
}

module.exports = nativeViewComponent;
