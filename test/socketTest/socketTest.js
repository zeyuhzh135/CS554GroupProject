var io = require('socket.io-client')


function socketConnectionTester() {
    let socket = io.connect('http://localhost:3000');
    socket.on('connect', function() {
        socket.on('success', (data) =>{

            console.log('worked...');
        })

    });
}

function socketGroupChatTester() {
    let socket_1 = io.connect('http://localhost:3000');
    let socket_2 = io.connect('http://localhost:3000');
    socket_1.on('connect', function() {
        socket_1.on('success', () =>{

            let info = {
                "sender":"Zhili Yu",
                "roomId":"1",
                "receiver":"",
                "msg":""
            }

            socket_1.emit("joinGroupChat",info)
            socket_1.on("receiveGroupChatHistory", groupMsgHistory=>{
                console.log(groupMsgHistory.msg)
            })
            info.msg = "Yo"
            socket_1.emit("sendGroupMsg", info)
            socket_1.on("receiveGroupMsg",info=>{
                console.log(`${info.sender}:${info.msg}`)
            })
        })
    });
    socket_2.on('connect', function() {
        socket_2.on('success', () =>{
            let info = {
                "sender":"John",
                "roomId":"1",
                "receiver":"",
            }
            socket_2.emit("joinGroupChat",info)
            socket_2.on("receiveGroupMsg",info=>{
                console.log(`${info.sender}:${info.msg}`)
                info.msg = "Hi"
                info.sender = "John"
                socket_2.emit("sendGroupMsg", info)
            })
        })
    });
}

function socketPrivateChatTester() {
    let socket_1 = io.connect('http://localhost:3000');
    let socket_2 = io.connect('http://localhost:3000');
    socket_1.on("connect", ()=>{
        socket_1.on("success",()=>{
            let info = {
                "sender":"Zhili Yu",
                "receiver":"John",
                "msg":"hello john"
            };

            socket_1.emit("updateUserInfo",info);
            socket_1.on("updateUserInfoSuccess",()=>{
                info.receiver = "John";
                socket_1.emit("sendPrivateMsg",info);
            });

            socket_1.emit("joinPrivateChat", info)

            socket_1.on("receivePrivateChatHistory",privateChatHistory=>{
                console.log(privateChatHistory.myMsg)
                console.log(privateChatHistory.friendMsg)
            })
        });
    });
    socket_2.on("connect", ()=>{
        socket_2.on("success",()=>{
            let info = {
                "sender":"John",
            };
            socket_2.emit("updateUserInfo",info);
            socket_2.on("updateUserInfoSuccess",()=>{
                socket_2.on("receivePrivateMsg",info=>{
                    console.log(`${info.sender}:${info.msg}`)
                });
            });
        });
    });
}
// socketGroupChatTester()
socketPrivateChatTester()