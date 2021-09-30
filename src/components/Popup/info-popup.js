import React from 'react';
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';

import avatar from './../images/avatar.png';
import useStyles from './style';

const InfoPopup = ({openPopup, info}) => {

    const classes = useStyles();

    return (
        <Dialog open={openPopup}>
            <DialogTitle className={classes.title} >
               {info.title}
            </DialogTitle>
            <DialogContent>
                <div className={classes.container}>
                    <img src={avatar} alt="avatar" className={classes.avatar} height="150" ></img>
                    <Stack direction="row" spacing={2} className={classes.buttonContainer}>
                        {info.description}
                    </Stack>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default InfoPopup;