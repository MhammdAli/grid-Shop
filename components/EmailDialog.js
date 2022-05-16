import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog'; 
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Avatar, Snackbar, TextField } from '@mui/material';
import {sendEmail} from "../utilities/sendClientEmail";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function EmailDialog({open , row , handleClose}) {
  
 
  const [cc , setcc] = React.useState("");
  const [bcc , setbcc] = React.useState("");
  const [subject , setSubject] = React.useState("");
  const [body , setBody] = React.useState("");

  const [SnackMessage, setSnackMessage] = React.useState({message : null,isError : null});

  

  function onCcChange({target}){
    setcc(target.value)
  }

  function onBccChange({target}){
    setbcc(target.value)
  }

  function onSubjectChange({target}){
    setSubject(target.value)
  }

  function onBodyChange({target}){
    setBody(target.value)
  }

  function sendEmailHandler(){
      new sendEmail()
      .setBCC(bcc)
      .setCC(cc)
      .setSubject(subject)
      .setBody(body)
      .setTo(row.email)
      .setFrom("ME")
      .send()
      .then(((res)=>{ 
          setSnackMessage({
              message : "Email Sent successfuly",
              isError : false
          })
          handleClose();
      }))
      .catch(err=>{
        if(err.type=== "ERROR"){ 
          setSnackMessage({
            message : "Something Went Wrong!",
            isError : true
          })
        }
      })
  }
   
  return (
    <div> 
      <Snackbar open={Boolean(SnackMessage?.message)}  sx={{
          "& .MuiPaper-root" : {
              backgroundColor : SnackMessage.isError ? "error.main" : "success.main"
          }
      }} autoHideDuration={2000} onClose={()=>{ 
          setSnackMessage({message : null,isError : null}) 
      }} message={SnackMessage.message} anchorOrigin={{vertical: 'top',horizontal: 'center'}} />
          
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar variant='dense'>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Avatar
                alt="Remy Sharp"
                src={row?.imageUrl ? `/images/${row.imageUrl}` : ""} 
            />
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Send Email To {row && `${row.firstName}`}
            </Typography>
            <Button autoFocus color="inherit" onClick={sendEmailHandler}>
              Send
            </Button>
          </Toolbar>
        </AppBar>
        <List> 
          <ListItem> 
              <Typography sx={{mr:2}}>To: </Typography> 
              <Typography> {row?.email}</Typography>  
          </ListItem> 
          <ListItem> 
              <TextField value={cc} onChange={onCcChange} variant="outlined" size="small" fullWidth placeholder='CC'/>  
          </ListItem> 
          <ListItem> 
              <TextField value={bcc} onChange={onBccChange} variant="outlined" size="small" fullWidth placeholder='BCC'/>  
          </ListItem>  
          <ListItem> 
              <TextField value={subject} onChange={onSubjectChange} variant="outlined" size="small" fullWidth placeholder='subjcet'/>  
          </ListItem> 
          <ListItem> 
              <TextField value={body} onChange={onBodyChange} multiline minRows={10} variant="outlined" size="small" fullWidth placeholder='Body'/>  
          </ListItem>  
        </List>
      </Dialog>
    </div>
  );
}