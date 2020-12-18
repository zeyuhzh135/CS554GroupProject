const getRedisClient = require("../config/redis")
const privateMsgData = require("../data/privateMsg")
const groupMsgData = require("../data/groupMsg")

const socketListener = async (io) => {
    let redisClient = await getRedisClient()
    io.on("connection", (socket) => {
        socket.emit('success', 'you are connected to the server');
        console.log(`${socket.id} connect to server`)

        socket.on('updateUserInfo', info => {
            redisClient.hset("userName_SocketId", info.sender, socket.id, (err)=>{
                if(err){
                    console.log(err);
                }else {
                    socket.emit('updateUserInfoSuccess');
                    redisClient.hget("userName_SocketId", info.sender, (err, SocketId) => {
                        console.log(`${info.sender} saved id:${SocketId} to redis`);
                    });
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnect`);
        });
        /*
            info will be a json formed like
            {
               "sender":"xxxxx"(userName),
               "receiver":"xxxxx"(userName),
               "roomId":"xxxxx"(classId),
               "msg":"xxxxxxxxxxxxxxxx",
               "Time":time
            }
         */

        socket.on('joinPrivateChat',async (info) =>{
            try {
                let myPrivateMsg = await privateMsgData.getMsgBySenderAndReceiver(info.sender,info.receiver)
                let friendPrivateMsg = await privateMsgData.getMsgBySenderAndReceiver(info.receiver,info.sender)
                let historyMsg = {
                    "myMsg":myPrivateMsg,
                    "friendMsg":friendPrivateMsg
                }
                socket.emit("receivePrivateChatHistory", historyMsg)
            }catch (e){
                console.log(e)
            }
        })

        socket.on('sendPrivateMsg', async (info) => {
            redisClient.hget("userName_SocketId", info.receiver, (err, receiverSocketId) => {
                console.log(`${info.sender} send message to ${info.receiver} id:${receiverSocketId}`);
                try {
                    privateMsgData.addPrivateMeg(info.sender, info.receiver, info.msg)
                }catch (e){
                    console.log(e)
                }
                socket.to(receiverSocketId).emit("receivePrivateMsg", info);
            });
        });

        socket.on('joinGroupChat',async (info) => {
            socket.join(info.roomId);
            try{
                let groupMsg = await groupMsgData.getMsgByRoomId(info.roomId)
                let historyMsg = {
                    "msg":groupMsg
                }
                socket.emit("receiveGroupChatHistory", historyMsg)


                console.log(`${info.sender} joined ${info.roomId}`);
                socket.broadcast.to(info.roomId).emit('receiveGroupMsg',{
                    sender:'admin',
                    msg:`${info.sender} has joined`
                })
            }catch (e){
                console.log(e);
            }
        });

        socket.on('sendGroupMsg', (info, callback) => {
            console.log(info)
            try {
                groupMsgData.addGroupMeg(info.sender,info.roomId,info.msg);
            }catch (e){
                console.log(e)
            }
            socket.to(info.roomId).emit('receiveGroupMsg', info);
            callback();
        });
    })
}

module.exports = socketListener;