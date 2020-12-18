const mongoCollections = require('../config/mongoCollections');
const groupMsg = mongoCollections.groupMsg;


// chatRoomschema = {
//     sender: String,
//     roomId: String,
//     msg: String,
//     time: Time
// }
module.exports = {
    async addGroupMeg(sender, roomId, msg){
        let time = new Date(Date.now()).toISOString()
        if(!sender || typeof sender!= 'string') throw 'you must provide a valid sender';
        if(!roomId || typeof roomId!= 'string') throw 'you must provide a valid roomId';
        if(!msg || typeof msg!= 'string') throw 'you must provide a valid message';
        let newMeg = {
            sender:sender,
            roomId:roomId,
            msg:msg,
            time:time
        }
        let privateMsgCollection = await groupMsg();
        const insertInfo = await privateMsgCollection.insertOne(newMeg);
        if(insertInfo.insertedCount === 0) throw 'Can not add msg';
        return true;
    },

    async getMsgBySenderAndRoomId(sender, roomId){
        if(!sender || typeof sender!= 'string') throw 'you must provide a valid sender';
        if(!roomId || typeof roomId!= 'string') throw 'you must provide a valid roomId';
        let groupMsgCollection = await groupMsg();
        const msg = await groupMsgCollection.find({},{ sender: sender, roomId:roomId}).toArray();
        if (msg === null) throw `No msg between ${sender} and ${roomId}`;
        return msg;
    },

    async getMsgBySender(sender){
        if(!sender || typeof sender!= 'string') throw 'you must provide a valid sender';
        let groupMsgCollection = await groupMsg();
        const msg = await groupMsgCollection.find({ sender: sender}).toArray();
        if (msg === null) throw `No msg send by ${sender}`;
        return msg;
    },

    async getMsgByRoomId(roomId){
        if(!roomId || typeof roomId!= 'string') throw 'you must provide a valid roomId';
        let groupMsgCollection = await groupMsg();
        const msg = await groupMsgCollection.find({ roomId: roomId}).toArray();
        if (msg === null) throw `No msg in ${roomId}`;
        return msg;
    }
}