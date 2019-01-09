
//  VidyoClientInterface Participant
//
//  @property NSMutableString* id;
//  @property NSMutableString* name;
//  @property VCParticipantTrust trust;
//  @property NSMutableString* userId;
//  -(void) dealloc;
//  -(VCContact*) getContact:(VCContact*)contact;
//  -(NSString*) getId;
//  -(NSString*) getName;
//  -(VCParticipantTrust) getTrust;
//  -(NSString*) getUserId;
//  -(BOOL) isHidden;
//  -(BOOL) isLocal;
//  -(BOOL) isRecording;
//  -(BOOL) isSelectable;
//  -(id) initWithObject:(void*)rPtr;
//  -(void*)getObjectPtr;

import { NativeModules } from 'react-native';

export const VCNative = NativeModules.ParticipantManager;

export default class VCIParticipant {
    
    constructor({ id, name, trust, userId, isHidden, isLocal, isRecording, isSelectable }) {
        this.id           = id;
        this.name         = name;
        this.trust        = trust;
        this.userId       = userId;

        this.isHidden     = isHidden;
        this.isLocal      = isLocal;
        this.isRecording  = isRecording;
        this.isSelectable = isSelectable;
    }

    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getTrust() {
        return this.trust;
    }
    getUserId() {
        return this.userId;
    }
    getContact() {
        //
    }
}