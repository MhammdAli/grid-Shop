import React from 'react';
import { Button, TextField, Typography , Alert} from '@mui/material';
import { Box } from '@mui/system';
import { getSession } from '../auth/session';
import {useRouter} from "next/router";
import { signIn } from '../auth/AuthContext';
import { connect } from '../config/dbConn'; 
import Layout from '../components/Layout';
const Signin = () => {
 
    const [error,setError] = React.useState(null)
    const router = useRouter() 
    const handleForm = async (event)=>{
        event.preventDefault()
   
        const {
            email : {value : emailVal},
            password : {value : passVal}
        } = event.target
  
       
        signIn(emailVal,passVal)
        .then(()=>{ // take token as a parameter
           setError(null)  
           const {
              redirect
           } = router.query
           router.replace(redirect ? `/${redirect}` : "/")
           
        }).catch(err=>{  
          if(err.name === "INVALID_PASSWORD"){
              setError("Password is Invalid Please Correct it")  
          }else if(err.name === "EMAIL_NOT_FOUND"){
            setError("Email is wrong")  
          }
        })
          
    }
 
    return ( 
        <Layout>
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
                        
                        <Button fullWidth variant="contained" sx={{my : 2,borderRadius : 0}} type="submit">LOGIN</Button>
                </form> 
            </Box>  
        </Layout>
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
