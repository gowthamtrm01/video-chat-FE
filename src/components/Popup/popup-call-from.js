import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Stack } from '@mui/material';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import avatar from './../images/avatar.png';
import useStyles from './style';

const PopupCallFrom = ({openPopup, setOpenPopup, socket, info}) => {

    const classes = useStyles();

    const onReject = () => {
        const data={
            callerSocketId: info,
            preOfferAnswer: "CALL_REJECTED"
        }
        socket.emit("pre-offer-answer", data)
        setOpenPopup(false);
    }

    return (
        <Dialog open={openPopup} >
            <DialogTitle className={classes.title} >
                Calling ...
            </DialogTitle>
            <DialogContent>
                <div className={classes.container}>
                    <img src={avatar} alt="avatar" className={classes.avatar} height="150" ></img>
                    <Stack direction="row" spacing={2} className={classes.buttonContainer}>
                        <Button variant="contained" color="error" endIcon={<PhoneDisabledIcon/>} onClick={onReject} >Reject</Button>
                    </Stack>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PopupCallFrom;