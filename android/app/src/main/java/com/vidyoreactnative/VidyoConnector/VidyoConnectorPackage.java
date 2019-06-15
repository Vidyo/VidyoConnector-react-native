package com.vidyoreactnative.VidyoConnector;

import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class VidyoConnectorPackage implements ReactPackage {

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new VidyoConnectorViewManager());
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext){
        return Collections.emptyList();
    }

}
