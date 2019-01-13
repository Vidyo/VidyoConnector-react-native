// @property NSMutableString* body;
// @property long long id;
// @property VCChatMessageSenderType senderType;
// @property long timestamp;
// @property VCChatMessageType type;
// @property NSMutableString* userId;

export default class VCIChatMessage {
    constructor({ body, id, timestamp, userId }) {
        this.body       = body;
        this.id         = id;
        this.timestamp  = timestamp;
        this.userId     = userId;
    }
}