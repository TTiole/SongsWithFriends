import React, { useState } from "react"
import Typography from '../Typography/Typography';
import "./Chat.css";

import CloseIcon from '@material-ui/icons/Close';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

const Chat = () => {
    const [messages, setMessage] = useState([
        {
            msg: "Ahhhhh I love this song :D",
            type: "external"
        }
        ,
        {
            msg: "Me too, it's soooooooo good",
            type: "external"
        },
        {
            msg: "Hey, can I add a few song?",
            type: "internal"
        }

    ]);
    return (
        <div id="chat-container">
            <div id="top-container">
                <Typography bold fontSize="20" color="white">Chat</Typography>
                <CloseIcon style={{ fill: "white", fontSize: "20px" }}></CloseIcon>
            </div>

            <div id="msgs-container">
                {messages.map((msg) => <ChatCell msg={msg.msg} type={msg.type}></ChatCell>)}
            </div>

            <div id="input-wrapper">
                <input id="input"></input>
                <SendRoundedIcon></SendRoundedIcon>
            </div>
        </div>
    );
}

const ChatCell = (props) => {
    let showAvatar = true;
    let style = {
        justifyContent: "flex-start"
    }
    if (props.type === "internal") {
        showAvatar = false;
        style = {
            justifyContent: "flex-end"
        }
    }

    return (
        <div className="cell" style={style}>
            {showAvatar ? <div className="avatar"></div> : null}
            <div className="text-container">
                <Typography fontSize="12px">{props.msg}</Typography>
            </div>
        </div>
    );
}

export default Chat;