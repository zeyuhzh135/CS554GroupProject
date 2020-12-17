import React, {useState, useEffect, useRef} from 'react';
import queryString from 'query-string';
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
    const messageEndRef = useRef(undefined)
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
        scrollToBottom()
    }, [messages])

    const inputHandler = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    }

    const scrollToBottom = () => {
        if(messageEndRef !== undefined)
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    const sendMessage = (e) => {
        e.preventDefault()
        if (message) {
            info.sender = userName;
            info.roomId = roomId;
            info.msg = message;
            socket.emit("sendGroupMsg", info, () => {
                setMessage('');
                setMessages([...messages, info])
            })
        }
    }
    return (
        <div className="outerContainer">
            <div className="container">
                <div className="messages">
                    {messages.map((message, i) => {
                        return (
                            <div key={i}>
                                <Message message={message.msg} name={message.sender} userName={userName}/>
                            </div>
                        )
                    })}
                    <div ref={messageEndRef}/>
                </div>
                <textarea
                    className="input"
                    cols="40"
                    rows="5"
                    value={message}
                    onChange={inputHandler}
                    onKeyPress={e => e.key === "Enter" ? sendMessage(e) : null}
                />
            </div>
        </div>
    )
}

export default ChatRoom;