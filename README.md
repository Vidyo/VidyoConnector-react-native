# VidyoConnector-react-native

## Clone Repository

    git clone https://github.com/Vidyo/VidyoConnector-react-native.git

## Acquire VidyoClient iOS and Android SDKs
> Note: Highlighted steps are very important because samples already contain configurations specified below and both SDK packages are linked as relative folders located in VidyoConnector-react-native directory.

1. Download the latest Vidyo.io Android & iOS SDK packages:

    > https://static.vidyo.io/latest/package/VidyoClient-AndroidSDK.zip
    
    > https://static.vidyo.io/latest/package/VidyoClient-iOSSDK.zip
    
2. **Unzip VidyoClient-AndroidSDK folder and move contents of `VidyoClient-AndroidSDK/lib/android` 
   to `VidyoConnector-react-native/android/app/libs/android`**
   
3. **Unzip VidyoClient-iOSSDK folder and move contents of `VidyoClient-iOSSDK/lib/ios` 
   to `VidyoConnector-react-native/ios/lib/ios`**

## Preparing

Go to `./android/local.properties` and set location of the Android SDK

## Build and Run Application

1. Follow next link and install all described dependencies if you want to use virtual devices.

    `https://facebook.github.io/react-native/docs/getting-started.html`

2. Install dependencies.

    `npm install`

3. Build and run the application on the iOS or Android device.

    `react-native run-ios`
    
    `react-native run-android`
