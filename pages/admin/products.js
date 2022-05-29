import { Button } from '@mui/material';
import axios from 'axios';
import { decode } from 'jsonwebtoken';
import { useRouter } from 'next/router';
import React from 'react';
import { getSession } from '../../auth/session';
import AdminLayout from '../../components/adminLayout';
import DataGrid from '../../components/DataGrid';
import Sectionsplitter from '../../components/sectionSplitter';
import { connect } from '../../config/dbConn';
import { CheckPermission, PERMISSIONS } from '../../middlewares/hasPermission';
import { getAllProducts } from '../../models/products/products';
const Products = ({rowsProps}) => {

    const router = useRouter();

    const columns = {
        ID : {
            type : "number",
            virtualColumn : (currentRow)=>currentRow._id.substring(0,5),  
        },
        name : { 
            type : "text",
            searchable : true,
            header : "Product Name"
        },
        price : { 
            type : "number",
            searchable : true,
            header : "Product price"
        },
        "mainCategory" : {
            type : "text",
            searchable : true,
            header : "main Category",
            virtualColumn : (currentRow)=>currentRow?.category?.main || ""
        },
        "subCategory" : {
            type : "text",
            searchable : true,
            header : "sub Category",
            virtualColumn : (currentRow)=>currentRow?.category?.sub || ""
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


   const fetchProducts = async (page,pageSize,queryString) => {  
             
    const {data} = await axios.get(`/api/products?page=${page}&pageSize=${pageSize}` + ((queryString) ? "&"+queryString : ""));
    
    return data?.result;
  };


    return (
        <AdminLayout Title="Products">
           <Sectionsplitter title="Products" sx={{mb : 3}}/>
                <DataGrid
                    rows={JSON.parse(rowsProps)}
                    columns={columns} 
                    rowsPerPageOptions={[5,10,20]}
                    onPageNext={async function(pageNb,rowsPerPage){ 
                       const data = await fetchProducts(pageNb,rowsPerPage) 
                     
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
                              const data = await fetchProducts(0,rowsPerPage,queryString) 
                           
                              return data || []
                            }catch(err){
                                return []
                            }
                            
                        
                    }} 

                    ActionLeft={
                        <Button variant="contained" sx={{mx:2}} size='small' onClick={(row)=>{
                            router.push(`/products/${row.slugName}`)
                        }}>View</Button>
                    }
                    ActionRight={
                        <Button variant="contained" color="success" sx={{mx:2}} size='small' onClick={(row)=>{
                            router.push(`/admin/products/edit/${row._id}`)
                        }}>Edit</Button>
                    }
                    
                    />
                        
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    await connect()
    const session = await getSession(context) 
    
    const decodedToken = decode(session.token)
  
    if(!(decodedToken.isAdmin || CheckPermission(decodedToken?.roles,PERMISSIONS.READ_PRODUCTS))) {
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
    
    const result = await getAllProducts({},0 , 5)
 
    return {
      props: {
        session : session.token,
        rowsProps: result && JSON.stringify(result)
      }, 
    }
}

export default Products;
