import React,{useEffect, useState, useContext} from 'react';
import { Typography, Grid } from '@material-ui/core';
import {IconButton, Stack} from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import logo from './../images/logo.jfif';
import useStyles from './style';
import { messageContext } from '../app';

const VideoContainer = ({socket, storage, createPeerConnection, setChatContainer}) => {

    const myStorage = storage;
    const classes = useStyles();
    const [chatCall, setChatCall] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const [micBoolean, setMicBoolean] = useState(true);
    const [videoBoolean, setVideoBoolean] = useState(true);
    const {dispatch} = useContext(messageContext);
    
    const handleWebRTCOffer = async (data) => {
        console.log("webETC-offer");
        await myStorage.getPeerConnection.setRemoteDescription(data.offer);
        const answer = await myStorage.getPeerConnection.createAnswer();
        await myStorage.getPeerConnection.setLocalDescription(answer);
        socket.emit("webRTC-signaling", {
            connectedUserSocketId: data.fromSocketId,
            fromSocketId: data.connectedUserSocketId,
            type: "ANSWER",
            answer: answer
        })
    }

    const handleWebRTCAnswer = async (data) => {
        console.log("webRTC answer");
        await myStorage.getPeerConnection.setRemoteDescription(data.answer);
    }

    const handleWebRTCIceCandidate = async (data) => {
        try {
             await myStorage.getPeerConnection.addIceCandidate(data.candidate);
        } catch (error) {
            console.error("error ocurred when trying to add received ice cnadidate", error)
        }
    }

    useEffect(() => {
        
        socket.on("from-pre-offer", (data) => {
            myStorage.setReciverOffer = data;
        })

        navigator.mediaDevices.getUserMedia({audio: true, video: true})
            .then((stream) => {
                let video = document.getElementById("localVideo");
                if(video){
                    video.srcObject = stream;
                    myStorage.setMediaInfo = stream;
                }
            }).catch((err) => {
                console.log("error occured when trying to get an access to caamera");
                console.log(err);
            })
        

        socket.on("pre-offer-answer", (data) => {
            if(data.preOfferAnswer === "CALL_ACCEPTED"){  
                document.getElementById("remoteVideo").style.display="block"
                createPeerConnection(data);

                const sendWebRTCoffer = async () => {
                    console.log("send-offer");
                    const offer = await myStorage.getPeerConnection.createOffer();
                    await myStorage.getPeerConnection.setLocalDescription(offer);
                    socket.emit("webRTC-signaling", {
                        connectedUserSocketId: data.toCallerId,
                        fromSocketId: data.callerSocketId,
                        type: "OFFER",
                        offer: offer
                    });
                }

                sendWebRTCoffer();
                
                if(data.callType === "Chat"){
                    setChatCall(true);
                    setVideoCall(false);
                }else if(data.callType === "Video"){
                    setVideoCall(true);
                    setChatCall(false);
                    
                   
                }
            }
        })

        socket.on("pre-offer-check", (data) => {
            if(data.preOfferAnswer === "CALL_ACCEPTED"){
                document.getElementById("remoteVideo").style.display="block"
                createPeerConnection(data);

                if(data.callType === "Chat"){
                    setChatCall(true);
                    setVideoCall(false);
                }else if(data.callType === "Video"){

                    setVideoCall(true);
                    setChatCall(false);
                }
            }
        })

        socket.on("webRTC-signaling", (data) => {
            switch (data.type) {
                case "OFFER":
                    handleWebRTCOffer(data);
                    break;
                case "ANSWER":
                    handleWebRTCAnswer(data);
                    break;
                case "ICE_CANDIDATE":
                    handleWebRTCIceCandidate(data);
                    break;
                default:
                    return;
            }
        })


    },[socket])

    const onMicChange = () => {
        const localStream = myStorage.getMediaInfo;
        const micEnabled = localStream.getAudioTracks()[0].enabled;
        localStream.getAudioTracks()[0].enabled = !micEnabled;
        setMicBoolean((prevMicBoolean) => !prevMicBoolean);
    }

    const onViedoChange = () => {
        const localStream = myStorage.getMediaInfo;
        const videoEnabled = localStream.getVideoTracks()[0].enabled;
        localStream.getVideoTracks()[0].enabled = !videoEnabled;
        setVideoBoolean((prevVideoBoolean) => !prevVideoBoolean);
    }

    const hangUpVideo = () => {
        const data = {
            connectedUserSocketId: myStorage.getPreoffer.callerSocketId
        }
        socket.emit("user-hanged-up", data);
        const senderData = {
            connectedUserSocketId: myStorage.getReciverOffer.calleePersonalCode
        }
        socket.emit("user-hanged-up", senderData)
        myStorage.getPeerConnection.close();
        setChatCall(false);
        setChatContainer(false);
        setVideoCall(false);
        document.getElementById("remoteVideo").style.display = "none";
        dispatch({
            type:"CLEAR"
        })
    }

    socket.on("user-hanges-up", () => {
        myStorage.getPeerConnection.close();
        setVideoCall(false);
        setChatCall(false);
        setChatContainer(false);
        document.getElementById("remoteVideo").style.display = "none";
        dispatch({
            type:"CLEAR"
        })
    })

    const hangUpChat = () => {
        const data = {
            connectedUserSocketId: myStorage.getPreoffer.callerSocketId
        }
        socket.emit("user-hanged-up", data)
        const senderData = {
            connectedUserSocketId: myStorage.getReciverOffer.calleePersonalCode
        }
        socket.emit("user-hanged-up", senderData)
        myStorage.getPeerConnection.close();
        setChatCall(false);
        setVideoCall(false);
        setChatContainer(false);
        dispatch({
            type:"CLEAR"
        })
    }

    return (
        <Grid container >
            <Grid item className={classes.videoContainer}>
                <div className={classes.logoContainer}>
                    <video  autoPlay className={classes.mainVideo}  id="remoteVideo"  ></video>
                    {!videoCall && (
                        <div>
                            <img src={logo} alt="logo"height="120" className={classes.logo} />
                            <Typography variant="h4" className={classes.title}>Video-Chat</Typography>
                        </div>
                    )}
                    <div className={classes.localVideoContainer}>
                        <video autoPlay id="localVideo" muted   className={classes.localVideo}/>
                    </div>
                    {videoCall && (
                        <div className={classes.buttonCenter}>
                            <Stack direction="row" spacing={6} className={classes.buttonContainer} >
                                <IconButton size="large" onClick={onMicChange}>
                                    {micBoolean ? (<MicIcon fontSize="inherit"/>) : (<MicOffIcon fontSize="inherit" />)}
                                </IconButton>
                                <IconButton size="large" color="error" onClick={hangUpVideo} >
                                    <CallEndIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton size="large" onClick={onViedoChange}>
                                    {videoBoolean ? (<VideocamIcon fontSize="inherit"/>) : (<VideocamOffIcon fontSize="inherit"/>)}
                                </IconButton>
                            </Stack>
                        </div>   
                    )}
                    {chatCall && (
                        <div className={classes.buttonCenter}>
                            <Stack className={classes.buttonContainer}>
                                <IconButton size="large" color="error" onClick={hangUpChat} >
                                    <CallEndIcon fontSize="inherit"/>
                                </IconButton>
                            </Stack>
                        </div>
                    )}
                </div>
            </Grid>
        </Grid>
    );
}

export default VideoContainer
