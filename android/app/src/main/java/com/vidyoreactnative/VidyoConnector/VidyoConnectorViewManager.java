package com.vidyoreactnative.VidyoConnector;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

public class VidyoConnectorViewManager extends SimpleViewManager<VidyoConnectorView> {

    public static final String REACT_CLASS = "VidyoConnectorView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public VidyoConnectorView createViewInstance(ThemedReactContext context) {
        return new VidyoConnectorView(context);
    }

    @ReactProp(name = "viewStyle")
    public void setViewStyle(VidyoConnectorView vc, String viewStyle) {
        vc.setViewStyle(viewStyle);
    }

    @ReactProp(name = "remoteParticipants")
    public void setRemoteParticipants(VidyoConnectorView vc, int remoteParticipants) {
        vc.setRemoteParticipants(remoteParticipants);
    }

    @ReactProp(name = "logFileFilter")
    public void setLogFileFilter(VidyoConnectorView vc, String logFileFilter) {
        vc.setLogFileFilter(logFileFilter);
    }

    @ReactProp(name = "logFileName")
    public void setLogFileName(VidyoConnectorView vc, String logFileName) {
        vc.setLogFileName(logFileName);
    }

    @ReactProp(name = "userData")
    public void setUserData(VidyoConnectorView vc, double userData) {
        vc.setUserData((long)userData);
    }

    @ReactProp(name = "cameraPrivacy")
    public void setCameraPrivacy(VidyoConnectorView vc, boolean privacy) {
        vc.setCameraPrivacy(privacy);
    }

    @ReactProp(name = "microphonePrivacy")
    public void setMicrophonePrivacy(VidyoConnectorView vc, boolean privacy) {
        vc.setMicrophonePrivacy(privacy);
    }

    @ReactProp(name = "mode")
    public void setMode(VidyoConnectorView vc, String mode) {
        vc.setMode(mode);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder<String, Object> builder = MapBuilder.builder();

        return builder
            .put("onConnect",                   MapBuilder.of("registrationName", "onConnect"))
            .put("onDisconnect",                MapBuilder.of("registrationName", "onDisconnect"))

            .put("onParticipantJoined",         MapBuilder.of("registrationName", "onParticipantJoined"))
            .put("onParticipantLeft",           MapBuilder.of("registrationName", "onParticipantLeft"))
            .put("onDynamicParticipantChanged", MapBuilder.of("registrationName", "onDynamicParticipantChanged"))
            .put("onLoudestParticipantChanged", MapBuilder.of("registrationName", "onLoudestParticipantChanged"))

            .build();
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        MapBuilder.Builder<String, Integer> builder = MapBuilder.builder();

        return builder
            .put("connect",              VidyoConnectorCommands.CONNECT              .getCode())
            .put("disconnect",           VidyoConnectorCommands.DISCONNECT           .getCode())
            .build();
    }

    @Override
    public void receiveCommand(VidyoConnectorView vc, int commandId, @Nullable ReadableArray params) {
        super.receiveCommand(vc, commandId, params);

        switch (commandId) {
            case 0:
                vc.connect(params);
                break;
            case 1:
                vc.disconnect();
                break;
        }
    }

    @Override
    public void onDropViewInstance(VidyoConnectorView vc) {
        super.onDropViewInstance(vc);
        vc.dispose();
    }
}