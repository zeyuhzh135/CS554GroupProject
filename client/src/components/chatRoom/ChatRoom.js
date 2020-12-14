import React, {useState, useEffect} from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'

let socket;

const ChatRoom = ({location})=> {
    const [roomName,setRoomName] = useState(undefined);
    const [roomId,setRoomId] = useState(undefined);
    const endPoint = 'http://localhost:4000';
    useEffect(()=>{
        const data = queryString.parse(location.search);

        socket = io(endPoint,{ transport : ['websocket'] });
        setRoomId(data.roomId);
        setRoomName(data.name);
    },[endPoint, location.search])
    return (
        <div>

        </div>
    )
}

export default ChatRoom;