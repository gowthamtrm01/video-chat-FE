import React,{useEffect, useState, useContext} from 'react';
import { Grid, InputAdornment } from '@material-ui/core';
import { TextField, IconButton} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import useStyle from "./style";
import {messageContext} from '../app'

const ChatContiner = ({socket, chatContainer, setChatContainer, storage}) => {

    const classes = useStyle();
    const [message, setMessage] = useState("");
    const myStorage = storage;
    const {state, dispatch} = useContext(messageContext); 

    useEffect(() => {

        socket.on("pre-offer-answer", (data) => {
            if(data.preOfferAnswer === "CALL_ACCEPTED"){
                if(data.callType === "Chat" || data.callType === "Video"){
                    setChatContainer(true);
                }
            }
        })

        socket.on("pre-offer-check", (data) => {
            if(data.preOfferAnswer === "CALL_ACCEPTED"){
                if(data.callType === "Chat" || data.callType === "Video"){
                    setChatContainer(true);
                }
            }
        })

    },[socket])

    const onMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const sendMessage = () => {

        const newMessage = {check: "sender"};
        newMessage.message = message;
        const stringifedMessage = JSON.stringify(newMessage);
        myStorage.getDataChannel.send(stringifedMessage);
        dispatch({
            type: "SENDER",
            payload: newMessage
        })
        setMessage("");
    }

    const enterMessage = (e) => {
        if(e.key === "Enter") {
            const newMessage = {check: "sender"};
            newMessage.message = message;
            const stringifedMessage = JSON.stringify(newMessage);
            myStorage.getDataChannel.send(stringifedMessage);
            dispatch({
                type: "SENDER",
                payload: newMessage
            })
            setMessage("");
            
        }
    }

    return(
        <Grid container>
            <Grid item xs={12} className={classes.messageContainer} >
                {state.map((msg, index) => {
                    if(msg.check === "reciver") {
                        return(
                            <div className={classes.messageLeftSide} key={index} >
                                <p className={classes.reciveMessage} >{msg.message}</p>
                            </div>
                        )
                    }else{
                        return(
                            <div className={classes.messageRightSide} key={index} >
                                <p className={classes.senderMessage} >{msg.message}</p>
                            </div>
                        )
                    }
                })}
            </Grid>
            {chatContainer  && (
                <Grid item xs={12} className={classes.inputContainer}>
                    <TextField 
                        variant="outlined" 
                        label="Type your message..." 
                        autoFocus
                        fullWidth
                        onChange={onMessageChange}
                        onKeyPress={enterMessage}
                        value={message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton onClick={sendMessage}>
                                    <SendIcon/>
                                </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            )}
        </Grid>
    );
}

export default ChatContiner;