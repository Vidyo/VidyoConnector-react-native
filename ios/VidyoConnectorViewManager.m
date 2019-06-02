//
//  VidyoConnectorViewManager.m
//  VidyoReactNative
//
//  Created by serhii benedyshyn on 4/21/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VidyoConnectorView.h"
#import "VidyoConnectorViewManager.h"
#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>
#import <React/RCTBridge.h>
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>

@implementation VidyoConnectorViewManager : RCTViewManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(viewStyle, NSString*, VidyoConnectorView) {
  [view setViewStyle:[[RCTConvert NSString:json] isEqual: @"ViewStyleTiles"] ? VCConnectorViewStyleTiles : VCConnectorViewStyleDefault];
}
RCT_CUSTOM_VIEW_PROPERTY(remoteParticipants, NSString*, VidyoConnectorView) {
  [view setRemoteParticipants:[RCTConvert int:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(logFileFilter, NSString*, VidyoConnectorView) {
  [view setLogFileFilter:[RCTConvert NSString:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(logFileName, NSString*, VidyoConnectorView) {
  [view setLogFileName:[RCTConvert NSString:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(userData, NSString*, VidyoConnectorView) {
  [view setUserData:[RCTConvert int:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(cameraPrivacy, NSString*, VidyoConnectorView) {
  [view setCameraPrivacy:[RCTConvert BOOL:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(microphonePrivacy, NSString*, VidyoConnectorView) {
  [view setMicrophonePrivacy:[RCTConvert BOOL:json]];
}
RCT_CUSTOM_VIEW_PROPERTY(mode, NSString*, VidyoConnectorView) {
  [view setMode:[[RCTConvert NSString:json] isEqual: @"VIDYO_CONNECTORMODE_Background"] ? VCConnectorModeBackground : VCConnectorModeForeground];
}

RCT_EXPORT_VIEW_PROPERTY(onConnect,                   RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDisconnect,                RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onParticipantJoined,         RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onParticipantLeft,           RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDynamicParticipantChanged, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoudestParticipantChanged, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(connect:(nonnull NSNumber*)reactTag
                     Host:(NSString*)host
                    Token:(NSString*)token
              DisplayName:(NSString*)displayName
               ResourceId:(NSString*)resourceId)
{
  [self.bridge.uiManager addUIBlock:
   ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry){
     VidyoConnectorView *view = viewRegistry[reactTag];
     if (![view isKindOfClass:[VidyoConnectorView class]]) {
       RCTLogError(@"Invalid view returned from registry, expecting VidyoConnectorView, got: %@", view);
     }
     [view connect:host
             Token:token
       DisplayName:displayName
        ResourceId:resourceId];
   }];
}

RCT_EXPORT_METHOD(disconnect:(nonnull NSNumber*)reactTag)
{
  [self.bridge.uiManager addUIBlock:
   ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry){
     VidyoConnectorView *view = viewRegistry[reactTag];
     if (![view isKindOfClass:[VidyoConnectorView class]]) {
       RCTLogError(@"Invalid view returned from registry, expecting VidyoConnectorView, got: %@", view);
     }
     [view disconnect];
   }];
}

- (UIView *)view
{
  return [[VidyoConnectorView alloc] initWithBridge:self.bridge];
}

@end
