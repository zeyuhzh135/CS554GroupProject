const mongoCollections = require('../config/mongoCollections');
const privateMsg = mongoCollections.privateMsg;


// chatRoomschema = {
//     sender: String,
//     receiver: String,
//     msg: String,
//     time: Time
// }

module.exports = {
    async addPrivateMeg(sender, receiver, msg){
        let time = new Date(Date.now()).toISOString()
        if(!sender || typeof sender!= 'string') throw 'you must provide a valid sender';
        if(!receiver || typeof receiver!= 'string') throw 'you must provide a valid receiver';
        if(!msg || typeof msg!= 'string') throw 'you must provide a valid message';
        let newMeg = {
            sender:sender,
            receiver:receiver,
            msg:msg,
            time:time
        }
        let privateMsgCollection = await privateMsg();
        const insertInfo = await privateMsgCollection.insertOne(newMeg);
        if(insertInfo.insertedCount === 0) throw 'Can not add msg';
        return true;
    },

    async getMsgBySenderAndReceiver(sender, receiver){
        if(!sender || typeof sender!= 'string') throw 'you must provide a valid sender';
        if(!receiver || typeof receiver!= 'string') throw 'you must provide a valid receiver';
        let privateMsgCollection = await privateMsg();
        const msg = await privateMsgCollection.find({ sender: sender, receiver:receiver}).toArray();
        if (msg === null) throw `No msg between ${sender} and ${receiver}`;
        return msg;
    },

    async getMsgBySender(sender){
        if(!sender || typeof sender!= 'string') throw 'you must provide a valid sender';
        let privateMsgCollection = await privateMsg();
        const msg = await privateMsgCollection.find({ sender: sender}).toArray();
        if (msg === null) throw `No msg send by ${sender}`;
        return msg;
    },

    async getMsgByReceiver(receiver){
        if(!receiver || typeof receiver!= 'string') throw 'you must provide a valid receiver';
        let privateMsgCollection = await privateMsg();
        const msg = await privateMsgCollection.find({ receiver: receiver}).toArray();
        if (msg === null) throw `No msg send by ${receiver}`;
        return msg;
    }
}