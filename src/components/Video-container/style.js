import { makeStyles } from "@material-ui/core";

export default makeStyles ((theme) => ({
    videoContainer: {
        backgroundImage: "linear-gradient(#6f00ff,#9f40ff)",
        borderRadius: "10px",
        width: "100%",
        height: "590px",
        margin: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    logoContainer:{
        textAlign: "center",
    },
    logo: {
        borderRadius: "50%",
    },
    title: {
        color: "white"
    },
    localVideoContainer:{
        backgroundColor: "#9f40ff",
        borderRadius: "10px",
        width: "150px",
        height: "150px",
        position: "absolute",
        left: "0",
        top: "0",
        margin: "10px"
    },
    localVideo:{
        width: "150px",
        height: "150px"
    },
    buttonCenter:{
        display: "flex",
        justifyContent: "center"
    },
    buttonContainer:{
        position: "absolute",
        bottom: "0",
        marginBottom: "10px"
    },
    mainVideo:{
        position: "absolute",
        left: "0",
        top: "0",
        margin: "10px",
        width: "96%",
        height: "97%"
    }
}))