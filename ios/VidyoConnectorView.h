//
//  VidyoConnectorView.h
//  VidyoReactNative
//
//  Created by serhii benedyshyn on 4/21/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#ifndef VidyoConnectorView_h
#define VidyoConnectorView_h

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
#import <Lmi/VidyoClient/VidyoConnector_Objc.h>
#import <React/RCTComponent.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>

@class RCTEventDispatcher;

@interface VidyoConnectorView : UIView<VCConnectorIConnect, VCConnectorIRegisterParticipantEventListener>

@property (nonatomic, strong) VCConnector          *connector;

@property (nonatomic, assign) VCConnectorViewStyle viewStyle;
@property (nonatomic, assign) int                  remoteParticipants;
@property (nonatomic, assign) NSString*            logFileFilter;
@property (nonatomic, assign) NSString*            logFileName;
@property (nonatomic, assign) int                  userData;

@property (nonatomic, copy) RCTBubblingEventBlock onConnect;
@property (nonatomic, copy) RCTBubblingEventBlock onDisconnect;

@property (nonatomic, copy) RCTBubblingEventBlock onParticipantJoined;
@property (nonatomic, copy) RCTBubblingEventBlock onParticipantLeft;
@property (nonatomic, copy) RCTBubblingEventBlock onDynamicParticipantChanged;
@property (nonatomic, copy) RCTBubblingEventBlock onLoudestParticipantChanged;

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

- (void)showView;
- (void)setViewStyle:(VCConnectorViewStyle)viewStyle;
- (void)setRemoteParticipants:(int)remoteParticipants;
- (void)setLogFileFilter:(NSString *)logFileFilter;
- (void)setLogFileName:(NSString *)logFileName;
- (void)setUserData:(int)userData;

- (void)setCameraPrivacy:(BOOL)cameraPrivacy;
- (void)setMicrophonePrivacy:(BOOL)microphonePrivacy;
- (void)setMode:(VCConnectorMode)mode;

- (void)connect:(NSString *)host
          Token:(NSString *)token
    DisplayName:(NSString *)displayName
     ResourceId:(NSString *)resourceId;
- (void)disconnect;

- (void)onSuccess;
- (void)onFailure:(VCConnectorFailReason)reason;
- (void)onDisconnected:(VCConnectorDisconnectReason)reason;

- (void)onParticipantJoined:(VCParticipant*)participant;
- (void)onParticipantLeft:(VCParticipant*)participant;
- (void)onDynamicParticipantChanged:(NSMutableArray*)participants;
- (void)onLoudestParticipantChanged:(VCParticipant*)participant AudioOnly:(BOOL)audioOnly;

@end

#endif /* VidyoConnectorView_h */
