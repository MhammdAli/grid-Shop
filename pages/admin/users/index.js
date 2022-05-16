import { Button } from '@mui/material';
import React from 'react';
import AdminLayout from '../../../components/adminLayout';
import DataGrid from '../../../components/DataGrid';
import Sectionsplitter from '../../../components/sectionSplitter';
import axios from "axios";
import { connect } from '../../../config/dbConn';
import { getSession } from '../../../auth/session';
import { getUsers } from '../../../models/users/users';
import { useRouter } from 'next/router';
import EmailDialog from '../../../components/EmailDialog';
const Users = ({rowsProps}) => {

    const router = useRouter();

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
             
        const {data} = await axios.get(`/api/users?page=${page}&pageSize=${pageSize}` + ((queryString) ? "&"+queryString : ""));
    
        return data;
  };

  const [OpenEmailDialog , setOpenEmailDialog] = React.useState({
      open : false,
      id : null
  });
 
    return (
        <AdminLayout Title="Users">
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
                           // router.push(`/admin/users/view/${row._id}`)
                           setOpenEmailDialog({
                               open : true,
                               id : row
                           })
                        }}>Send Email</Button>
                    }
                    ActionRight={
                        <Button variant="contained" color="success" sx={{mx:2}} size='small' onClick={(row)=>{
                            router.push(`/admin/users/edit/${row._id}`)
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
