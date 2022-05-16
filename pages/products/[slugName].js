import React,{useState } from 'react'; 
import { Container ,Grid, List, ListItem, Typography,Card,Button,Slider,Snackbar, IconButton} from '@mui/material'; 
import Image from "next/image";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { Close } from '@mui/icons-material';
import {useStore} from "../../store/store";
import { addToCart, updateToCart } from '../../store/actions';
import {getSession} from "../../auth/session";
import { getProductBySlugName } from '../../models/products/products'; 
import { connect } from '../../config/dbConn';
import {useRouter} from "next/router";
import {useAuth} from "../../auth/AuthContext"
import Layout from '../../components/Layout';
const Productid = ({productProps}) => {
 
    const [SnackMessage , setSnackMessage] = useState({isError : false , message : null}) 
    const [product] = useState(JSON.parse(productProps))
    const [quantity , setQuantity] = useState(1)
    const {session} = useAuth()
    const {state , dispatch} = useStore()
    const router = useRouter()
    const [maxQuantity , setMaxQuantity] = useState(0)

    React.useMemo(()=>{
       setMaxQuantity(product?.stocks?.reduce((agg,stock) => (agg + stock?.countInStock),0))
    },[product?.stocks])
 
    if(!product){
        return (
            <Typography>Product Not Exists</Typography>
        )
    }

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackMessage({isError : false , message : null});
    };

    const addToCartAction = ()=>{
        if(product?.stocks?.length <= 0){
            setSnackMessage({isError : true,message : "This product is not availbale in the stock rightnow !!"})
            return;
        } 

        const existsItemIndex  = state.cart?.findIndex(({product : {_id}})=> _id === product._id);

        if(existsItemIndex !== -1){
           var oldQuantity = state.cart[existsItemIndex].quantity 
 
            if(oldQuantity === quantity) {
               setSnackMessage({isError : false,message : `This product Already have the same ordered quantity`})
               return;  
            } 
            setSnackMessage({isError : false,message : `Product Updated oldQuantity : ${state.cart[existsItemIndex].quantity} newQuantity : ${quantity}`})
            dispatch(updateToCart(session.UID,existsItemIndex,quantity))  
        }else{
           setSnackMessage({isError : false,message : "Product Add To Cart Successfuly"})
           dispatch(addToCart(session.UID,product , quantity))
        }
    }
 
      const action = (
        <React.Fragment> 
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackBarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

     
    return (
        <Layout>
            <Container sx={{my : 1.5}}> 

                <Snackbar open={Boolean(SnackMessage.message)}  sx={{
                    "& .MuiPaper-root" : {
                        backgroundColor : SnackMessage.isError ? "error.main" : "success.main"
                    }
                }} autoHideDuration={100000} onClose={handleSnackBarClose} action={action} message={SnackMessage.message} anchorOrigin={{vertical: 'top',horizontal: 'center'}} />
                    
                <Button onClick={()=>{ 
                    router.back()
                }}>
                    <ArrowBackIcon sx={{pt : "4px",fontSize : 20}}/> back to products 
                </Button>
                        
                <Grid container spacing={1} sx={{my : 1.5}}>
                    <Grid item md={6} xs={12}>
                        <Image priority={true} src={'/header.png'} alt="priducts" width={440} height={340} layout="responsive"></Image>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Grid container>
                            <Grid item md={6} xs={12}>
                                <List>
                                    <ListItem>
                                        <Typography variant="h1">
                                            {product.name}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            Category : {product?.category?.main}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            Brand : {product.brand}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography>
                                            Rating : {product.rating}  stars of {product.numReviews} (reviews)
                                        </Typography>
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Card>
                                    <List>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item><Typography>Price : </Typography></Grid>
                                                <Grid item><Typography>{product.price}</Typography></Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            <Grid container>
                                                <Grid item><Typography>status : </Typography></Grid>
                                                <Grid item><Typography>in stock but calculated</Typography></Grid>
                                            </Grid>
                                        </ListItem>
                                        {product?.stocks?.length > 0 ?
                                            <>
                                                <ListItem>
                                                    Quantity :
                                                </ListItem>
                                                <ListItem>
                                                    
                                                    <Slider
                                                        aria-label="Temperature"
                                                        defaultValue={1} 
                                                        valueLabelDisplay="auto"
                                                        step={1}
                                                        marks
                                                        min={1}
                                                        onChange={(event,value)=>{
                                                            setQuantity(value)
                                                        }}
                                                        max={maxQuantity}
                                                    />
                                                </ListItem>
                                            </>
                                        :
                                        <ListItem sx={{color : "info.main"}}>
                                            Not Availabel In Stock
                                        </ListItem>}
                                        <ListItem >
                                            <Button fullWidth variant="contained" onClick={addToCartAction}>Add To Cart</Button>
                                        </ListItem>
                                    </List>
                                </Card>
                            </Grid>

                            <Grid item md={12}>
                                <ListItem>
                                    <Typography>Description : </Typography> 
                                </ListItem>
                                <ListItem>
                                    <Typography>
                                        {product.description}
                                    </Typography>
                                </ListItem>
                            </Grid>

                        </Grid>
                    </Grid>

                    {product?.ItemDetails &&
                    <Grid item>
                        <List>
                            <ListItem>
                                <Typography variant="h2">Order Details:</Typography>
                            </ListItem>
                        {product?.ItemDetails.map((eachDetail , index)=>{
                                return (
                                    <>
                                    <ListItem key={index}>
                                    {eachDetail}
                                    </ListItem>  
                                    </>
                                )
                            }) 
                        } 
                        </List>
                        
                    </Grid>
                    }
                    
                </Grid>
            </Container>
            
        </Layout>
    );
}

export default Productid;

export async function getServerSideProps(context){
    await connect();

    const session = await getSession(context);
   
    const {
        slugName
    } = context.params;

    const product = await getProductBySlugName(slugName);
    
 
    return {
        props : {
            session : (session.type === "SUCCESS") ? session.token : null,
            productProps : product ? JSON.stringify(product) : null
        }
    };
 }
 