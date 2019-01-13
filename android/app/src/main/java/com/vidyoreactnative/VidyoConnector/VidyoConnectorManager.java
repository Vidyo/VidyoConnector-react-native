package com.vidyoreactnative.VidyoConnector;

import android.Manifest;
import android.app.Activity;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.util.DisplayMetrics;
import android.widget.FrameLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.vidyo.VidyoClient.Connector.ConnectorPkg;
import com.vidyo.VidyoClient.Connector.Connector;
import com.vidyo.VidyoClient.Device.Device;
import com.vidyo.VidyoClient.Device.LocalCamera;
import com.vidyo.VidyoClient.Endpoint.Participant;
import com.vidyoreactnative.NativeUIComponents.FrameLayoutManager;

import java.util.ArrayList;

public class VidyoConnectorManager extends ReactContextBaseJavaModule implements
        Connector.IConnect,
        Connector.IRegisterParticipantEventListener,
        Connector.IRegisterLocalCameraEventListener {

    public static final String REACT_CLASS = "VidyoConnectorManager";

    private static final String[] mPermissions = {
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    private ReactApplicationContext mReactContext;
    private Connector mVidyoConnector;
    private FrameLayout mVideoFrame;
    private FrameLayoutManager mLayoutManager;
    private Activity mActivity;
    private DisplayMetrics displayMetrics;

    public VidyoConnectorManager(ReactApplicationContext reactContext, FrameLayoutManager layout){
        super(reactContext);
        mReactContext  = reactContext;
        mLayoutManager = layout;

        displayMetrics = reactContext.getResources().getDisplayMetrics();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void create(String viewStyle, int remoteParticipants, String logFileFilter, String logFileName, Integer userData, Promise promise){
        try {
            mActivity   = getCurrentActivity();
            mVideoFrame = mLayoutManager.getFrameLayout();
            ConnectorPkg.setApplicationUIContext(mActivity);
            boolean initialized = ConnectorPkg.initialize();

            Connector.ConnectorViewStyle connectorViewStyle = viewStyle.equals("ViewStyleTiles") ?
                    Connector.ConnectorViewStyle.VIDYO_CONNECTORVIEWSTYLE_Tiles :
                    Connector.ConnectorViewStyle.VIDYO_CONNECTORVIEWSTYLE_Default;

            if (initialized) {
                mVidyoConnector = new Connector(mVideoFrame,
                                                connectorViewStyle,
                                                remoteParticipants,
                                                logFileFilter,
                                                logFileName,
                                                userData.longValue());

                if (Build.VERSION.SDK_INT > 22) {
                    ActivityCompat.requestPermissions(mActivity, mPermissions, 1);
                }
            }
            promise.resolve(initialized);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void destroy() {
        mVidyoConnector.disable();
        mVidyoConnector = null;
        ConnectorPkg.setApplicationUIContext(null);
        ConnectorPkg.uninitialize();
    }

    @ReactMethod
    public void showViewAt(int x, int y, int width, int height, Promise promise){
        try {
            int _width  = displayMetrics.widthPixels;
            int _height = (int)(displayMetrics.heightPixels * 0.965);
            boolean result = mVidyoConnector.showViewAt(mVideoFrame, x, y, _width, _height);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void connect(String host, String token, String displayName, String resourceId, Promise promise){
        try {
            boolean result = mVidyoConnector.connect(host, token, displayName, resourceId, this);
            promise.resolve(result);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        try {
            mVidyoConnector.disconnect();
            promise.resolve(null);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setCameraPrivacy(Boolean mCameraPrivacy, Promise promise) {
        try{
            boolean result = mVidyoConnector.setCameraPrivacy(mCameraPrivacy);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void selectDefaultCamera(Promise promise) {
        try{
            boolean result = mVidyoConnector.selectDefaultCamera();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void selectDefaultMicrophone(Promise promise) {
        try{
            boolean result = mVidyoConnector.selectDefaultMicrophone();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void selectDefaultSpeaker(Promise promise) {
        try{
            boolean result = mVidyoConnector.selectDefaultSpeaker();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void selectLocalCamera(ReadableMap localCamera, Promise promise) {
        try{
            boolean result;
            ReadableMapKeySetIterator iterator = localCamera.keySetIterator();
            
            if (iterator.hasNextKey()) {  // TODO
                result = false;
            } else { 
                result = mVidyoConnector.selectLocalCamera(null);
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void selectLocalMicrophone(ReadableMap localMicrophone, Promise promise) {
        try{
            boolean result;
            ReadableMapKeySetIterator iterator = localMicrophone.keySetIterator();

            if (iterator.hasNextKey()) {  // TODO
                result = false;
            } else { 
                result = mVidyoConnector.selectLocalMicrophone(null);
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void selectLocalSpeaker(ReadableMap localSpeaker, Promise promise) {
        try{
            boolean result;
            ReadableMapKeySetIterator iterator = localSpeaker.keySetIterator();

            if (iterator.hasNextKey()) {  // TODO
                result = false;
            } else { 
                result = mVidyoConnector.selectLocalSpeaker(null);
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setMicrophonePrivacy(Boolean mMicrophonePrivacy, Promise promise) {
        try{
            boolean result = mVidyoConnector.setMicrophonePrivacy(mMicrophonePrivacy);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        try {
            final String clientVersion = mVidyoConnector.getVersion();
            promise.resolve(clientVersion);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setMode(String mode, Promise promise) {
        try {
            boolean result = mode.equals("VIDYO_CONNECTORMODE_Foreground") ?
                    mVidyoConnector.setMode(Connector.ConnectorMode.VIDYO_CONNECTORMODE_Foreground) :
                    mVidyoConnector.setMode(Connector.ConnectorMode.VIDYO_CONNECTORMODE_Background);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void registerParticipantEventListener(Promise promise){
        try {
            boolean result = mVidyoConnector.registerParticipantEventListener(this);
            promise.resolve(result);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void registerLocalCameraEventListener(Promise promise){
        try {
            boolean result = mVidyoConnector.registerLocalCameraEventListener(this);
            promise.resolve(result);
        } catch(Exception e) {
            promise.reject(e);
        }
    }

    // Implementation of Connector.IConnect
    // Handle successful connection.
    @Override
    public void onSuccess() {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Connect:onSuccess", null);
    }

    // Handle attempted connection failure.
    @Override
    public void onFailure(Connector.ConnectorFailReason reason) {
        WritableMap payload = Arguments.createMap();
        payload.putString("reason", "Connection attempt failed");
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Connect:onFailure", payload);
    }

    // Handle an existing session being disconnected.
    @Override
    public void onDisconnected(Connector.ConnectorDisconnectReason reason) {
        WritableMap payload = Arguments.createMap();
        if (reason == Connector.ConnectorDisconnectReason.VIDYO_CONNECTORDISCONNECTREASON_Disconnected) {
            payload.putString("reason", "Succesfully disconnected");
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("Connect:onDisconnected", payload);
        } else {
            payload.putString("reason", "Unexpected disconnection");
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("Connect:onDisconnected", payload);
        }
    }

    // Implementation of Connector.IRegisterParticipantEventListener

    @Override
    public void onParticipantJoined(Participant participant) {
        WritableMap participantMap = Arguments.createMap();

        participantMap.putString("id", participant.id);
        participantMap.putString("name", participant.name);
        participantMap.putString("userId", participant.userId);
        participantMap.putBoolean("isHidden", participant.isHidden());
        participantMap.putBoolean("isLocal", participant.isLocal());
        participantMap.putBoolean("isRecording", participant.isRecording());
        participantMap.putBoolean("isSelectable", participant.isSelectable());

        WritableMap payload = Arguments.createMap();

        payload.putMap("participant", participantMap);

        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Participant:onJoined", payload);
    }

    @Override
    public void onParticipantLeft(Participant participant) {
        WritableMap participantMap = Arguments.createMap();

        participantMap.putString("id", participant.id);
        participantMap.putString("name", participant.name);
        participantMap.putString("userId", participant.userId);
        participantMap.putBoolean("isHidden", participant.isHidden());
        participantMap.putBoolean("isLocal", participant.isLocal());
        participantMap.putBoolean("isRecording", participant.isRecording());
        participantMap.putBoolean("isSelectable", participant.isSelectable());

        WritableMap payload = Arguments.createMap();

        payload.putMap("participant", participantMap);

        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Participant:onLeft", payload);
    }

    @Override
    public void onDynamicParticipantChanged(ArrayList<Participant> arrayList) {
        WritableArray participants = Arguments.createArray();

        for (Participant participant: arrayList) {

            WritableMap participantMap = Arguments.createMap();
            participantMap.putString("id", participant.id);
            participantMap.putString("name", participant.name);
            participantMap.putString("userId", participant.userId);
            participantMap.putBoolean("isHidden", participant.isHidden());
            participantMap.putBoolean("isLocal", participant.isLocal());
            participantMap.putBoolean("isRecording", participant.isRecording());
            participantMap.putBoolean("isSelectable", participant.isSelectable());

            participants.pushMap(participantMap);
        }

        WritableMap payload = Arguments.createMap();

        payload.putArray("participants", participants);

        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Participant:onDynamicChanged", payload);
    }

    @Override
    public void onLoudestParticipantChanged(Participant participant, boolean b) {
        WritableMap participantMap = Arguments.createMap();

        participantMap.putString("id", participant.id);
        participantMap.putString("name", participant.name);
        participantMap.putString("userId", participant.userId);
        participantMap.putBoolean("isHidden", participant.isHidden());
        participantMap.putBoolean("isLocal", participant.isLocal());
        participantMap.putBoolean("isRecording", participant.isRecording());
        participantMap.putBoolean("isSelectable", participant.isSelectable());

        WritableMap payload = Arguments.createMap();

        payload.putMap("participant", participantMap);
        payload.putBoolean("audioOnly", b);

        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Participant:onLoudestChanged", payload);
    }

    // Implementation of Connector.IRegisterLocalCameraEventListener

    @Override
    public void onLocalCameraAdded(LocalCamera localCamera) {
        if (localCamera != null) {
            WritableMap camera = Arguments.createMap();

            camera.putString("id", localCamera.id);
            camera.putString("name", localCamera.name);

            WritableMap payload = Arguments.createMap();

            payload.putMap("localCamera", camera);

            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("LocalCamera:onAdded", payload);
        }
    }

    @Override
    public void onLocalCameraRemoved(LocalCamera localCamera) {
        if (localCamera != null) {
            WritableMap camera = Arguments.createMap();

            camera.putString("id", localCamera.id);
            camera.putString("name", localCamera.name);

            WritableMap payload = Arguments.createMap();

            payload.putMap("localCamera", camera);

            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("LocalCamera:onRemoved", payload);
        }
    }

    @Override
    public void onLocalCameraSelected(LocalCamera localCamera) {
        if (localCamera != null) {
            WritableMap camera = Arguments.createMap();

            camera.putString("id", localCamera.id);
            camera.putString("name", localCamera.name);

            WritableMap payload = Arguments.createMap();

            payload.putMap("localCamera", camera);

            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("LocalCamera:onSelected", payload);
        }
    }

    @Override
    public void onLocalCameraStateUpdated(LocalCamera localCamera, Device.DeviceState state) {
        if (localCamera != null) {
            WritableMap camera = Arguments.createMap();

            camera.putString("id", localCamera.id);
            camera.putString("name", localCamera.name);


            String cameraState;
            switch(state) {
                case VIDYO_DEVICESTATE_Added:           cameraState = "VIDYO_DEVICESTATE_Added";            break;
                case VIDYO_DEVICESTATE_Removed:         cameraState = "VIDYO_DEVICESTATE_Removed";          break;
                case VIDYO_DEVICESTATE_Started:         cameraState = "VIDYO_DEVICESTATE_Started";          break;
                case VIDYO_DEVICESTATE_Stopped:         cameraState = "VIDYO_DEVICESTATE_Stopped";          break;
                case VIDYO_DEVICESTATE_Suspended:       cameraState = "VIDYO_DEVICESTATE_Suspended";        break;
                case VIDYO_DEVICESTATE_Unsuspended:     cameraState = "VIDYO_DEVICESTATE_Unsuspended";      break;
                case VIDYO_DEVICESTATE_InUse:           cameraState = "VIDYO_DEVICESTATE_InUse";            break;
                case VIDYO_DEVICESTATE_Available:       cameraState = "VIDYO_DEVICESTATE_Available";        break;
                case VIDYO_DEVICESTATE_Paused:          cameraState = "VIDYO_DEVICESTATE_Paused";           break;
                case VIDYO_DEVICESTATE_Resumed:         cameraState = "VIDYO_DEVICESTATE_Resumed";          break;
                case VIDYO_DEVICESTATE_Controllable:    cameraState = "VIDYO_DEVICESTATE_Controllable";     break;
                case VIDYO_DEVICESTATE_NotControllable: cameraState = "VIDYO_DEVICESTATE_NotControllable";  break;
                case VIDYO_DEVICESTATE_DefaultChanged:  cameraState = "VIDYO_DEVICESTATE_DefaultChanged";   break;
                case VIDYO_DEVICESTATE_ConfigureSuccess:cameraState = "VIDYO_DEVICESTATE_ConfigureSuccess"; break;
                case VIDYO_DEVICESTATE_ConfigureError:  cameraState = "VIDYO_DEVICESTATE_ConfigureError";   break;
                case VIDYO_DEVICESTATE_Error:           cameraState = "VIDYO_DEVICESTATE_Error";            break;
                default:                                cameraState = "Default";
            }

            WritableMap payload = Arguments.createMap();

            payload.putMap("localCamera", camera);
            payload.putString("state", cameraState);

            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("LocalCamera:onStateUpdated", payload);
        }
    }
}
