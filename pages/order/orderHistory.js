import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { getSession } from '../../auth/session';
import DataGrid from '../../components/DataGrid';
import { connect } from '../../config/dbConn';
import {getOrders} from "../../models/order/order";
import {useRouter} from "next/router";

const Orderhistory = ({rowsProps}) => {

    
    const router = useRouter()
    const columns = {
        ID : {
            type : "number",
            virtualColumn : (currentRow)=>currentRow._id.substring(0,5),  
        },
        createdAt:{
            virtualColumn : (currentRow)=>{
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
            header : "DATE"
        },
        isDelivered:{
            virtualColumn : (currentRow)=>currentRow.isDelivered ? "Delivered" : "not Delivered" ,
            searchable : true,
            header : "DELIVERED",
            type : "select",
            options : [
                {name : "Delivered" , value : true},
                {name : "not Delivered" , value : false}
            ],
        },
        isPaid:{
            virtualColumn : (currentRow)=>currentRow.isPaid ? "Paid" : "not Paid" ,
            type : "select",
            header : "PAID",
            options : [
                {name : "paid" , value : true},
                {name : "not Paid" , value : false}
            ],
            searchable : true,
 
        },
        itemsPrice :{
            header : "TOTAL PRICE",
            type : "number",
            searchable : true
        },
        "ITEMS NUMBER":{
            virtualColumn : (currentRow)=>currentRow.items.length ,
            type : "number"
        }
   }

   const fetchOrders = async (page,pageSize,queryString) => {  
             
    const {data} = await axios.get(`/api/orders/?page=${page}&pageSize=${pageSize}` + ((queryString) ? "&"+queryString : ""));
    
    return data.result;
  };

  

    return (
        <Container>
            <Typography variant="h1">Order History</Typography>
            <DataGrid
               rows={JSON.parse(rowsProps)}
               columns={columns} 
               rowsPerPageOptions={[5,10,20]}
               onPageNext={async function(pageNb,rowsPerPage){ 
                   const data = await fetchOrders(pageNb,rowsPerPage) 
                   
                   return data
               }}
               onSearch = {async(payload,rowsPerPage)=>{
                    const {
                        field,
                        value,
                        operator
                    } = payload


                    console.log({field,
                        value,
                        operator})

                   
                    const queryString = (`${field}=${value}` + ( operator ? `&pattern=${field}:${operator}` : ''))
                     
                    try{
                      const data = await fetchOrders(0,rowsPerPage,queryString) 
                      return data || []
                    }catch(err){
                        return []
                    }
                    
                   
               }} 

               ActionLeft={
                  <Button variant="contained" sx={{mx:2}} size='small' onClick={(row)=>{
                    router.push(`/order/${row._id}`)
                   }}>View</Button>
               }
               
            >
                
                
            </DataGrid>
        </Container>
    );
}
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
    
    const result = await getOrders({},0 , 5)
 
    return {
      props: {
        session : session.token,
        rowsProps: result && JSON.stringify(result)
      }, 
    }
}

export default Orderhistory;
