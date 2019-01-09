#import <UIKit/UIKit.h>
#import <Lmi/VidyoClient/VidyoConnector_Objc.h>
#import <React/RCTViewManager.h>
#import "RNNotification.h"

@interface VidyoConnectorManager : RCTViewManager<VCConnectorIConnect, VCConnectorIRegisterParticipantEventListener>
  @property (nonatomic, strong) UIView          *videoView;
  @property (nonatomic, strong) VCConnector     *vidyoConnector;
  @property (nonatomic, strong) RNNotification  *emitter;
@end

@implementation VidyoConnectorManager
RCT_EXPORT_MODULE();

- (UIView *)view
{
  _emitter    = [RNNotification allocWithZone: nil];
  _videoView  = [[UIView alloc] init];
  
  return _videoView;
}

RCT_EXPORT_METHOD(create:(NSString *)viewStyle
      remoteParticipants:(int)remoteParticipants
           logFileFilter:(NSString *)logFileFilter
             logFileName:(NSString *)logFileName
                userData:(int)userData
                resolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      VCConnectorViewStyle _viewstyle = [viewStyle  isEqual: @"ViewStyleTiles"] ? VCConnectorViewStyleTiles :
                                                                                  VCConnectorViewStyleDefault;
      BOOL initialized    = [VCConnectorPkg vcInitialize];
      self.vidyoConnector = [[VCConnector alloc] init:(void*)&_videoView
                                            ViewStyle:_viewstyle
                                   RemoteParticipants:remoteParticipants
                                        LogFileFilter:[logFileFilter UTF8String]
                                          LogFileName:[logFileName UTF8String]
                                             UserData:userData];
      
      initialized && self.vidyoConnector ? resolve(@true) : resolve(@false);
    }
    @catch (NSError *error) {
      reject(@"Initialization_Error", @"Creating error", error);
    }
  });
}

RCT_EXPORT_METHOD(destroy:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [_vidyoConnector disable];
      _videoView      = nil;
      _vidyoConnector = nil;
      [VCConnectorPkg uninitialize];
      
      resolve([NSNull null]);
    }
    @catch (NSError *error) {
      reject(@"Destroying_Error", @"Destroy failed", error);
    }
  });
}

RCT_EXPORT_METHOD(showViewAt:(float)x
                           Y:(float)y
                       Width:(float)width
                      Height:(float)height
                    resolver:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      BOOL result = [_vidyoConnector showViewAt:&_videoView
                                              X:x
                                              Y:y
                                          Width:width
                                         Height:height];
      
      result ? resolve(@true) : resolve(@false);
    }
    @catch (NSError *error) {
      reject(@"Rendering_Error", @"ShowViewAt failed", error);
    }
  });
}

RCT_EXPORT_METHOD(connect:(NSString *)host
                    Token:(NSString *)token
              DisplayName:(NSString *)displayName
               ResourceId:(NSString *)resourceId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector connect:[host        cStringUsingEncoding:NSASCIIStringEncoding]
                                     Token:[token       cStringUsingEncoding:NSASCIIStringEncoding]
                               DisplayName:[displayName cStringUsingEncoding:NSASCIIStringEncoding]
                                ResourceId:[resourceId  cStringUsingEncoding:NSASCIIStringEncoding]
                         ConnectorIConnect:self];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Connecting_Error", @"Connect failed", error);
  }
  
}

RCT_EXPORT_METHOD(disconnect:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    [_vidyoConnector disconnect];

    resolve([NSNull null]);
  }
  @catch (NSError *error) {
    reject(@"Disconnecting_Error", @"Disconnect failed", error);
  }
}

RCT_EXPORT_METHOD(setCameraPrivacy:(BOOL)cameraPrivacy
                          resolver:(RCTPromiseResolveBlock)resolve
                          rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector setCameraPrivacy:cameraPrivacy];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SetCameraPrivacy failed", error);
  }
}

RCT_EXPORT_METHOD(setMicrophonePrivacy:(BOOL)microphonePrivacy
                              resolver:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector setMicrophonePrivacy:microphonePrivacy];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SetMicrophonePrivacy failed", error);
  }
}

RCT_EXPORT_METHOD(getVersion:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSString *clientVersion = [_vidyoConnector getVersion];

    resolve(clientVersion);
  }
  @catch (NSError *error) {
    reject(@"Lib_Error", @"GetVersion failed", error);
  }
}

