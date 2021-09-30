import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Stack } from '@mui/material';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';

import avatar from './../images/avatar.png';
import useStyles from './style';

const Popup = ({openPopup, setOpenPopup, title, socket, info}) => {

    const configuration = {
        iceServers:[
            {
                urls: "stun:stun.l.google.com:13902"
            }
        ]
     }

    const classes = useStyles();

    socket.on("pre-offer-answer", (data) => {
        if(data.preOfferAnswer === "CALL_REJECTED"){
            setOpenPopup(false);
        }
    })

    const onAccept = () => {
        const data={
            callerSocketId: info.callerSocketId,
            preOfferAnswer: "CALL_ACCEPTED",
            callType: info.callType
        }
        socket.emit("pre-offer-answer", data)

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onicecandidate = (event) => {
            console.log("getting ice candidates from  stun server");
            if(event.candidate){
                socket.emit("webRTC-signaling",{
                    connectedUserSocketId: data.callerSocketId,
                    type: "ICE_CANDIDATE",
                    candidate: event.candidate
                })
            }
        }
    
        peerConnection.onconnectionstatechange = (event) => {
            if(peerConnection.connectionState === "connected") {
                console.log("succesfully connected with other peer");
            }
        }
        setOpenPopup(false);
    }

    const onReject = () => {
        const data={
            callerSocketId: info.callerSocketId,
            preOfferAnswer: "CALL_REJECTED"
        }
        socket.emit("pre-offer-answer", data)
        setOpenPopup(false);
    }

    return (
        <Dialog open={openPopup}>
            <DialogTitle className={classes.title} >
                Incoming {title} Call
            </DialogTitle>
            <DialogContent>
                <div className={classes.container}>
                    <img src={avatar} alt="avatar" className={classes.avatar} height="150" ></img>
                    <Stack direction="row" spacing={2} className={classes.buttonContainer}>
                        <Button variant="contained" color="success" endIcon={<PhoneCallbackIcon/>} onClick={onAccept}>Accept</Button>
                        <Button variant="contained" color="error" endIcon={<PhoneDisabledIcon/>} onClick={onReject} >Reject</Button>
                    </Stack>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default Popup;