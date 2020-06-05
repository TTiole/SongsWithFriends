import React, { useState, useRef, useEffect } from "react"
import Typography from '../Typography/Typography';
import "./Chat.css";
import {connect} from 'react-redux'
import {toggleChat} from '../../Redux/Actions/userAction'

import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Collapse from '@material-ui/core/Collapse'
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import useWindowSize from '../../useWindowSize'
import {mobileWidth} from "helpers/constants"
import {
    MESSAGE, CHAT_CONNECT
} from "helpers/socket_events.js";

const Chat = props => {
    const [messages, setMessage] = useState([]);
    
    const inputRef = useRef();
    const containerRef = useRef();
    const size = useWindowSize();
    
    useEffect(() => {
        // Scroll to bottom
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, [messages])

    useEffect(() => {
        if(props.socket !== null) {
            props.socket.on(MESSAGE, (msgObj) => {
                setMessage(prevMessages => [...prevMessages, msgObj])
            })
            props.socket.emit(CHAT_CONNECT)
        }
    }, [props.socket])

    const submitMsg = () => {
        const text = inputRef.current.value;
        inputRef.current.value = "";
        setMessage(prevMessages => [...prevMessages, {
            msg: text,
            type: "internal"
        }]);
        props.socket.emit(MESSAGE, text);
    }

    const toggleOpen  = e => {
        props.toggleChat(!props.open)
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    const submitEnter = e => {
        if(e.key === "Enter")
            submitMsg();
    }

    return (
        <div id="chat-container" className={`${props.open}`}>
            <div id="top-container">
                <Typography bold fontSize="20" color="white">Chat</Typography>
                {props.open ? (size.width < mobileWidth ?<CloseRoundedIcon onClick={toggleOpen}/>:<ExpandMoreRoundedIcon onClick={toggleOpen}/>):<ExpandLessRoundedIcon onClick={toggleOpen}/>}
                
            </div>
            <Collapse in={props.open} ref={containerRef}>
                <div id="msgs-container">
                    {messages.map((msg, i) => <ChatCell key={i + " "+ msg.author} {...msg}></ChatCell>)}
                </div>

                <div id="chat-input-wrapper">
                    <input id="chat-input" ref={inputRef} onKeyUp={submitEnter} placeholder="Send Message"/>
                    <SendRoundedIcon onClick={submitMsg}/>
                </div>
            </Collapse>
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

const mapStateToProps = state => {
    return {
        socket: state.userReducer.socket,
        open: state.userReducer.chatOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openChat: () => dispatch(toggleChat(true)),
        closeChat: () => dispatch(toggleChat(false)),
        toggleChat: state => dispatch(toggleChat(state))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);