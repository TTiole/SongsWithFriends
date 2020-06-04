import React, { useState } from "react"
import Typography from '../../Typography/Typography';
import "./Chat.css";

const Chat = () => {
    const [messages, setMessage] = useState(["Ahhhhh I love this song :D", "Me too, it's soooooooo good",
        "Hey, can I add a few song?"]);
    return (
        <div id="chat-container">
            <div id="top-container">
                <Typography>Chat</Typography>
                <p>X</p>
            </div>
            <div>
                {messages.map((msg) => {
                    <ChatCell msg={msg}></ChatCell>
                })}
            </div>
        </div>
    );
}

const ChatCell = (props) => {
    return (
        <div className="msg-container">
            <Typography>{props.msg}</Typography>
        </div>
    );
}

export default Chat;