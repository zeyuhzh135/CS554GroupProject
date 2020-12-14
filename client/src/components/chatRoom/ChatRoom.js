import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import ScrollToBottom from 'react-scroll-to-bottom';
import io from 'socket.io-client';
import './ChatRoom.css';
import Message from "./Message";

let socket;

const ChatRoom = ({location}) => {
    const [roomName, setRoomName] = useState(undefined);
    const [roomId, setRoomId] = useState(undefined);
    const [userName, setUserName] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(undefined);
    const endPoint = 'http://localhost:4000';
    let info = {
        sender: userName,
        receiver: undefined,
        roomId: undefined,
        msg: undefined,
        Time: undefined
    };

    useEffect(() => {
        const data = queryString.parse(location.search);
        socket = io(endPoint);
        setRoomId(data.roomId);
        setRoomName(data.name);
        setUserName(data.userName);
        info.sender = data.userName;
        info.roomId = data.roomId;
        socket.emit("updateUserInfo", info);
        socket.emit("joinGroupChat", info);
        socket.on("receiveGroupChatHistory", historyMsg => {
            setMessages(historyMsg.msg);
            console.log(messages);
        })
        return () => {
            socket.disconnect();
        }
    }, [endPoint, location.search])

    useEffect(() => {
        socket.on("receiveGroupMsg", info => {
            let message = {
                sender: info.sender,
                roomId: info.roomId,
                msg: info.msg
            };
            console.log("enter receive");
            setMessages([...messages, message]);
        })
    }, [messages])

    const inputHandler = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    }

    const sendMessage = (e) => {
        e.preventDefault()
        if (message) {
            info.sender = userName;
            info.roomId = roomId;
            info.msg = message;
            socket.emit("sendGroupMsg", info, () => {
                setMessage('');
            })
        }
    }
    return (
        <div className="outerContainer">
            <div className="container">
                <ScrollToBottom>
                    {messages.map((message, i) => {
                        return (
                            <div>
                                <Message message={message.msg} name={message.sender} userName={userName}/>
                            </div>
                        )
                    })}
                </ScrollToBottom>
                <input
                    value={message}
                    onChange={inputHandler}
                    onKeyPress={e => e.key === "Enter" ? sendMessage(e) : null}
                />
            </div>
        </div>
    )
}

export default ChatRoom;