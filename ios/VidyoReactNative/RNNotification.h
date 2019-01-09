#import <React/RCTEventEmitter.h>

@interface RNNotification : RCTEventEmitter <RCTBridgeModule>
- (void)sendNotificationToJavaScript:(NSString *)event;
- (void)sendNotificationToJavaScript:(NSString *)event body:(NSDictionary *)message;
@end