RCT_EXPORT_METHOD(setBackgroundMode)
{
  if (_vidyoConnector) {
    [_vidyoConnector selectLocalCamera:nil];
    [_vidyoConnector selectLocalMicrophone:nil];
    [_vidyoConnector selectLocalSpeaker:nil];
    [_vidyoConnector setMode:VCConnectorModeBackground];
  }
}

RCT_EXPORT_METHOD(setForegroundMode)
{
  if (_vidyoConnector) {
    [_vidyoConnector setMode:VCConnectorModeForeground];
    [_vidyoConnector selectDefaultCamera];
    [_vidyoConnector selectDefaultMicrophone];
    [_vidyoConnector selectDefaultSpeaker];
  }
}

RCT_EXPORT_METHOD(registerParticipantEventListener:(RCTPromiseResolveBlock)resolve
                                          rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    BOOL result = [_vidyoConnector registerParticipantEventListener:self];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Lib_Error", @"GetVersion failed", error);
  }
}

// Implementation of VCConnectorIConnect

-(void) onSuccess {
  [_emitter sendNotificationToJavaScript:@"Connect:onSuccess"];
}

-(void) onFailure:(VCConnectorFailReason)reason {
  [_emitter sendNotificationToJavaScript:@"Connect:onFailure"
                                    body:@{@"reason": @"Connection attempt failed"}];
}

-(void) onDisconnected:(VCConnectorDisconnectReason)reason {
  if (reason == VCConnectorDisconnectReasonDisconnected) {
    [_emitter sendNotificationToJavaScript:@"Connect:onDisconnected"
                                      body:@{@"reason": @"Succesfully disconnected"}];
  } else {
    [_emitter sendNotificationToJavaScript:@"Connect:onDisconnected"
                                      body:@{@"reason": @"Unexpected disconnection"}];
  }
}

// Implementation of VCConnectorIParticipantEventListener

-(void) onParticipantJoined:(VCParticipant*)participant {
  NSDictionary *result = @{
                           @"id":           participant.id,
                           @"name":         participant.name,
                           @"userId":       participant.userId,
                           @"isHidden":     @(participant.isHidden),
                           @"isLocal":      @(participant.isLocal),
                           @"isRecording":  @(participant.isRecording),
                           @"isSelectable": @(participant.isSelectable)
                           };
  participant = nil;
  [_emitter sendNotificationToJavaScript:@"Participant:onParticipantJoined"
                                    body:@{ @"participant": result }];
}

-(void) onParticipantLeft:(VCParticipant*)participant {
  NSDictionary *result = @{
                           @"id":           participant.id,
                           @"name":         participant.name,
                           @"userId":       participant.userId,
                           @"isHidden":     @(participant.isHidden),
                           @"isLocal":      @(participant.isLocal),
                           @"isRecording":  @(participant.isRecording),
                           @"isSelectable": @(participant.isSelectable)
                           };
  participant = nil;
  [_emitter sendNotificationToJavaScript:@"Participant:onParticipantLeft"
                                    body:@{ @"participant": result }];
}

-(void) onDynamicParticipantChanged:(NSMutableArray*)participants {
  NSMutableArray *result = [[NSMutableArray alloc] init];
  for (int i = 0; i < [participants count]; i++) {
    VCParticipant *participant = participants[i];
    result[i] = @{
                  @"id":           participant.id,
                  @"name":         participant.name,
                  @"userId":       participant.userId,
                  @"isHidden":     @(participant.isHidden),
                  @"isLocal":      @(participant.isLocal),
                  @"isRecording":  @(participant.isRecording),
                  @"isSelectable": @(participant.isSelectable)
                  };
  }
  NSArray * array = [NSArray arrayWithArray:result];
  [_emitter sendNotificationToJavaScript:@"Participant:onDynamicParticipantChanged"
                                    body:@{ @"participants": array }];
}

-(void) onLoudestParticipantChanged:(VCParticipant*)participant AudioOnly:(BOOL)audioOnly {
  NSDictionary *result = @{
                           @"id":           participant.id,
                           @"name":         participant.name,
                           @"userId":       participant.userId,
                           @"isHidden":     @(participant.isHidden),
                           @"isLocal":      @(participant.isLocal),
                           @"isRecording":  @(participant.isRecording),
                           @"isSelectable": @(participant.isSelectable)
                           };
  participant = nil;
  [_emitter sendNotificationToJavaScript:@"Participant:onParticipantLeft"
                                    body:@{ @"participant": result, @"audioOnly": @(audioOnly) }];
}

@end
