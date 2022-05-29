import { Button, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow , Link, Select, MenuItem, ListItem , List ,Paper , Typography, IconButton , TablePagination ,Stack} from '@mui/material';
import React,{useState} from 'react';
import Sectionsplitter from '../components/sectionSplitter';
import {useStore} from "../store/store";
import Image from "next/image"; 
import {Close , AccountBalance} from '@mui/icons-material'; 
import NextLink from "next/link";
import { removeFromCart } from '../store/actions';
import {updateToCart} from "../store/actions"
import { useRouter } from 'next/router';
import {useAuth} from "../auth/AuthContext"; 
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import Layout from '../components/Layout';
const Cart = () => {
  
    const router = useRouter()
    const {state : {cart},dispatch} = useStore()
    const {session} = useAuth()
    const [page , setPage]= useState(0)
    const [rowsPerPage , setRowsPerPage] = useState(5)
    const removeProductHandler = (product_id)=>{ 
        dispatch(removeFromCart(session.UID,product_id))
    }

    const handleChange = (event,productId) => {
       const newQuantity = event.target.value
        
       const existsItemIndex  = cart?.findIndex(({product : {_id}})=> _id === productId);

       dispatch(updateToCart(session.UID,existsItemIndex,newQuantity))
    };

    const handleCheckOut = ()=>{
        router.push("/shipping")
    }
    
 
    return (
        <Layout>
        <Container>
            <Sectionsplitter title="Shopping Cart" width={100} variant="h5" sx={{my : 2}}/>

            <Grid container spacing={2}>
                <Grid item md={8} xs={12}>
                    <TableContainer>
                        <Table size='small' >
                            <TableHead>
                                <TableRow >
                                    <TableCell >Image</TableCell>
                                    <TableCell >Name</TableCell>
                                    <TableCell align='right'>Quantity</TableCell>
                                    <TableCell align='right'>Price</TableCell>
                                    <TableCell align='right'>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart?.slice(page * rowsPerPage,(page + 1) * rowsPerPage).map((cart,index)=>{
                                    return (
                                        <TableRow hover  key={index} >
                                            <TableCell>
                                                <NextLink href={`/product/${cart?.product?.slugName}`} passHref>
                                                    <Link>
                                                       <Image width={50} height={50} src={`/imgs/products/${cart?.product?.image}`} alt={cart?.product?.name}/>
                                                    </Link>
                                                </NextLink>
                                            </TableCell>
                                            <TableCell>{cart?.product?.name}</TableCell>
                                            <TableCell align='right'>
                                                <Select defaultValue={cart?.quantity} size="small" onChange={(event)=>{handleChange(event,cart.product._id)}}>
                                                     {[...Array(cart?.product?.stocks.reduce((agg,{countInStock})=>agg+countInStock,0)).keys()].map(x=>(<MenuItem key={x+1} value={x+1} >
                                                         {x+1}
                                                     </MenuItem>))}
                                                </Select>
                                            </TableCell>
                                            <TableCell align='right'>{cart?.product?.price}</TableCell>
                                            <TableCell align='right'><Button variant="contained" color="error" size="small" onClick={()=>{removeProductHandler(cart?.product?._id)}}><Close/></Button></TableCell>
                                        </TableRow>
                                    )
                                }) 
                                }
                            </TableBody>
                        </Table> 
                        {cart?.length > 0 ?
                        <TablePagination
                            component="div"
                            count={cart?.length || 0}
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
                        : <Stack flexDirection="row" justifyContent="center" my={2}><DoDisturbAltIcon/> There is no Items right now</Stack>
                        }
                    </TableContainer>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Paper>
                        <List>
                            <ListItem>
                                <IconButton variant="contained" sx={{mx : 1}}><AccountBalance/></IconButton>
                                <Sectionsplitter title="Payment" width={100} variant="h2" />
                            </ListItem>
                            <ListItem>
                                <Typography>subtotal ( {cart?.length || 0} items ) </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>Total : ${cart?.reduce((acc,item)=>acc + item?.quantity * item?.product?.price,0) || 0} </Typography>
                            </ListItem> 
                            <ListItem>
                                <Button variant="contained" fullWidth onClick={handleCheckOut}>CHECK OUT</Button>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>

        </Container>  
        </Layout>
    );
}

export default Cart;

