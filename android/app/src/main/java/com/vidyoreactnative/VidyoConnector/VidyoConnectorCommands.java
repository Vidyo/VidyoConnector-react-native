package com.vidyoreactnative.VidyoConnector;

public enum VidyoConnectorCommands {
    CONNECT(0),
    DISCONNECT(1);

    int code;

    VidyoConnectorCommands(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
