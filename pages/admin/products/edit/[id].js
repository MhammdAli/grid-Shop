/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Container,CircularProgress, Grid, TextField, Typography , Box , Avatar, FormHelperText} from '@mui/material';
import axios from 'axios';
import React,{useCallback, useState} from 'react';
import AdminLayout from '../../../../components/adminLayout';
import SectionSplitter from "../../../../components/sectionSplitter";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { green, red } from '@mui/material/colors';
import { connect } from '../../../../config/dbConn';
import { getSession } from '../../../../auth/session';
import { decode } from 'jsonwebtoken';
import { CheckPermission, PERMISSIONS } from '../../../../middlewares/hasPermission';
import Notifier,{NOTIFICATION_TYPE} from "../../../../components/Notification"
import { getProductById } from '../../../../models/products/products';
const EditProducts = ({productProps}) => {
 

    const [product , setProduct] = useState(JSON.parse(productProps))
    const [errors,setErrors] = React.useState({}); 
    const [alert,setAlert] = React.useState({message : null , type : null});
    const [loading,setLoading] = React.useState(false);

    const [productImage , setProductImage] = useState();
    function EditProduct(event){
        event.preventDefault();

        setLoading(true) 
       
        const formData = new FormData()
        formData.append("name" , product?.name)
        formData.append("slugName" , product?.slugName)
        formData.append("description",product?.description)
        formData.append("discount",product?.discount) 
        formData.append("price",product?.price);
        formData.append("brand",product?.brand) 
        formData.append("ItemDetails",JSON.stringify(product?.ItemDetails))
        if(productImage) formData.append("avatar",productImage)
 
        axios.patch(`/api/products/id/${product?._id}`,formData)
        .then(()=>{ 
            setAlert({message : "Product Updated successfuly",type : NOTIFICATION_TYPE.SUCCESS})
            setLoading(false);
        })
        .catch((err)=>{ 
            const data = err.response.data 
            setLoading(false) 
            if(data.name === "FILE_NOT_ACCEPTED") return setErrors({image : data.message})
            setErrors(Object.keys(data).reduce((agg,field)=>{
                agg[field] = data[field]?.message
                return agg;
            },{}))

            
        })

    }

    function closeAlert(){
        setAlert({message : null , type : null})
    } 
 
    const changeInputDetails = useCallback((index,event)=>{ 
        const values = [...product.ItemDetails];
        values[index] = event.target.value 
        setProduct({
            ...product,
            ItemDetails : values
        })
    },[product?.ItemDetails,product])
    const changeProductNameHandler = useCallback(({target})=>{ 
        setProduct({
            ...product,
            name : target.value
        })
    },[product?.name,product])
    const changeSlugNameHandler = useCallback(({target})=>{ 
        setProduct({
            ...product,
            slugName : target.value
        })
    },[product?.slugName,product])
    const changeDescriptionHandler = useCallback(({target})=>{
        setProduct({
            ...product,
            description : target.value
        })
    },[product?.description,product])
    const changeDiscountHandler = useCallback(({target})=>{ 
        setProduct({
            ...product,
            discount : target.value
        })
    },[product?.discount,product])
    const changePriceHandler = useCallback(({target})=>{ 
        setProduct({
            ...product,
            price : target.value
        })
    },[product?.price,product])
    const chooseImageHandler = useCallback(({target})=>{ 
        setProductImage(target.files[0])
    },[productImage])

 
    function addMoreDetails(){
         
        if(product?.ItemDetails?.length < 6)
            setProduct({
                ...product,
                ItemDetails : [
                    ...product.ItemDetails,
                    ''
                ]
            })
        else 
        setAlert({message : 'you cant add more than 6 fields',type : NOTIFICATION_TYPE.ERROR})
    }

    function deleteDetails(index){  
        
        if(product?.ItemDetails?.length > 1) {
               const values = [...product.ItemDetails]
               values.splice(index,1)
               setProduct({
                   ...product,
                   ItemDetails : values
               })
        } 
        else 
          setAlert({message : 'You must keep at least 1 field',type : NOTIFICATION_TYPE.ERROR})
    }
    
   
    return (
        <AdminLayout Title="Edit Product">
            <Notifier open={!!(alert?.message)} message={alert?.message} type={alert.type} onClose={closeAlert} duration={2000}/>
            <Container>
                <SectionSplitter title="Edit Products" sx={{mb : 3}}/>
                <form onSubmit={EditProduct} >
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>Product Name</Typography>
                           <TextField onChange={changeProductNameHandler} value={product?.name} name="productName" error={!!errors?.name} helperText={errors?.name || ""} variant="outlined" size='small' placeholder='product Name' fullWidth/>
                        </Grid>
                        <Grid item md={6}  xs={12}>
                           <Typography sx={{mb : 1}}>Slug Name</Typography>
                           <TextField onChange={changeSlugNameHandler} value={product?.slugName} name="slugName" error={!!errors?.slugName} helperText={errors?.slugName || ""} variant="outlined" size='small' placeholder='Slug Name' fullWidth/> 
                        </Grid>
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>Description</Typography>
                           <TextField onChange={changeDescriptionHandler} value={product?.description} name="description" error={!!errors?.description} helperText={errors?.description || ""} variant="outlined" size="small" multiline rows={4} placeholder='Description' fullWidth/>
                        </Grid> 
                        <Grid item md={6} xs={12}> </Grid>

                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>price</Typography>
                           <TextField onChange={changePriceHandler} value={product?.price} name="price" error={!!errors?.price} helperText={errors?.price || ""} variant="outlined" type="number" size="small"  placeholder='price' fullWidth/>
                        </Grid> 
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>discount</Typography>
                           <TextField onChange={changeDiscountHandler} value={product?.discount} name="discount" error={!!errors?.discount} helperText={errors?.discount || ""} variant="outlined" type="number" size="small"  placeholder='discount' fullWidth/>
                        </Grid> 
  

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb:1}}>Product Image</Typography> 
                            <TextField 
                                type="file"
                                variant="outlined" margin="normal" fullWidth size="small" 
                                name="productImage" 
                                onChange={chooseImageHandler} 
                                sx={{m:0}}
                                error={!!errors?.image} helperText={errors?.image || ''}
                            /> 
                        </Grid>

                    <Grid item xs={12}>
                        <FormHelperText error={!!errors?.ItemDetails}>{errors?.ItemDetails || ''}</FormHelperText>
                        <Typography sx={{mb:1}}>Product Details</Typography>
                            
                            {product?.ItemDetails?.map((value,index)=>{
                                return ( 
                                    <Box sx={{display : "flex",mb:1,alignItems : "center"}} key={index}>
                             
                                        <TextField onChange={(event)=>changeInputDetails(index,event)} multiline maxRows={3} variant="outlined" margin="normal" value={value} fullWidth size="small" sx={{m:0}}/> 
                                        {product?.ItemDetails?.length -1 === index &&
                                          <Avatar sx={{ bgcolor: green[900] , cursor : "pointer",mx : .5,width : 26,height : 26}} variant="circular" onClick={addMoreDetails}>
                                            <AddIcon />
                                          </Avatar>
                                        }
                                        
                                         <Avatar sx={{ bgcolor: red[900] , cursor : "pointer",mx : .5,width : 26,height : 26}} variant="circular" onClick={()=>{
                                             deleteDetails(index)
                                         }}>
                                         <DeleteIcon />
                                       </Avatar>

                                    </Box>
                                        
                                    )
                                })

                            }
                                 
                        </Grid> 
                        <Grid item >
                            <Button startIcon={loading && <CircularProgress size={20}/>} disabled={loading} variant='contained' fullWidth type="submit">Edit Product</Button>
                        </Grid> 
                    </Grid>
                </form>
            </Container>
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    await connect()
    const session = await getSession(context) 
    const {id} = context.query;
    const decodedToken = decode(session.token)
  
    if(!(decodedToken.isAdmin || CheckPermission(decodedToken?.roles,PERMISSIONS.EDIT_PRODUCTS))) {
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
    
    var Products = await getProductById(id); 
    return {
      props: {
        session : session.token,
        productProps : JSON.stringify(Products || {})  
      }, 
     
    }
}

export default EditProducts;
