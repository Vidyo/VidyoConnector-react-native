package com.vidyoreactnative.NativeUIComponents;

import android.widget.FrameLayout;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;


public class FrameLayoutManager extends SimpleViewManager<FrameLayout> {

    public static final String REACT_CLASS = "RCTFrameLayout";

    private static FrameLayout frameLayout;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public FrameLayout createViewInstance(ThemedReactContext context) {
        if (FrameLayoutManager.frameLayout == null) {
            FrameLayoutManager.frameLayout = new FrameLayout(context);
        }
        return FrameLayoutManager.frameLayout;
    }

    public FrameLayout getFrameLayout() {
        return FrameLayoutManager.frameLayout;
    }

}