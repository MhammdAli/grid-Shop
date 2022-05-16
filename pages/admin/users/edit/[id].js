import React, { useState } from 'react';
import AdminLayout from '../../../../components/adminLayout';
import { connect } from '../../../../config/dbConn';
import {getSession} from "../../../../auth/session"
import { getUserById } from '../../../../models/users/users';
import {getAllPrivileges} from "../../../../models/privileges/privileges";
import { Avatar, Box, Button, Checkbox, Container, FormControl, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, Select, Snackbar, Typography } from '@mui/material'; 
import axios from 'axios';
import { Close } from '@mui/icons-material';

const Edit = ({userInfo,privileges}) => {
 
  

    const [user] = useState(JSON.parse(userInfo))
    const [roles] = useState(JSON.parse(privileges))
    const [selected, setSelected] = useState(user?.roles || []);
    const [SnackMessage , setSnackMessage] = useState({isError : false , message : null}) 
    const isAllSelected =
    selected.length > 0 && selected.length === selected.length;
    const handleChange = (event) => {
       const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelected(selected.length === selected.length ? [] : selected);
            return;
        }
        setSelected(value);
    };

    function addPrivelegesToUser(){
        axios.patch(`/api/users/Privilages/${user._id}`,{
            roles : selected
        })
        .then(()=>{
            setSnackMessage({isError : false,message : "change is success"})
        })
        .catch(()=>{
            setSnackMessage({isError : true,message : "somthing wen't wrong!"})
        })
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackMessage({isError : false , message : null});
    };


    const action = (
        <React.Fragment> 
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackBarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return (
        <AdminLayout>
            <Container> 
            <Snackbar open={Boolean(SnackMessage.message)}  sx={{
                    "& .MuiPaper-root" : {
                        backgroundColor : SnackMessage.isError ? "error.main" : "success.main"
                    }
                }} autoHideDuration={100000} onClose={handleSnackBarClose} action={action} message={SnackMessage.message} anchorOrigin={{vertical: 'top',horizontal: 'center'}} />
                    
                <Grid container alignItems="center">
                    <Grid item>
                        <Avatar src={user?.imageUrl && `images/${user?.imageUrl}`} sx={{width : 200,height:200}}></Avatar>
                    </Grid>
                    <Grid item sx={{mx : 2}}>
                        <Typography variant="h4">{user?.firstName}</Typography>
                        <Typography variant="h5">{user?.lastName}</Typography>
                    </Grid>
                </Grid>
                <Box sx={{mt : 2}}>
                <Typography type="h4">Email : {user?.email}</Typography>
                <FormControl fullWidth size="small">
                    <Typography sx={{my : 1}}>User Privilages</Typography> 
                    <Select 
                        multiple 
                        value={selected}
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
                                    selected.length > 0 && selected.length < selected.length
                                }
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary="Select All"
                        /> 
                        </MenuItem>

                        {roles.map(({name},index) => (
                            <MenuItem key={index} value={name || ""}>
                                <ListItemIcon>
                                <Checkbox checked={selected.indexOf(name) > -1} />
                                </ListItemIcon>
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}

                    </Select>
                    </FormControl>
                    <Box sx={{my : 2}}>
                      <Button variant="contained" onClick={addPrivelegesToUser}>Save Changes</Button>
                    </Box>
                    
                </Box>
            </Container>
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    await connect()
    const {id} = context.params;

    const session = await getSession(context)
    
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
