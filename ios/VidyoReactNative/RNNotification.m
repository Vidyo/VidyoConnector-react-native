
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
  return @[@"Connect:onSuccess", @"Connect:onFailure", @"Connect:onDisconnected"];
}

- (void)sendNotificationToReactNative:(NSString *)event body:(NSString *)message
{
  [self sendEventWithName:event body:message];
}

@end
