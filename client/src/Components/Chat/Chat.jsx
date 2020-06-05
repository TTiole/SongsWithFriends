import React, { useState } from "react"
import Typography from '../Typography/Typography';
import "./Chat.css";

import CloseIcon from '@material-ui/icons/Close';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

const Chat = () => {
    const [messages, setMessage] = useState([
        {
            msg: "Ahhhhh I love this song :D",
            type: "external",
            author: "Eli"
        },
        {
            msg: "Me too, it's soooooooo good",
            type: "broadcast",
            author: "David"
        },
        {
            msg: "Hey, can I add a few song?",
            type: "internal"
        },
        {
            msg: "Yeah for sure?",
            type: "external",
            author: "Eli"
        },
        {
            msg: "yeahhhh",
            type: "external",
            author: "David"
        },
        {
            msg: "ADjiksmal;jFOPR'AKSDLNFIJOEKLSJKGNAKLSFOPr'w;nfokelwaforjni3fklaem/owjitoal;kem;o'klmREFN;JKEA;LNKMLAE",
            type: "external",
            author: "Sry had a seizure"
        }

    ]);
    return (
        <div id="chat-container">
            <div id="top-container">
                <Typography bold fontSize="20" color="white">Chat</Typography>
                <CloseIcon style={{ fill: "white", fontSize: "20px" }}></CloseIcon>
            </div>

            <div id="msgs-container">
                {messages.map((msg) => <ChatCell {...msg}></ChatCell>)}
            </div>

            <div id="chat-input-wrapper">
                <input id="chat-input"/>
                <SendRoundedIcon/>
            </div>
        </div>
    );
}

const ChatCell = (props) => {
    let style = {
        justifyContent: "flex-start"
    }
    if (props.type === "internal") {
        style = {
            justifyContent: "flex-end"
        }
    }
    if(props.type !== "broadcast") {
        return (
            <div className="chat-cell" style={style}>
                <div className="chat-text-container">
                    <Typography fontSize="13px">{props.type === "internal" ? "You":props.author}:</Typography>
                    <Typography fontSize="12px">{props.msg}</Typography>
                </div>
            </div>
        );
    } else {
        return (
            <div className="chat-cell">
                <Typography align="center" 
                        additionalStyles={{fontStyle: "italic", display: "block", width: "100%"}} 
                        fontSize="12px" 
                        color="#999" 
                        padding="0 10px">
                    {props.msg}
                </Typography>
            </div>
        )
    }
}

export default Chat;