import React, {  useState, useEffect, createContext, useReducer} from 'react';
import io from 'socket.io-client';
import { Grid, Grow } from '@material-ui/core'

import Dashboard from './dashboard/dashboard';
import VideoContainer from './Video-container/video-container';
import ChatContiner from './Chat-container/chat-container';
import reducer from '../reducer/reducer';


const storage = {
    mediaInfo: "",
    preoffer: {},
    peerConnection: {},
    dataChannel: {},
    reciverOffer: {},
    set setMediaInfo(media) {
        this.mediaInfo = media;
    },
    get getMediaInfo() {
        return this.mediaInfo;
    },
    set setPreoffer(data) {
        this.preoffer = data;
    },
    get getPreoffer() {
        return this.preoffer;
    },
    set setPeerConnection(data){
        this.peerConnection = data;
    },
    get getPeerConnection() {
        return this.peerConnection;
    },
    set setDataChannel(data) {
        this.dataChannel = data;
    },
    get getDataChannel() {
        return this.dataChannel;
    },
    set setReciverOffer(data) {
        this.reciverOffer = data;
    },
    get getReciverOffer() {
        return this.reciverOffer;
    }
}

const messageContext = createContext(null);
export {messageContext};

const App = () => {

    const [socket, setSocket] = useState(io('https://video-chat-pesonalcode.herokuapp.com'));
    const [chatContainer, setChatContainer] = useState(false);
    const myStorage = storage;
    const message = [];

    const [state, dispatch] = useReducer(reducer, message)

    const configuration = {
        iceServers:[
            {
                urls: "stun:stun.l.google.com:13902"
            }
        ]
     }

    const createPeerConnection = (data) => {

        myStorage.setPeerConnection = new RTCPeerConnection(configuration);
         
        myStorage.setDataChannel = myStorage.getPeerConnection.createDataChannel('chat');
 
        myStorage.getPeerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;
 
            dataChannel.onmessage = (event) => {
                 const message = JSON.parse(event.data);
                 message.check = "reciver"
                 dispatch({
                     type: "RECIVER",
                     payload: message
                 })
            };
        }
 
        myStorage.getPeerConnection.onicecandidate = (event) => {
            if(event.candidate){
                socket.emit("webRTC-signaling",{
                    connectedUserSocketId: data.callerSocketId,
                    type: "ICE_CANDIDATE",
                    candidate: event.candidate
                })
            }
        }
         
        const remoteStream = new MediaStream();
        
        const video = document.getElementById("remoteVideo");
        video.srcObject = remoteStream;

        myStorage.getPeerConnection.ontrack = (event) => {
            remoteStream.addTrack(event.track);
        }

        if(data.callType === "Video"){
            for (const track of myStorage.getMediaInfo.getTracks()) {
                myStorage.getPeerConnection.addTrack(track, myStorage.getMediaInfo);
            }
        }
 
     }

     useEffect(() => {
        socket.on("pre-offer", (data) =>{
            myStorage.setPreoffer = data;
            console.log("set-get",myStorage.getPreoffer)
        })
     },[socket])
 


    return (
        <Grow in >
            <messageContext.Provider value={{state, dispatch}}>
                <Grid container alignItems="stretch" style={{height: "100vh"}}>
                    <Grid item xs={3} style={{ backgroundImage: "linear-gradient(#6f00ff,#9f40ff)" }}>
                        <Dashboard socket={socket} />
                    </Grid>
                    <Grid item xs={6} >
                        <VideoContainer socket={socket} createPeerConnection={createPeerConnection} setChatContainer={setChatContainer} storage={storage} />
                    </Grid>
                    <Grid item xs={3} style={{ backgroundColor: "#ddd3ee"}}>
                        <ChatContiner socket={socket} chatContainer={chatContainer} setChatContainer={setChatContainer} storage={storage}  />
                    </Grid>
                </Grid>
            </messageContext.Provider>
        </Grow>
    );
}

export default App;