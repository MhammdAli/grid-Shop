import React,{useState} from 'react';
import { connect } from '../../config/dbConn';
import { getSession } from '../../auth/session';
import {decode} from "jsonwebtoken"
import {  Alert, Button, Collapse, Container,IconButton,List, ListItem, TextField, Typography , CircularProgress } from '@mui/material'; 
import AdminLayout from '../../components/adminLayout';
import Sectionsplitter from '../../components/sectionSplitter';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import { CheckPermission, PERMISSIONS } from '../../middlewares/hasPermission';

const Index = () => {

    
    const [error , setError] = useState({})
  
    const [open, setOpen] = useState(false);
    const [loading , setLoading] = useState(false);
    function addBrand(event){
        event.preventDefault();

        const {
            name : {value : name},
        } = event.target

        setLoading(true)  
        axios.post("/api/brands",{
            name
        }).then(()=>{ 
            setError({})
            setOpen(true)
            setLoading(false)
        })
        .catch(({response : {data : err}})=>{
            setOpen(false)
            setError(err.errors)
            setLoading(false)
        })

        

    }

    return (
        <AdminLayout Title="Add Brand">
            <Container  maxWidth="sm">
                <Box sx={{ml:2}}>
                    <Sectionsplitter title="Add brand" variant='h6' sx={{mb : 2}}/>
                    <Collapse in={open}>
                        <Alert
                        action={
                            <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        >
                         Brand Added Succesfuly 
                        </Alert>
                    </Collapse>
                </Box>
                <form onSubmit={addBrand}>
                    
                    <List>
                        <ListItem>
                            <Typography>Brand Name</Typography>
                        </ListItem>
                        <ListItem>
                            <TextField name="name" error={Boolean(error?.name)} helperText={error?.name ? error.name.message : ""} fullWidth variant='outlined' size='small' placeholder=' brand Name'/>
                        </ListItem>
                        
                        <ListItem>
                            <Button startIcon={loading & <CircularProgress size={20}/>} disbaled={loading} variant="contained" type="submit">Add Brand</Button>
                        </ListItem>
                    </List>
                
                </form>
            </Container>
        </AdminLayout>
    );
}


export async function getServerSideProps(context) {
    await connect()
    const session = await getSession(context) 
    
    const decodedToken = decode(session.token)
  
    if(!(decodedToken.isAdmin || CheckPermission(decodedToken?.roles,PERMISSIONS.WRITE_BRAND))) {
        return {
            notFound: true,
        }
    } 

    if(session.type === "FAIL"){
        return {
            redirect : {
                destination : "/"
            }
        }
    }
    
 
    return {
      props: {session : session.token}, 
    }
}
export default Index;
