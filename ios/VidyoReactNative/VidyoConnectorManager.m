#import <UIKit/UIKit.h>
#import <Lmi/VidyoClient/VidyoConnector_Objc.h>
#import <React/RCTViewManager.h>
#import "RNNotification.h"

@interface VidyoConnectorManager : RCTViewManager<VCConnectorIConnect, VCConnectorIRegisterParticipantEventListener, VCConnectorIRegisterLocalCameraEventListener>
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

RCT_EXPORT_METHOD(selectDefaultCamera:(RCTPromiseResolveBlock)resolve
                             rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector selectDefaultCamera];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SelectDefaultCamera failed", error);
  }
}

RCT_EXPORT_METHOD(selectDefaultMicrophone:(RCTPromiseResolveBlock)resolve
                                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector selectDefaultMicrophone];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SelectDefaultMicrophone failed", error);
  }
}

RCT_EXPORT_METHOD(selectDefaultSpeaker:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector selectDefaultSpeaker];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SelectDefaultSpeaker failed", error);
  }
}

RCT_EXPORT_METHOD(selectLocalCamera:(NSDictionary *)localCamera
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result;
    
    if ([localCamera count] > 0) { // TODO
      result = NO;
    }
    else {
      result = [_vidyoConnector selectLocalCamera:nil];
    }
  
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SelectLocalCamera failed", error);
  }
}

RCT_EXPORT_METHOD(selectLocalMicrophone:(NSDictionary *)localMicrophone
                               resolver:(RCTPromiseResolveBlock)resolve
                               rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result;
    
    if ([localMicrophone count] > 0) { // TODO
      result = NO;
    }
    else {
      result = [_vidyoConnector selectLocalMicrophone:nil];
    }
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SelectLocalMicrophone failed", error);
  }
}

RCT_EXPORT_METHOD(selectLocalSpeaker:(NSDictionary *)localSpeaker
                            resolver:(RCTPromiseResolveBlock)resolve
                            rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result;
    
    if ([localSpeaker count] > 0) { // TODO
      result = NO;
    }
    else {
      result = [_vidyoConnector selectLocalSpeaker:nil];
    }
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Device_Error", @"SelectLocalSpeaker failed", error);
  }
}

RCT_EXPORT_METHOD(setMode:(NSString *)mode
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [mode isEqual: @"VIDYO_CONNECTORMODE_Foreground"] ?
                  [_vidyoConnector setMode:VCConnectorModeForeground]:
                  [_vidyoConnector setMode:VCConnectorModeBackground];
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Lib_Error", @"SetMode failed", error);
  }
}

RCT_EXPORT_METHOD(registerLocalCameraEventListener:(RCTPromiseResolveBlock)resolve
                                          rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector registerLocalCameraEventListener:self];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Lib_Error", @"RegisterLocalCameraEventListener failed", error);
  }
}

RCT_EXPORT_METHOD(registerParticipantEventListener:(RCTPromiseResolveBlock)resolve
                                          rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    BOOL result = [_vidyoConnector registerParticipantEventListener:self];
    
    result ? resolve(@true) : resolve(@false);
  }
  @catch (NSError *error) {
    reject(@"Lib_Error", @"RegisterParticipantEventListener failed", error);
  }
}

// Implementation of VCConnectorIConnect

-(void) onSuccess
{
  [_emitter sendNotificationToJavaScript:@"Connect:onSuccess"];
}

-(void) onFailure:(VCConnectorFailReason)reason
{
  [_emitter sendNotificationToJavaScript:@"Connect:onFailure"
                                    body:@{@"reason": @"Connection attempt failed"}];
}

-(void) onDisconnected:(VCConnectorDisconnectReason)reason
{
  if (reason == VCConnectorDisconnectReasonDisconnected) {
    [_emitter sendNotificationToJavaScript:@"Connect:onDisconnected"
                                      body:@{@"reason": @"Succesfully disconnected"}];
  } else {
    [_emitter sendNotificationToJavaScript:@"Connect:onDisconnected"
                                      body:@{@"reason": @"Unexpected disconnection"}];
  }
}

// Implementation of VCConnectorIParticipantEventListener

-(void) onParticipantJoined:(VCParticipant*)participant
{
  NSDictionary *nsParticipant = @{
                           @"id":           participant.id,
                           @"name":         participant.name,
                           @"userId":       participant.userId,
                           @"isHidden":     @(participant.isHidden),
                           @"isLocal":      @(participant.isLocal),
                           @"isRecording":  @(participant.isRecording),
                           @"isSelectable": @(participant.isSelectable)
                           };

  [_emitter sendNotificationToJavaScript:@"Participant:onJoined"
                                    body:@{ @"participant": nsParticipant }];
  participant = nil;
  nsParticipant = nil;
}

-(void) onParticipantLeft:(VCParticipant*)participant
{
  NSDictionary *nsParticipant = @{
                           @"id":           participant.id,
                           @"name":         participant.name,
                           @"userId":       participant.userId,
                           @"isHidden":     @(participant.isHidden),
                           @"isLocal":      @(participant.isLocal),
                           @"isRecording":  @(participant.isRecording),
                           @"isSelectable": @(participant.isSelectable)
                           };

  [_emitter sendNotificationToJavaScript:@"Participant:onLeft"
                                    body:@{ @"participant": nsParticipant }];
  participant = nil;
  nsParticipant = nil;
}

