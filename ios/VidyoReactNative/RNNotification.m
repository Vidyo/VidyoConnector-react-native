
#import "RNNotification.h"

@implementation RNNotification
RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
  static RNNotification *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
           // VCConnectorIConnect
           @"Connect:onSuccess",
           @"Connect:onFailure",
           @"Connect:onDisconnected",
           
           // VCConnectorIParticipantEventListener
           @"Participant:onJoined",
           @"Participant:onLeft",
           @"Participant:onDynamicChanged",
           @"Participant:onLoudestChanged",
           
           // VCConnectorILocalCameraEventListener
           @"LocalCamera:onAdded",
           @"LocalCamera:onRemoved",
           @"LocalCamera:onSelected",
           @"LocalCamera:onStateUpdated"
           
           ];
}

- (void)sendNotificationToJavaScript:(NSString *)event
{
  [self sendEventWithName:event body:[NSNull null]];
}

- (void)sendNotificationToJavaScript:(NSString *)event body:(NSDictionary *)message
{
  [self sendEventWithName:event body:message];
}

@end
