package com.vidyoreactnative.VidyoConnector;

import android.Manifest;
import android.app.Activity;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.util.DisplayMetrics;
import android.widget.FrameLayout;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.vidyo.VidyoClient.Connector.ConnectorPkg;
import com.vidyo.VidyoClient.Connector.Connector;
import com.vidyoreactnative.NativeUIComponents.FrameLayoutManager;

public class VidyoConnectorManager extends ReactContextBaseJavaModule implements
        Connector.IConnect {

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
    public void create(int remoteParticipants, String logFileFilter, String logFileName, Integer userData, Promise promise){
        try {
            mActivity   = getCurrentActivity();
            mVideoFrame = mLayoutManager.getFrameLayout();
            ConnectorPkg.setApplicationUIContext(mActivity);
            boolean initialized = ConnectorPkg.initialize();

            if (initialized && mVidyoConnector == null) {
                if (Build.VERSION.SDK_INT > 22) {
                    ActivityCompat.requestPermissions(mActivity, mPermissions, 1);
                }
                mVidyoConnector = new Connector(mVideoFrame,
                                                Connector.ConnectorViewStyle.VIDYO_CONNECTORVIEWSTYLE_Default,
                                                remoteParticipants,
                                                logFileFilter,
                                                logFileName,
                                                userData.longValue());
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
    public void showViewDefault(){
        mVidyoConnector.showViewAt(mVideoFrame, 0, 0, displayMetrics.widthPixels, displayMetrics.heightPixels);
    }

    @ReactMethod
    public void showViewCustom(Float x, Float y, Float width, Float height){
        if (mVidyoConnector != null) {
            int marginLeft = (int) (displayMetrics.widthPixels * x);
            int marginTop = (int) (displayMetrics.heightPixels * y);
            int layoutWidth = (int) (displayMetrics.widthPixels * width);
            int layoutHeight = (int) ((displayMetrics.heightPixels * height) * 0.97);   // - status bar height ~3%

            mVidyoConnector.showViewAt(mVideoFrame, marginLeft, marginTop, layoutWidth, layoutHeight);
        }
    }

    @ReactMethod
    public void connect(String host, String token, String displayName, String resourceId){
        mVidyoConnector.connect(host, token, displayName, resourceId, this);
    }

    @ReactMethod
    public void disconnect() {
        mVidyoConnector.disconnect();
    }

    @ReactMethod
    public void setCameraPrivacy(Boolean mCameraPrivacy) {
        mVidyoConnector.setCameraPrivacy(mCameraPrivacy);
    }

    @ReactMethod
    public void setMicrophonePrivacy(Boolean mMicrophonePrivacy) {
        mVidyoConnector.setMicrophonePrivacy(mMicrophonePrivacy);
    }

    @ReactMethod
    public void getVersion(Callback version) {
        if (mVidyoConnector != null) {
            final String clientVersion = mVidyoConnector.getVersion();
            version.invoke(clientVersion);
        }
    }

    @ReactMethod
    public void setBackgroundMode() {
        //
    }

    @ReactMethod
    public void setForegroundMode() {
        //
    }

    // Handle successful connection.
    @Override
    public void onSuccess() {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Connect:onSuccess", null);
    }

    // Handle attempted connection failure.
    @Override
    public void onFailure(Connector.ConnectorFailReason reason) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("Connect:onFailure", "Connection attempt failed");
    }

    // Handle an existing session being disconnected.
    @Override
    public void onDisconnected(Connector.ConnectorDisconnectReason reason) {
        if (reason == Connector.ConnectorDisconnectReason.VIDYO_CONNECTORDISCONNECTREASON_Disconnected) {
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("Connect:onDisconnected", "Succesfully disconnected");
        } else {
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                         .emit("Connect:onDisconnected", "Unexpected disconnection");
        }
    }

}
