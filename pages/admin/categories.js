import React from 'react';
import { connect } from '../../config/dbConn';
import { getSession } from '../../auth/session';
import {decode} from "jsonwebtoken"
import {  Alert, Button, Collapse, Container,IconButton,List, ListItem, TextField, Typography } from '@mui/material'; 
import AdminLayout from '../../components/adminLayout';
import Sectionsplitter from '../../components/sectionSplitter';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';

const Index = () => {

    
    const [error , setError] = React.useState({})
  
    const [open, setOpen] = React.useState(false);

    function addCategory(event){
        event.preventDefault();

        const {
            mainCategory : {value : mainCategory},
            subCategory : {value : subCategory}
        } = event.target

      
            axios.post("/api/categories",{
                mainCategory,
                subCategory
            }).then(()=>{ 
                setError({})
                setOpen(true)
            })
            .catch(({response : {data : err}})=>{
                setOpen(false)
                setError(err.errors)
            })

         

    }

    return (
        <AdminLayout Title="Add category">
            <Container  maxWidth="sm">
                <Box sx={{ml:2}}>
                    <Sectionsplitter title="Add Category" variant='h6' sx={{mb : 2}}/>
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
                         category Added Succesfuly 
                        </Alert>
                    </Collapse>
                </Box>
                <form onSubmit={addCategory}>
                    
                    <List>
                        <ListItem>
                            <Typography>Main category Name</Typography>
                        </ListItem>
                        <ListItem>
                            <TextField name="mainCategory" error={Boolean(error?.mainCategory)} helperText={error?.mainCategory ? error.mainCategory.message : ""} fullWidth variant='outlined' size='small' placeholder='main Category'/>
                        </ListItem>
                        <ListItem>
                            <Typography>Sub category Name</Typography>
                        </ListItem>
                        <ListItem>
                            <TextField name="subCategory" error={Boolean(error?.subCategory)} helperText={error?.subCategory ? error.subCategory.message : ""} fullWidth variant='outlined' size='small' placeholder='Sub Category'/>
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" type="submit">Add Category</Button>
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
    
    if(decodedToken.isAdmin == false) {
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
