import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    logoContainer: {
        display: "inline-flex",
        marginLeft: "10px",
        alignItems: "center"
    },
    logo:{
        borderRadius: '50%',
        margin: "10px"
    },
    title:{
        color: 'white'
    },
    discriptionContainer:{
        justifyContent: "center"
    },
    description:{
        color: "white",
        marginLeft: "10px"
    },
    personalCodeContainer:{
        backgroundColor: "#9f40ff",
        borderRadius: "6px",
        margin: "auto",
        marginTop: "10px",
        width: "90%",
        height: "100%",
        textAlign: "center"
    },
    personalCodedescription:{
        color: "white",
    },
    personalCodeValueContainer:{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"

    },
    personalCodeValueParagraphy:{
        color: "white",
    },
    personalCodeInput: {
        padding: "20px"
    },
    inputContainer: {
       margin: "20px 0",
       display: "flex"
    },
    button: {
        margin: "0 20px"
    },
    footer:{
        textAlign: "center",
    },
    footerParagraph: {
        color: "white"
    }
}))