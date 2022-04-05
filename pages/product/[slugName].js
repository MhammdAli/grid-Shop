import React from 'react'; 
import { Container, Link ,Grid, List, ListItem, Typography,Card,Button,Slider} from '@mui/material';
import { styled } from '@mui/material/styles';
import NextLink from "next/link"
import Image from "next/image"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios"
const Productid = ({product}) => {
 
    // you will remove this code and you have to create another comonent and send to it product not found
    if(!product){
        return (
            <Typography>Product Not Exists</Typography>
        )
    }

    const PrettoSlider = styled(Slider)({
        color: 'primary.main',
        height: 8,
        '& .MuiSlider-track': {
          border: 'none',
        },
        '& .MuiSlider-thumb': {
          height: 24,
          width: 24,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
          },
          '&:before': {
            display: 'none',
          },
        },
        '& .MuiSlider-valueLabel': {
          lineHeight: 1.2,
          fontSize: 12,
          background: 'unset',
          padding: 0,
          width: 32,
          height: 32,
          borderRadius: '50% 50% 50% 0',
          backgroundColor: '#3479db',
          transformOrigin: 'bottom left',
          transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
          '&:before': { display: 'none' },
          '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
          },
          '& > *': {
            transform: 'rotate(45deg)',
          },
        },
      });


    
    return (
        <Container sx={{my : 1.5}}>
            <NextLink href="/" passHref >
                  <Link>
                      <ArrowBackIcon sx={{pt : "4px",fontSize : 20}}/> back to products
                  </Link>
            </NextLink>
            <Grid container spacing={1} sx={{my : 1.5}}>
                <Grid item md={6} xs={12}>
                    <Image src={'/header.png'} alt="priducts" width={440} height={340} layout="responsive"></Image>
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
                                    <ListItem>
                                        Quantity :
                                    </ListItem>
                                    <ListItem>
                                        
                                        <PrettoSlider
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                            defaultValue={0}
                                            max={100}
                                        />
                                    </ListItem>
                                    <ListItem >
                                        <Button fullWidth variant="contained">Add To Cart</Button>
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
                 
            </Grid>
        </Container>
    );
}

export default Productid;


export async function getServerSideProps(context){

    const {
        slugName
    } = context.params

    const {data} = await axios.get(`http://localhost:3000/api/products/${slugName}`)

    return {
        props : {
            product : data.result
        }
    }
}