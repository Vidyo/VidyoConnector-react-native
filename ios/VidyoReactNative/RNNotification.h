#import <React/RCTEventEmitter.h>

@interface RNNotification : RCTEventEmitter <RCTBridgeModule>
- (void)sendNotificationToReactNative:(NSString *)event body:(NSString *)message;
@end
