import React from 'react'
import "./Message.css"

const Message = ({message, name, userName})=>{
    let isSentByUser = false;
    if(userName === name){
        isSentByUser = true;
    }
    return(
        isSentByUser?(
            <div className="messageContainer justifyEnd">
                <p className="sentText">{name}</p>
                <div className="messageBox">
                    <p className="messageText colorDark">{message}</p>
                </div>
            </div>
        ):(
            <div className="messageContainer justifyStart">
                <p className="sentText">{name}</p>
                <div className="messageBox">
                    <p className="messageText colorDark">{message}</p>
                </div>
            </div>
        )
    )
}

export default Message