import { Box , Typography , TextField , Button ,LinearProgress} from '@mui/material';
import React,{useState} from 'react'; 
import { FlexBox } from '../components/FlexBox';
import axios from "axios";
import {signIn , useSession,getSession} from "next-auth/react"
import {useRouter} from "next/router" 
const Registration = () => {

    const {data : session , status} = useSession()

    const router = useRouter()
 
     
    const [errors , setErrors] = useState()
    const [loading , setLoading] = useState(false)
    
    function handleRegistration(event){
        event.preventDefault() 
        
        const {
            email : {value : emailVal},
            password : {value : passwordVal},
            firstName : {value : firstNameVal},
            lastName : {value : lastNameVal}
        } = event.currentTarget

        
        setLoading(true)
        axios.post("/api/auth/register",{
            email : emailVal,
            password : passwordVal,
            firstName : firstNameVal,
            lastName  : lastNameVal
        })
        .then(res=>{
  
            const type = res.data.type;

            if(type === "ERROR"){
                const  errors = res.data?.err
                
                setLoading(false)
                if(errors._type === "VALIDATION_ERRORS")
                    return setErrors(errors) 
                else if(errors.type === "DUPLICATE_KEY_VALUE"){  
                    return setErrors({email : {
                        message : "Email Already in used"
                    }})
                } 
                
                return;
            }


            setErrors(null)
               
            signIn("credentials",{"redirect" : false,email : emailVal,password : passwordVal})
            .then(res=>{ 
                setLoading(false)
                router.replace("/")
            })
            .catch(err=>{ 
                setLoading(false)
            })
           

        })
        .catch(err=>{
             setLoading(false) 
        })
 
    }
 
 
    return (  
        <>
           {loading && <LinearProgress/>}
        <Box sx={{maxWidth : 500,my : 10,mx : "auto",px:2}}>
            <form onSubmit={handleRegistration}>
                <Typography variant="h5" align='center' sx={{my : 2}}>Registration</Typography>
                
                    <FlexBox> 
                        <TextField
                            type="username"
                            required variant="outlined" label="FirstName" margin="normal" fullWidth size="small" 
                            sx={{mr : 1}} name="firstName"
                            helperText={(errors?.firstName && errors.firstName.message)} error={Boolean(errors?.firstName)}
                        /> 
                    
                        <TextField
                            type="username"
                            required variant="outlined" label="LastName" margin="normal" fullWidth size="small" 
                            sx={{ml : 1}}
                            name="lastName"
                            helperText={(errors?.lastName && errors.lastName.message)} error={Boolean(errors?.lastName)}
                        /> 
                     </FlexBox>
            
                     
                    <TextField
                        type="email"
                        required variant="outlined" label="Email" margin="normal" fullWidth size="small"
                        name="email" 
                        helperText={(errors?.email && errors.email.message)} error={Boolean(errors?.email)}
                    /> 
                    <TextField
                        type="password"
                        required variant="outlined" label="password" margin="normal" fullWidth size="small" 
                        name="password"
                        helperText={(errors?.password && errors.password.message)} error={Boolean(errors?.password)}
                    /> 
                    
                    <Button fullWidth variant="contained" sx={{my : 2,borderRadius : 0}} type="submit">Sign Up</Button>
            </form>
        </Box> 
        </>

    );
}


export default Registration;


export async function getServerSideProps(context) {

    const session = await getSession(context)
 
    if(session){
        return {
            redirect : {
                destination : "/"
            }
        }
    }

    return {
      props: {session}, 
    }
}