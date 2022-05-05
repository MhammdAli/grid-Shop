import { Button, Container, Grid, Stack,Table,Alert, TableBody, TableCell, TableContainer, TableHead, TableRow , Link, Select, MenuItem, ListItem , List ,Paper , Typography , TablePagination, TextField, CircularProgress } from '@mui/material';
import React,{useRef, useState} from 'react';
import Sectionsplitter from '../components/sectionSplitter';
import {useStore} from "../store/store";
import Image from "next/image"; 
import {Close } from '@mui/icons-material'; 
import NextLink from "next/link"; 
import { useRouter } from 'next/router'; 
import Checkoutwizard from "../components/CheckOutWizard";
import axios from "axios"; 
import { clearCart } from '../store/actions';
import { useAuth } from '../auth/AuthContext';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { calculateShippingPrice, calculateTax , formatToCurrency } from '../utilities/calculations';
const PlaceOrder = () => {
  
    const router = useRouter()
    const { dispatch} = useStore()
    const {session} = useAuth()
    const {state } = useStore() 
    const [page , setPage]= useState(0)
    const [rowsPerPage , setRowsPerPage] = useState(5)
    const commentRef = useRef()
    const [loading , setLoading] = useState(false)
    const [errors , setErrors] = useState({})
    const handleCheckOut = async ()=>{
 
        const products = state.cart.reduce((agg,product)=>{
            agg.push({
              _id : product.product._id,
              quantity : product.quantity
            })
            return agg
        },[])

        if(products?.length <= 0) return setErrors({products : {message : "no Products"}})
        setLoading(true)

       
        try{
                const {data} = await axios.post("/api/orders/",{
                    products,
                    paymentMethod : state.paymentMethod,
                    shippingAddress : state.shippingAddress,
                    comment : commentRef.current.value
                },{withCredentials : true})

                if(data.type === "SUCCESS"){   
                    router.push(`/order/${data.orderId}`)
                    dispatch(clearCart(session.UID))
                }else{ 
                    setErrors(data.error) 
                }
                setLoading(false)
            }catch(err){ 
                // no auth
                setLoading(false)
                 
            }
    
    }
 
   
    const SummeryReport = React.useMemo(()=>{
        const round = (num)=>Math.round(num * 100 + Number.EPSILON) / 100

        const itemsPrice = round(state.cart?.reduce((acc,item)=>acc + item?.quantity * item?.product?.price,0))
        const shippingPrice = calculateShippingPrice(itemsPrice);

        const taxPrice = calculateTax(itemsPrice)
        const totalPrice = itemsPrice + shippingPrice + taxPrice
    
        return(
            <>
                <ListItem sx={{justifyContent:"space-between"}}>
                    <Typography>items Price : </Typography>
                    <Typography>{formatToCurrency(itemsPrice || 0,"USD")}</Typography>
                </ListItem> 
                <ListItem sx={{justifyContent:"space-between"}}>
                    <Typography>Tax Price : </Typography>
                    <Typography>{formatToCurrency(taxPrice || 0,"USD")}</Typography>
                </ListItem>  
                <ListItem sx={{justifyContent:"space-between"}}>
                    <Typography>Shipping Price :  </Typography>
                    <Typography>{formatToCurrency(shippingPrice || 0,"USD")} </Typography>
                </ListItem>  
                <ListItem sx={{justifyContent:"space-between"}}>
                    <Typography><strong>total Price :</strong> </Typography>
                    <Typography><strong>{formatToCurrency(totalPrice || 0,"USD")}</strong></Typography>
                </ListItem>  
                <ListItem>
                    <Button disabled={loading} variant="contained" fullWidth onClick={handleCheckOut}>
                        {loading && <CircularProgress style={{color : "#fff"}} size={20} />}
                        <Typography sx={{mx : 1}}>CHECK OUT</Typography>
                    </Button>
                </ListItem>
            </>
        )
    },[state.cart])

    return (
        <>
         
        <Container> 
            <Checkoutwizard activeStep={3} sx={{my : 2}}/>
             
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
                                         <Typography><b>Shipping Country : </b> {state.shippingAddress?.country}</Typography> 
                                     </ListItem>
                                     <ListItem>
                                         <Typography><b>Shipping City : </b> {state.shippingAddress?.city}</Typography> 
                                     </ListItem>
                                     <ListItem>
                                         <Typography><b>Shipping PostCode : </b> {state.shippingAddress?.postCode}</Typography> 
                                     </ListItem>
                                     <ListItem>
                                         <Typography><b>Shipping Street : </b> {state.shippingAddress?.street}</Typography> 
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
                                <Typography><b>Your Payment is : </b> {state.paymentMethod}</Typography> 
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
                                                <TableCell align='right'>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {state.cart?.slice(page * rowsPerPage,(page + 1) * rowsPerPage).map((cart,index)=>{
                                                return (
                                                    <TableRow hover  key={index} >
                                                        <TableCell>
                                                            <NextLink href={`/product/${cart?.product?.slugName}`} passHref>
                                                                <Link>
                                                                <Image width={50} height={50} src={cart?.product?.image} alt={cart?.product?.name}/>
                                                                </Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell>{cart?.product?.name}</TableCell>
                                                        <TableCell align='right'>
                                                            <Select value={cart?.quantity} size="small">
                                                                {[...Array(cart?.product?.stocks.reduce((agg,{countInStock})=>agg+countInStock,0)).keys()].map(x=>(<MenuItem key={x+1} value={x+1} >
                                                                    {x+1}
                                                                </MenuItem>))}
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell align='right'>{cart?.product?.price}</TableCell>
                                                        <TableCell align='right'><Button variant="contained" color="error" size="small" ><Close/></Button></TableCell>
                                                    </TableRow>
                                                )
                                            }) 
                                            }
                                        </TableBody>
                                        </Table> 
                                        {state.cart?.length > 0 ?
                                            <TablePagination
                                                component="div"
                                                count={state.cart?.length || 0}
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
                    <Paper>
                        <List>
                            <ListItem> 
                                <Typography variant="h6">order comment</Typography>
                            </ListItem>
                            <ListItem>
                            <TextField 
                                label="Please wrap for me!"
                                multiline 
                                rows={3}
                                fullWidth 
                                inputRef={commentRef}
                            />
                            </ListItem> 
                        </List>
                    </Paper>
                    <Paper sx={{my : 2}}>
                        <List>
                            <ListItem> 
                                <Typography variant="h6">Summery</Typography>
                            </ListItem>
                            <ListItem>
                                <Typography variant='body2'>The total cost consist of the tax , insurance and the shipping charge.</Typography>
                            </ListItem>
                            {SummeryReport}
                        </List>
                    </Paper>
                    {errors && Object.keys(errors).length > 0 &&
                        <Paper sx={{my : 2}}>
                           <List>
                                <ListItem> 
                                    <Typography variant="h6">Reports</Typography>
                                </ListItem>
                                {Object.keys(errors).map((error,index)=>{
                                    
                                    return (
                                        <ListItem key={index} sx={{py : .4}}> 
                                           <Alert severity="error" sx={{width : "100%"}}>{errors[error].message}</Alert>
                                        </ListItem>
                                    )
                                })

                                }
                                
                        </List>
                        </Paper>
                    }
                </Grid>
            </Grid>

        </Container> 
        </>
    );
}

export default PlaceOrder;

