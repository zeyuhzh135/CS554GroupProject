import React, {useState, useEffect} from 'react';
import queryString from 'querystring'

function ChatRoom({location}) {
    const [roomId, setRoomId] = useState(undefined)
    const [roomName, setRoomName] = useState(undefined)
    useEffect(()=>{
        const data = queryString.parse(location.search)
        setRoomId(data.room)
        setRoomName(data.name)
        console.log(roomId,roomName)
    })
    return (
        <div>
            ChatRoom
        </div>
    )
}

export default ChatRoom;