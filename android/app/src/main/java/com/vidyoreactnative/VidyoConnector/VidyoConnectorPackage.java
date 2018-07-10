package com.vidyoreactnative.VidyoConnector;

import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.vidyoreactnative.NativeUIComponents.FrameLayoutManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class VidyoConnectorPackage implements ReactPackage {

    FrameLayoutManager frameLayoutManager = new FrameLayoutManager();

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(frameLayoutManager);
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext){
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new VidyoConnectorManager(reactContext, frameLayoutManager));

        return modules;
    }

}
