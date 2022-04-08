import { Box , Typography , TextField , Button ,LinearProgress} from '@mui/material';
import React,{useState} from 'react'; 
import { FlexBox } from '../components/FlexBox'; 
import { getSession } from '../auth/session';
import { createUser } from '../auth/AuthContext';
import { useRouter } from 'next/router';
import { connect } from '../config/dbConn';
const Registration = () => {

   
     
     
    const [errors , setErrors] = useState()
    const [loading , setLoading] = useState(false)
    const router = useRouter()
    function handleRegistration(event){
        event.preventDefault() 
        
        const {
            email : {value : emailVal},
            password : {value : passwordVal},
            firstName : {value : firstNameVal},
            lastName : {value : lastNameVal}
        } = event.currentTarget

        
        setLoading(true)



        createUser({
            email : emailVal,
            password : passwordVal,
            firstName : firstNameVal,
            lastName  : lastNameVal
        }).then(()=>{ 
            setErrors(null)
            router.replace("/")
        })
        .catch((errors)=>{
            console.log(errors)
             setLoading(false) 
            if(errors._type === "VALIDATION_ERRORS")
                return setErrors(errors) 
            else if(errors.type === "DUPLICATE_KEY_VALUE"){  
                return setErrors({email : {
                    message : "Email Already in used"
                }})
            }  
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
