#import <UIKit/UIKit.h>
#import <Lmi/VidyoClient/VidyoConnector_Objc.h>
#import <React/RCTViewManager.h>
#import "RNNotification.h"

@interface VidyoConnectorManager : RCTViewManager<VCConnectorIConnect>
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

RCT_EXPORT_METHOD(create:(int)remoteParticipants
           logFileFilter:(NSString *)logFileFilter
             logFileName:(NSString *)logFileName
                userData:(int)userData
                resolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      bool initialized    = [VCConnectorPkg vcInitialize];
      self.vidyoConnector = [[VCConnector alloc] init:(void*)&_videoView
                                            ViewStyle:VCConnectorViewStyleDefault
                                   RemoteParticipants:remoteParticipants
                                        LogFileFilter:[logFileFilter UTF8String]
                                          LogFileName:[logFileName UTF8String]
                                             UserData:userData];
      if (initialized) {
        resolve(@"true");
      } else {
        resolve(@"false");
      }
    }
    @catch (NSError *error) {
      reject(@"Initialization_Error", @"Connector: creating error", error);
    }
  });
}

RCT_EXPORT_METHOD(destroy)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [_vidyoConnector disable];
    _videoView      = nil;
    _vidyoConnector = nil;
    [VCConnectorPkg uninitialize];
  });
}

RCT_EXPORT_METHOD(showViewCustom:(float)x
                               Y:(float)y
                           Width:(float)width
                          Height:(float)height)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    int screenWidth  = [[UIScreen mainScreen] bounds].size.width;
    int screenHeight = [[UIScreen mainScreen] bounds].size.height;
    [_vidyoConnector showViewAt:&_videoView
                              X:     x * screenWidth
                              Y:     y * screenHeight
                          Width: width * screenWidth
                         Height:height * screenHeight];
  });
}

RCT_EXPORT_METHOD(connect:(NSString *)host
                    Token:(NSString *)token
              DisplayName:(NSString *)displayName
               ResourceId:(NSString *)resourceId)
{
  [_vidyoConnector connect:[host        cStringUsingEncoding:NSASCIIStringEncoding]
                     Token:[token       cStringUsingEncoding:NSASCIIStringEncoding]
               DisplayName:[displayName cStringUsingEncoding:NSASCIIStringEncoding]
                ResourceId:[resourceId  cStringUsingEncoding:NSASCIIStringEncoding]
         ConnectorIConnect:self];
}

RCT_EXPORT_METHOD(disconnect)
{
  [_vidyoConnector disconnect];
}

RCT_EXPORT_METHOD(setCameraPrivacy:(BOOL)cameraPrivacy)
{
  [_vidyoConnector setCameraPrivacy:cameraPrivacy];
}

RCT_EXPORT_METHOD(setMicrophonePrivacy:(BOOL)microphonePrivacy)
{
  [_vidyoConnector setMicrophonePrivacy:microphonePrivacy];
}

RCT_EXPORT_METHOD(getVersion:(RCTResponseSenderBlock)callback)
{
  NSString *clientVersion = [_vidyoConnector getVersion];
  callback(@[clientVersion]);
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


-(void) onSuccess {
  [_emitter sendNotificationToReactNative:@"Connect:onSuccess" body:@"Successfully connected"];
}

-(void) onFailure:(VCConnectorFailReason)reason {
  [_emitter sendNotificationToReactNative:@"Connect:onFailure" body:@"Connection attempt failed"];
}

-(void) onDisconnected:(VCConnectorDisconnectReason)reason {
  if (reason == VCConnectorDisconnectReasonDisconnected) {
    [_emitter sendNotificationToReactNative:@"Connect:onDisconnected" body:@"Succesfully disconnected"];
  } else {
    [_emitter sendNotificationToReactNative:@"Connect:onDisconnected" body:@"Unexpected disconnection"];
  }
}

@end