-(void) onDynamicParticipantChanged:(NSMutableArray*)participants
{
  NSMutableArray *nsParticipants = [[NSMutableArray alloc] init];
  for (int i = 0; i < [participants count]; i++) {
    VCParticipant *participant = participants[i];
    nsParticipants[i] = @{
                  @"id":           participant.id,
                  @"name":         participant.name,
                  @"userId":       participant.userId,
                  @"isHidden":     @(participant.isHidden),
                  @"isLocal":      @(participant.isLocal),
                  @"isRecording":  @(participant.isRecording),
                  @"isSelectable": @(participant.isSelectable)
                  };
  }
  NSArray * array = [NSArray arrayWithArray:nsParticipants];
  [_emitter sendNotificationToJavaScript:@"Participant:onDynamicChanged"
                                    body:@{ @"participants": array }];
  nsParticipants = nil;
}

-(void) onLoudestParticipantChanged:(VCParticipant*)participant AudioOnly:(BOOL)audioOnly
{
  NSDictionary *nsParticipant = @{
                           @"id":           participant.id,
                           @"name":         participant.name,
                           @"userId":       participant.userId,
                           @"isHidden":     @(participant.isHidden),
                           @"isLocal":      @(participant.isLocal),
                           @"isRecording":  @(participant.isRecording),
                           @"isSelectable": @(participant.isSelectable)
                           };

  [_emitter sendNotificationToJavaScript:@"Participant:onLoudestChanged"
                                    body:@{ @"participant": nsParticipant, @"audioOnly": @(audioOnly) }];
  nsParticipant = nil;
}

// Implementation of VCConnectorILocalCameraEventListener

-(void) onLocalCameraAdded:(VCLocalCamera*)localCamera
{
  NSDictionary *nsCamera = @{ @"id": localCamera.id, @"name": localCamera.name };

  [_emitter sendNotificationToJavaScript:@"LocalCamera:onAdded"
                                    body:@{ @"localCamera": nsCamera }];
  nsCamera = nil;
}

-(void) onLocalCameraRemoved:(VCLocalCamera*)localCamera
{
  NSDictionary *nsCamera = @{ @"id": localCamera.id, @"name": localCamera.name };

  [_emitter sendNotificationToJavaScript:@"LocalCamera:onRemoved"
                                    body:@{ @"localCamera": nsCamera }];
  nsCamera = nil;
}

-(void) onLocalCameraSelected:(VCLocalCamera*)localCamera
{
  NSDictionary *nsCamera = @{ @"id": localCamera.id, @"name": localCamera.name };

  [_emitter sendNotificationToJavaScript:@"LocalCamera:onSelected"
                                    body:@{ @"localCamera": nsCamera }];
  nsCamera = nil;
}

-(void) onLocalCameraStateUpdated:(VCLocalCamera*)localCamera State:(VCDeviceState)state
{
  NSDictionary *nsCamera = @{ @"id": localCamera.id, @"name": localCamera.name };
  NSString *nsState;

  switch (state) {
    case VCDeviceStateAdded:            nsState = @"VCDeviceStateAdded";             break;
    case VCDeviceStateRemoved:          nsState = @"VCDeviceStateRemoved";           break;
    case VCDeviceStateStarted:          nsState = @"VCDeviceStateStarted";           break;
    case VCDeviceStateStopped:          nsState = @"VCDeviceStateStopped";           break;
    case VCDeviceStateSuspended:        nsState = @"VCDeviceStateSuspended";         break;
    case VCDeviceStateUnsuspended:      nsState = @"VCDeviceStateUnsuspended";       break;
    case VCDeviceStateInUse:            nsState = @"VCDeviceStateInUse";             break;
    case VCDeviceStateAvailable:        nsState = @"VCDeviceStateAvailable";         break;
    case VCDeviceStatePaused:           nsState = @"VCDeviceStatePaused";            break;
    case VCDeviceStateResumed:          nsState = @"VCDeviceStateResumed";           break;
    case VCDeviceStateControllable:     nsState = @"VCDeviceStateControllable";      break;
    case VCDeviceStateNotControllable:  nsState = @"VCDeviceStateNotControllable";   break;
    case VCDeviceStateDefaultChanged:   nsState = @"VCDeviceStateDefaultChanged";    break;
    case VCDeviceStateConfigureSuccess: nsState = @"VCDeviceStateConfigureSuccess";  break;
    case VCDeviceStateConfigureError:   nsState = @"VCDeviceStateConfigureError";    break;
    case VCDeviceStateError:            nsState = @"VCDeviceStateError";             break;
    default:                            nsState = @"Default";
  }
  
  [_emitter sendNotificationToJavaScript:@"LocalCamera:onStateUpdated"
                                    body:@{ @"localCamera": nsCamera, @"state": nsState }];
  nsState = nil;
  nsCamera = nil;
}

@end
