import React, { useEffect, useState } from 'react';
import {Typography, Grid} from '@material-ui/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {IconButton, TextField, Button, dialogTitleClasses} from '@mui/material';


import useStyles from './style';
import logo from './../images/logo.jfif'
import Popup from '../Popup/popup';
import PopupCallFrom from '../Popup/popup-call-from';
import InfoPopup from '../Popup/info-popup';

const storage = {
    mediaInfo: "",
    set setMediaInfo(media) {
        this.mediaInfo = media;
    },
    get getMediaInfo() {
        return this.mediaInfo;
    }
}

const Dashboard = ({socket}) => {

    const myStorage = storage;
    const classes = useStyles();
    const [id, setId] = useState();
    const [personalCode, setPersonalCode] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState();
    const [popupCallFrom, setPopupCallFrom] = useState(false);
    const [sendId, setSendId] = useState();
    const [infoDialog, setInfoDialog] = useState(false);
    const [infoState, setInfoState] = useState({title: "", description: ""})

    useEffect(() => {
        socket.on("connect",() => {
            setId(socket.id)
        })

        socket.on("Deleted", () => {
            console.log("eleminating");
        })

        socket.on("pre-offer", (data) => {
            setSendId(data);
            setPopupTitle(data.callType);
            setOpenPopup(true);
        })

        socket.on("pre-offer-answer", (data) => {
            if(data.preOfferAnswer === "CALL_ACCEPTED"){


                setPopupCallFrom(false);
            }else if(data.preOfferAnswer === "CALL_REJECTED"){
                setPopupCallFrom(false);
                setInfoState({title: "Call rejected", description: "Callee rejected your call"});
                setInfoDialog(true);
                setTimeout(() => {
                    setInfoDialog(false);
                }, [4000])
            }else if(data.preOfferAnswer === "CALLEE_NOT_FOUND"){
                setPopupCallFrom(false);
                setInfoState({title: "Call not found", description: "Please check personal code"});
                setInfoDialog(true);
                setTimeout(() => {
                    setInfoDialog(false);
                }, [4000])
            }
        })

    },[socket])

    const copytoClipboard = () => {
        navigator.clipboard && navigator.clipboard.writeText(id);
    }

    const onChangePersonalCode = (e) => {
        setPersonalCode(e.target.value);
        myStorage.setMediaInfo= e.target.value;
    }

    const onChatCall = () => {
        if(personalCode !== id){
            const data = { callType: "Chat", calleePersonalCode: personalCode};
            socket.emit("pre-offer", data);
            setPersonalCode("");
            setPopupCallFrom(true);
        }
    }

    const onVideoCall = () => {
        if (personalCode !== id){
            const data = { callType: "Video", calleePersonalCode: personalCode};
            socket.emit("pre-offer", data);
            setPersonalCode("");
            setPopupCallFrom(true);
        }
    }

    return (
        <>
            <Grid container spacing={6}>
                <Grid item className={classes.logoContainer}>
                    <img src={logo} className={classes.logo} alt="Icon" height="120" />
                    <Typography variant="h4" className={classes.title}>Video-Chat</Typography>
                </Grid>
                <Grid item>
                    <div className={classes.discriptionContainer}>
                        <Typography  className={classes.description} >Talk with other person by passing his personal code.</Typography>
                        <div className={classes.personalCodeContainer}>
                            <div>
                                <Typography className={classes.personalCodedescription}>Your personal code</Typography>
                            </div>
                            <div className={classes.personalCodeValueContainer} >
                                <Typography variant="h6" className={classes.personalCodeValueParagraphy} >{id}</Typography>
                                <IconButton onClick={copytoClipboard} >
                                    <ContentCopyIcon/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" className={classes.personalCodeInput}>
                        <TextField label="Personal Code" fullWidth variant="outlined" value={personalCode} onChange={onChangePersonalCode} ></TextField>
                        <div className={classes.inputContainer}>
                            <div className={classes.button} >
                                <Button variant="contained" color="primary" onClick={onChatCall} >Chat</Button>
                            </div>
                            <div className={classes.button}>
                                <Button variant="contained" color="primary" onClick={onVideoCall} >Video</Button>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{padding: "none"}} >
                    <div  className={classes.footer}>
                        <Typography className={classes.footerParagraph}>Meet each others</Typography>
                    </div>
                </Grid>
                
            </Grid>
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title={popupTitle} socket={socket} info={sendId} />
            <PopupCallFrom openPopup={popupCallFrom} setOpenPopup={setPopupCallFrom} socket={socket} info={myStorage.getMediaInfo} />
            <InfoPopup openPopup={infoDialog} info={infoState} />
        </>
    );
}

export default Dashboard;