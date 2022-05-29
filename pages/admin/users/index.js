import { Button } from '@mui/material';
import React from 'react';
import AdminLayout from '../../../components/adminLayout';
import DataGrid from '../../../components/DataGrid';
import Sectionsplitter from '../../../components/sectionSplitter';
import axios from "axios";
import { connect } from '../../../config/dbConn';
import { getSession} from '../../../auth/session';
import { getUsers } from '../../../models/users/users';
import { useRouter } from 'next/router';
import EmailDialog from '../../../components/EmailDialog';
import { decode } from 'jsonwebtoken';
import {CheckPermission,PERMISSIONS} from "../../../middlewares/hasPermission";
import {useAuth} from "../../../auth/AuthContext";
import Notifier,{NOTIFICATION_TYPE} from "../../../components/Notification";
const Users = ({rowsProps}) => {

    const router = useRouter();
    const [alert,setAlert] = React.useState({message : null , type : null});
    function closeAlert(){
        setAlert({message : null , type : null})
    }

    const {session} = useAuth();
    const columns = {
        ID : {
            type : "number",
            virtualColumn : (currentRow)=>currentRow._id.substring(0,5),  
        },
        firstName : { 
            type : "text",
            searchable : true,
            header : "First Name"
        },
        lastName :{
            type : "text",
            searchable : true,
            header : "last Name"
        },
        email : {
            type : "text",
            searchable : true,
            header : "Email"
        },
        createdAt:{
            virtualColumn : (currentRow)=>{
                if(!currentRow.createdAt) return "";
                const date = new Date(currentRow.createdAt);
                const month = date.getMonth();
                const day = date.getDay();
                const year = date.getFullYear();
                var hours = date.getHours();
                const min = date.getMinutes();
                const sec = date.getSeconds();  
                return day + "/" + month + "/" + year + ":" + hours % 12 + ":" + min + ":" + sec + ` ${hours<=12 ? "AM" : "PM"}`;
            },
            type : "date",
            searchable : true,
            header : "Created At"
        }
        
   }


   const fetchUsers = async (page,pageSize,queryString) => {  
          
        try{
          const {data} = await axios.get(`/api/users?page=${page}&pageSize=${pageSize}` + ((queryString) ? "&"+queryString : ""));
          return data;
        }catch(err){
           setAlert({message : err.message,type : NOTIFICATION_TYPE.ERROR})
        }
        
  };

  const [OpenEmailDialog , setOpenEmailDialog] = React.useState({
      open : false,
      id : null
  });
 

  
    return (
        <AdminLayout Title="Users">
            <Notifier open={Boolean(alert?.message)} message={alert?.message} type={alert.type} onClose={closeAlert} duration={2000}/>
           <Sectionsplitter title="Users" sx={{mb : 3}}/>
                <DataGrid
                    rows={JSON.parse(rowsProps)}
                    columns={columns} 
                    rowsPerPageOptions={[5,10,20]}
                    onPageNext={async function(pageNb,rowsPerPage){ 
                       const data = await fetchUsers(pageNb,rowsPerPage) 
                     
                        return data || []
                    }}
                    onSearch = {async(payload,rowsPerPage)=>{
                            const {
                                field,
                                value,
                                operator
                            } = payload;

                           const queryString = (`${field}=${value}` + ( operator ? `&pattern=${field}:${operator}` : ''))
                            
                            try{
                              const data = await fetchUsers(0,rowsPerPage,queryString) 
                           
                              return data || []
                            }catch(err){
                                return []
                            }
                            
                        
                    }} 

                    ActionLeft={
                        <Button variant="contained" sx={{mx:2}} size='small' onClick={(row)=>{ 
                           if(!(CheckPermission(session?.roles,PERMISSIONS.SEND_EMAIL_USER) || session?.isAdmin)) return setAlert({type :  NOTIFICATION_TYPE.ERROR , message : "no permession to send email"})
                           setOpenEmailDialog({
                               open : true,
                               id : row
                           })
                        }}>Send Email</Button>
                    }
                    ActionRight={
                        <Button variant="contained" color="success" sx={{mx:2}} size='small' onClick={(row)=>{
                            if(CheckPermission(session?.roles,[PERMISSIONS.GRANT_ROLES,PERMISSIONS.REVOKE_ROLES]) || session?.isAdmin){
                                return router.push(`/admin/users/edit/${row._id}`)
                            }

                            setAlert({"message" : "No Permission to Access This page" , "type" : NOTIFICATION_TYPE.ERROR})
                        }}>Edit</Button>
                    }
                    
                    >
                        
                    
                </DataGrid>
                <EmailDialog open={OpenEmailDialog.open} row={OpenEmailDialog.id} handleClose={()=>{
                     setOpenEmailDialog({
                        open : false,
                        id : null
                    })
                }}/>
                  
        </AdminLayout>
    );
};

 
export async function getServerSideProps(context) {
    await connect()
    const session = await getSession(context) 
    
    const decodedToken = decode(session.token)
  
    if(!(decodedToken.isAdmin || CheckPermission(decodedToken?.roles,PERMISSIONS.READ_USER))) {
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
    
    const result = await getUsers({},0 , 5)
 
    return {
      props: {
        session : session.token,
        rowsProps: result && JSON.stringify(result)
      }, 
    }
}


export default Users;
