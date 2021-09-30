import { makeStyles } from "@material-ui/core";

export default makeStyles ((theme) => ({
    messageContainer:{
        width: "100%",
        height: "560px",
        margin: "10px",
        overflowY: "auto"
    },
    inputContainer: {
       margin: "10px"
    },
    messageRightSide:{
        display: "flex",
        justifyContent: "right",
        margin: "5px",
    },
    senderMessage:{
        color: "white",
        backgroundColor: "#6f00ff",
        borderRadius: "7px",
        display: "inline-block",
        padding: "5px 10px",
    },
    messageLeftSide:{
        display: "flex",
        justifyContent: "left",
        margin: "5px",
    }, 
    reciveMessage:{
        color: "black",
        backgroundColor: "white",
        borderRadius: "7px",
        display: "inline-block",
        padding: "5px 10px",
    }
}))