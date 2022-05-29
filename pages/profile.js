import React,{useState} from 'react';
import {Container , Avatar , Typography , Box , TextField,Button, List, ListItem, Skeleton} from "@mui/material";
import axios from 'axios';
import {useStore} from "../store/store"
import {useAuth} from "../auth/AuthContext"
import {useRouter} from "next/router" 
import { addUserInfoAction } from '../store/actions';
import Layout from '../components/Layout';
const Profile = () => {

    const [errors , setErrors] = useState() 
    const {state ,dispatch} = useStore()
    const {status} = useAuth()
     
    const router = useRouter(); 
    const firstNameRef = React.useRef();
    const LastNameRef = React.useRef()
    async function handleChangingProfile(event){
        event.preventDefault();
        const {
            firstName : {value : fnameVal},
            lastName : {value : lnameVal}, 
            imageProfile : {files}
        } = event.target
       
        const formData = new FormData()
        formData.append("firstName" , fnameVal)
        formData.append("lastName" , lnameVal)
         
        if(files) formData.append("avatar",files[0])

        try{
            const {data} = await axios.patch("/api/users/me",formData,
                {
                    headers : {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
 
            if(data.isChanged){ 
                setErrors({}) 
                dispatch(addUserInfoAction(Object.keys(data.result).reduce((agg,field)=>{ 
                    agg[field] = data.result[field]
                    return agg;
                },{}))) 
            }else{ 
                setErrors(Object.keys(data).reduce((agg,item)=>{  
                    agg[item] = {
                        message : data[item]?.message
                    } 
                    return agg;
                },{}))
            }
        }catch(err){
            console.log(err)
        }

  
    }

    React.useEffect(()=>{ 
        firstNameRef.current.value = state.userInfo?.firstName
        LastNameRef.current.value = state.userInfo?.lastName
    },[state.userInfo?.firstName , state.userInfo?.lastName])

    React.useEffect(()=>{
        if(status === "UNUTHENTICATED") return router.replace("/signin") 
    },[router , status])

     
    return (
        <Layout>
            <Container>
                
                <Box sx={{width : "70%"}} m={"auto"}>
            
                    <form onSubmit={handleChangingProfile}>
                        <Typography variant="h5" sx={{my : 2}}>Changing profile</Typography>
                            <List>
                            <ListItem sx={{justifyContent:"center"}} py={0}>
                                {state.userInfo ?
                                <Avatar alt={`${state.userInfo.firstName} ${state.userInfo.lastName} Image profile`} src={state.userInfo && `/images/${state.userInfo.imageUrl}`}  sx={{ width: 300, height: 300 }} /> 
                                :
                                <Skeleton
                                    sx={{ bgcolor: 'grey.900', width: 300, height: 300 }}
                                    variant="circular"
                                    animation="wave" 
                                />
                                }
                            </ListItem>
                            <ListItem  py={0}>
                            <Typography variant="body2">Change Image Profile</Typography>
                            </ListItem>
                            <ListItem py={0}>
                                <TextField
                                    type="file"
                                    variant="outlined" margin="normal" fullWidth size="small" 
                                    name="imageProfile" 
                                /> 
                            </ListItem> 
                            <ListItem  py={0}>
                            <Typography variant="body2">First Name</Typography>
                            </ListItem>
                            <ListItem py={0}>
                                <TextField 
                                    variant="outlined" margin="normal" fullWidth size="small" 
                                    name="firstName"
                                    inputRef={firstNameRef} 
                                    helperText={errors?.firstName ? errors?.firstName?.message : ""}
                                    error={errors?.firstName && Boolean(errors?.firstName?.message)}
                                /> 
                            </ListItem> 
                            <ListItem  py={0}>
                            <Typography variant="body2">Last Name</Typography>
                            </ListItem>
                            <ListItem py={0}>
                                <TextField 
                                    variant="outlined"  margin="normal" fullWidth size="small" 
                                    name="lastName"  
                                    inputRef={LastNameRef} 
                                /> 
                            </ListItem> 
                            <ListItem py={0}>
                                <Button fullWidth variant="contained" sx={{my : 2,borderRadius : 0}} type="submit">Change Profile</Button>
                            </ListItem>
                        </List>  
                            
                    
                        
                    </form>
                
                </Box>
            </Container>
        </Layout>
    );
}

export default Profile;
