import React from 'react';
import { Button, Checkbox , FormControlLabel, Snackbar, TextField, Typography , Alert, IconButton} from '@mui/material';
import { Box } from '@mui/system';
import CustomLink from "../utilities/customRouting"
import { FlexBox } from '../components/FlexBox';  
import { getSession } from '../auth/session';
import {useRouter} from "next/router" 
import { Close } from '@mui/icons-material';
import { signIn } from '../auth/AuthContext';
import { connect } from '../config/dbConn';
const Signin = () => {

    const [rememberMeError , setRememberMe] = React.useState(false)
    const [error,setError] = React.useState(null)
    const router = useRouter()
  
    const handleForm = async (event)=>{
        event.preventDefault()
   
        const {
            email : {value : emailVal},
            password : {value : passVal},
            rememberMe : {checked : rememberVal}
        } = event.target
  
     
        if(!rememberVal) return setRememberMe(true)
        
        setRememberMe(false)
       

        signIn(emailVal,passVal)
        .then(()=>{ // take token as a parameter
           setError(null)
           router.replace("/")
        }).catch(err=>{  
          if(err.name === "INVALID_PASSWORD"){
              setError("Password is Invalid Please Correct it")  
          }else if(err.name === "EMAIL_NOT_FOUND"){
            setError("Email is wrong")  
          }
        })
          
    }
 
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setRememberMe(false);
      };


    const action = (
        <React.Fragment> 
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      );
    return ( 
        <Box sx={{maxWidth : 500,my : 10,mx : "auto",px : 2}}>  
            <form onSubmit={handleForm}>
                <Typography variant="h5" align='center' sx={{my : 2}}>LOGIN</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                    type="email"
                    required variant="outlined" label="Email" margin="normal" fullWidth size="small" name="email"  /> 
                    <TextField
                    type="password"
                    required variant="outlined" label="password" margin="normal" fullWidth size="small" name="password"
                    /> 
                    <FlexBox> 
                        <FormControlLabel control={<Checkbox />} label="Remember Me" name="rememberMe"/>
                        <CustomLink route="/forget" disableDecoration>
                            Forget?
                        </CustomLink>
                    </FlexBox>
                    <Button fullWidth variant="contained" sx={{my : 2,borderRadius : 0}} type="submit">LOGIN</Button>
            </form>
            
            <Snackbar open={rememberMeError}  sx={{
                "& .MuiPaper-root" : {
                    backgroundColor : "error.main"
                }
            }} autoHideDuration={100000} onClose={handleClose} action={action} message="RememberMe is not checked!!">
                
            </Snackbar>
            
        </Box> 
    );
}

export async function getServerSideProps(context) {
    await connect()
    const session = await getSession(context) 
    
    if(session.type === "SUCCESS"){
        return {
            redirect : {
                destination : "/"
            }
        }
    }
    
 
    return {
      props: {session : null}, 
    }
}

export default Signin;
