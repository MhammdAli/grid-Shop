import React, { useState } from 'react';
import AdminLayout from '../../../../components/adminLayout';
import { connect } from '../../../../config/dbConn';
import {getSession} from "../../../../auth/session"
import { getUserById } from '../../../../models/users/users';
import {getAllPrivileges} from "../../../../models/privileges/privileges";
import { Avatar, Box, Button, Checkbox, Container, FormControl, Grid, ListItemIcon, ListItemText, MenuItem, Select, Typography } from '@mui/material'; 
import axios from 'axios'; 
import {useRouter} from "next/router";
import { decode } from 'jsonwebtoken';
import { CheckPermission, PERMISSIONS } from '../../../../middlewares/hasPermission';
import Notifier,{NOTIFICATION_TYPE} from "../../../../components/Notification"
const Edit = ({userInfo,privileges}) => {
 
  

    const [user] = useState(JSON.parse(userInfo));
    const [roles] = useState(JSON.parse(privileges));
    const router = useRouter();
    const [selectedGrants, setSelectedGrants] = useState([]);
    const [selectedRevoke, setSelectedRevoke] = useState([]);
    const [alert,setAlert] = React.useState({message : null , type : null});
    function closeAlert(){
        setAlert({message : null , type : null})
    }
    const isAllSelected =
    selectedGrants.length > 0 && selectedGrants.length === selectedGrants.length;
    const handleChange = (event) => {
       const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelectedGrants(selectedGrants.length === selectedGrants.length ? [] : selectedGrants);
            return;
        }
        setSelectedGrants(value);
    };

    const handleRevokeChanges = (event) => {
        const value = event.target.value;
         if (value[value.length - 1] === "all") {
            setSelectedRevoke(selectedRevoke.length === selectedRevoke.length ? [] : selectedRevoke);
             return;
         }
         setSelectedRevoke(value);
     };

    function GrantPrivelegesToUser(){
       
        axios.patch(`/api/priveleges/${user._id}/grant`,{
            roles : selectedGrants
        })
        .then(()=>{ 
            router.back();
            setAlert({type : NOTIFICATION_TYPE.SUCCESS,message : "roles granted successfuly"})
        })      
        .catch((err)=>{ 
            alert(JSON.stringify(err))
            setAlert({type : NOTIFICATION_TYPE.ERROR,message : `somthing wen't wrong! ${err}`})
        })
    }

    function RevokePrivelegesFromUser(){
        axios.patch(`/api/priveleges/${user._id}/revoke`,{
            roles : selectedRevoke
        })
        .then(()=>{ 
            router.back();
            setAlert({type : NOTIFICATION_TYPE.SUCCESS,message : "roles granted successfuly"})
        })
        .catch((err)=>{ 
            if(axios.isAxiosError(err)){ 
                setAlert({type : NOTIFICATION_TYPE.ERROR,message : err.response.data.message})
            }
        })
    }
 


   

    return (
        <AdminLayout>
            <Container> 
            <Notifier open={Boolean(alert?.message)} message={alert?.message} type={alert.type} onClose={closeAlert} duration={2000}/>
                <Grid container alignItems="center">
                    <Grid item>
                        <Avatar src={user?.imageUrl && `images/${user?.imageUrl}`} sx={{width : 200,height:200}}></Avatar>
                    </Grid>
                    <Grid item sx={{mx : 2}}>
                        <Typography variant="h4">{user?.firstName}</Typography>
                        <Typography variant="h5">{user?.lastName}</Typography>
                    </Grid>
                </Grid>
                <Typography type="h4">Email : {user?.email}</Typography>
                <Grid container sx={{mt : 2}} columnSpacing={2}>
                    <Grid item md={6}> 
                        <FormControl fullWidth size="small">
                        <Typography sx={{my : 1}}>Grant Privilages To {user?.firstName}</Typography> 
                        <Select 
                            multiple  
                            value={selectedGrants}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(", ")}
                            
                        >
                            <MenuItem
                                value="all" 
                            >
                            <ListItemIcon>
                                <Checkbox 
                                    checked={isAllSelected}
                                    indeterminate={
                                        selectedGrants.length > 0 && selectedGrants.length < selectedGrants.length
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Select All"
                            /> 
                            </MenuItem>

                            {roles.map(({name},index) => {
                                if(user?.roles?.includes(name)) return null
                                return (
                                <MenuItem key={index} value={name || ""}>
                                    <ListItemIcon>
                                    <Checkbox checked={selectedGrants.indexOf(name) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={name} />
                                </MenuItem>
                                )
                            })}

                        </Select>
                        </FormControl>
                        <Box sx={{my : 2}}>
                            <Button variant="contained" onClick={GrantPrivelegesToUser}>Grant User</Button>
                        </Box> 
                    </Grid>
                    <Grid item md={6}> 
                        <FormControl fullWidth size="small">
                        <Typography sx={{my : 1}}>Revoke Privilages From {user?.firstName}</Typography> 
                        <Select 
                            multiple 
                            fullWidth
                            value={selectedRevoke}
                            onChange={handleRevokeChanges}
                            renderValue={(selected) => selected.join(", ")}
                            
                        >
                            <MenuItem
                                value="all" 
                            >
                            <ListItemIcon>
                                <Checkbox 
                                    checked={isAllSelected}
                                    indeterminate={
                                        selectedRevoke.length > 0 && selectedRevoke.length < selectedRevoke.length
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Select All"
                            /> 
                            </MenuItem>

                            {user?.roles?.map((name,index) => (
                                <MenuItem key={index} value={name || ""}>
                                    <ListItemIcon>
                                    <Checkbox checked={selectedRevoke.indexOf(name) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={name} />
                                </MenuItem>
                                )
                            )}

                        </Select>
                        </FormControl>
                        <Box sx={{my : 2}}>
                            <Button variant="contained" color="error" onClick={RevokePrivelegesFromUser}>Revoke</Button>
                        </Box> 
                    </Grid>
                
                    
                </Grid>
            </Container>
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    await connect()
    const {id} = context.params;

    const session = await getSession(context)
     
    const decodedToken = decode(session.token)
  
    if(!(decodedToken.isAdmin || CheckPermission(decodedToken?.roles,[PERMISSIONS.GRANT_ROLES,PERMISSIONS.REVOKE_ROLES]))) {
        return {
            notFound: true,
        }
    } 



    if(session.type === "ERROR"){
        return {
            redirect : {
                destination : "/signin"
            }
        }
    }
     
    const user = await getUserById(id)
  
    const privileges = await getAllPrivileges();

    return {
      props: {
        session : session.token,
        userInfo : JSON.stringify(user),
        privileges : JSON.stringify(privileges)
      }, 
    }
}
 

export default Edit;
