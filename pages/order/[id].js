import React,{ useState , useEffect} from 'react';
import Sectionsplitter from '../../components/sectionSplitter';
import { Container, Grid, Stack,Table, TableBody, TableCell, TableContainer, TableHead, TableRow , ListItem , List ,Paper , Typography , TablePagination, LinearProgress, Button ,CircularProgress} from '@mui/material';
 
import Image from "next/image";
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';  
import {formatToCurrency} from "../../utilities/calculations"
 
import { useAuth } from '../../auth/AuthContext';
import {useRouter} from "next/router";
import axios from "axios"  
import { createOrder } from '../../lib/paypalSdk';
import Layout from '../../components/Layout';
const Order = ({id}) => {
      
    const [page , setPage]= useState(0)
    const [rowsPerPage , setRowsPerPage] = useState(5)
    const {status} = useAuth()
    const router = useRouter() 
    function reducer(state , action){
        switch(action.type){
            case "FETCH_REQUEST" : 
                return {
                   ...state,
                   loading : true
                }
            case "FETCH_SUCCESS" : 
                return {
                    ...state,
                    loading : false,
                    order : action.payload
                }
            case "ORDER_NOT_EXISTS" : 
                return {
                    ...state,
                    loading : false,
                    orderNotExists : true
                }
            
            case "FETCH_FAIL" : 
                return {
                    ...state,
                    loading : false,
                    error : action.payload
                }
            
            default : return {...state}

        }
    }

    const [{loading , error , order , orderNotExists},dispatch] = React.useReducer(reducer , {loading : true , order : {} , error : null , orderNotExists : false})

    const [loadingPaypal , setLoadingPaypal] = React.useState(false)
    
    useEffect(()=>{

        if(status === "UNUTHENTICATED"){
            router.replace("/signin")
            return;
        }
        

        const controller = new AbortController();
        async function fetchOrder(){
            
             try{
                 dispatch({type : "FETCH_REQUEST"});
               
                 const {data} = await axios.get(`/api/orders/${id}`,{signal : controller.signal});
                 
                 if(!data.order) { 
                     return  dispatch({type : "ORDER_NOT_EXISTS" , payload : true})
                 }
                 
                 dispatch({type : "FETCH_SUCCESS" , payload : data.order})

             }catch(err){
                 dispatch({type : "FETCH_FAIL" , payload : err.name})
             }
        }

        fetchOrder()

         return ()=>{
            controller.abort()
         }

    },[]) 
 

    if(loading) return  <LinearProgress/> 
    
    if(orderNotExists){
        return (
            <Typography>order Not Exists</Typography>
        )
    }
 
    return (
        <Layout>
            <Container> 
            {error && error}
            <Grid container spacing={2} >
                <Grid item md={8} xs={12}>
                    <Paper>
                        <List>
                            <ListItem>
                                <Sectionsplitter title="Shipping Address" width={100} variant="h2" sx={{my : 2}}/>
                            </ListItem>
                            <ListItem>
                                <List>
                                    <ListItem>
                                        <Typography>
                                            {order.shippingAddress?.postCode} , {order.shippingAddress?.street},
                                            {order.shippingAddress?.city} , {order.shippingAddress?.country}
                                        </Typography> 
                                    </ListItem> 
                                    <ListItem>
                                        <Typography>
                                            <b>Status : </b> {order.shippingAddress?.isDelivered ? "Delivered " + + (order?.deliveredAt && " at " + order.deliveredAt) : "Not Delivered"}
                                        </Typography> 
                                    </ListItem> 
                                </List>
                            </ListItem>

                        </List>
                    </Paper>
                    <Paper sx={{my : 2}}>
                        <List>
                            <ListItem>
                                <Sectionsplitter title="Payment Method" width={100} variant="h2" sx={{my : 2}}/> 
                            </ListItem>
                            <ListItem>
                                <Typography><b>Your Payment is : </b> {order?.paymentMethod}</Typography> 
                            </ListItem>
                            <ListItem>
                                <Typography><b>Payment Status : </b> {order?.isPaid ? "Paid" + (order?.paidAt && " at " + order.paidAt) : "NOT PAID"}</Typography> 
                            </ListItem>

                        </List>
                    </Paper>
                    <Paper sx={{my : 2}}>
                        <List>
                            <ListItem>
                                <Sectionsplitter title="Order Items" width={100} variant="h2" sx={{my : 2}}/> 
                            </ListItem>
                            <ListItem> 
                                <TableContainer sx={{flexGrow : 1}}>
                                    <Table size='small' >
                                        <TableHead>
                                            <TableRow >
                                                <TableCell >Image</TableCell>
                                                <TableCell >Name</TableCell>
                                                <TableCell align='right'>Quantity</TableCell>
                                                <TableCell align='right'>Price</TableCell> 
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {order?.items.slice(page * rowsPerPage,(page + 1) * rowsPerPage).map((product,index)=>{
                                                
                                                return (
                                                    <TableRow hover  key={index} >
                                                        <TableCell>
                                                            <Image width={50} height={50} src={product._id?.image} alt={product._id?.name}/>
                                                        </TableCell>
                                                        <TableCell>{product._id?.name}</TableCell>
                                                        <TableCell align='right'>{product?.quantity}</TableCell> 
                                                        <TableCell align='right'>{product?.price}</TableCell> 
                                                    </TableRow>
                                                )
                                            }) 
                                            }
                                        </TableBody>
                                        </Table> 
                                        {order?.items?.length > 0 ?
                                            <TablePagination
                                                component="div"
                                                count={order?.order?.length || 0}
                                                page={page} 
                                                onPageChange={(event , pageNb)=>{
                                                    setPage(pageNb)
                                                }}
                                                size="small" 
                                                onRowsPerPageChange={(event)=>{
                                                    setRowsPerPage(event.target.value)
                                                }}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={[5,10,15,20,25,30]} 
                                            />
                                        :<Stack flexDirection="row" justifyContent="center" my={2}><DoDisturbAltIcon/> There is no Items right now</Stack>
                                        }
                                </TableContainer>
                                
                            </ListItem>
                        </List>
                    </Paper>
                    
                </Grid>
                <Grid item md={4} xs={12}>
                
                    <Paper sx={{my : 2}}>
                        <List>
                            <ListItem sx={{justifyContent:"space-between"}}> 
                                <Typography variant="h6">Order Summary</Typography>
                            </ListItem>
                            <ListItem sx={{justifyContent:"space-between"}}>
                                    <Typography>items Price :</Typography>
                                    <Typography>{formatToCurrency(order.itemsPrice,"USD")}</Typography>
                            </ListItem>
                            <ListItem sx={{justifyContent:"space-between"}}>
                                <Typography>Tax Price : </Typography>
                                <Typography>{formatToCurrency(order.taxPrice,"USD")}</Typography>
                            </ListItem> 
                            <ListItem sx={{justifyContent:"space-between"}}>
                                <Typography>Shipping Price : </Typography>
                                <Typography>{formatToCurrency(order.shippingPrice,"USD")}</Typography>
                            </ListItem> 
                            <ListItem sx={{justifyContent:"space-between"}}>
                                <Typography>Total Price : </Typography>
                                <Typography>{formatToCurrency(order.itemsPrice + parseFloat((order.taxPrice || 0)) + parseFloat((order.shippingPrice || 0)),"USD")}</Typography>
                            </ListItem>

                        {!order.isPaid &&
                            <ListItem>
                                <Button disabled={loadingPaypal} sx={{backgroundColor : "#009cde"}} variant="contained" fullWidth 
                                onClick={()=>{

                                    setLoadingPaypal(true)
                                    createOrder(order._id)
                                    .then(approvalUrl=>{
                                        setLoadingPaypal(false)
                                        router.push(approvalUrl)
                                    })
                                    .catch(err=>{
                                        setLoadingPaypal(false)
                                        alert(err)
                                    })
                                
                                    

                                }}
                                >
                                    { loadingPaypal && <CircularProgress size={20} />}
                                <Typography sx={{mx : 2}}>Paypal</Typography>    
                                </Button>
                            </ListItem>
                }
                            
                        </List>
                    </Paper>
                    
                </Grid>
            </Grid>

        </Container> 
        
    </Layout>
    );
    
}

export async function getServerSideProps(context){ 
    return {
        props : {
            id : context.params.id
        }
    }
}

export default Order;


