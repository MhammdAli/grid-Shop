import { Snackbar } from '@mui/material';
import React from 'react';

export const NOTIFICATION_TYPE = {
    SUCCESS : 'SUCCESS',
    ERROR    : 'FAIL',
    WARN    : 'WARN'
}

function renderNotificationColor(type){
    switch(type){ 
        case NOTIFICATION_TYPE.ERROR   : return "error.main"
        case NOTIFICATION_TYPE.WARN    : return "warnning.main"
        default : return "success.main"
    }
}

 
const Notification = ({open,message,type,onClose,duration}) => {
    return (
        <Snackbar  open={open}  sx={{
            "& .MuiPaper-root" : {
                backgroundColor : renderNotificationColor(type)
            }
        }} autoHideDuration={duration} onClose={onClose}  message={message} anchorOrigin={{vertical: 'top',horizontal: 'center'}} />
    );
}

export default Notification;
