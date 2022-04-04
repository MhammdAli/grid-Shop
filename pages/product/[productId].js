import React from 'react';
import {useRouter} from "next/router"
import { Container, Link ,Grid, List, ListItem, Typography,Card,Button} from '@mui/material';
import NextLink from "next/link"
import Image from "next/image"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Productid = () => {

    const router = useRouter()
 
    const {productId} = router.query

    
    return (
        <Container sx={{my : 1.5}}>
            <NextLink href="/" passHref >
                  <Link>
                      <ArrowBackIcon sx={{pt : "4px",fontSize : 20}}/> back to products
                  </Link>
            </NextLink>
            <Grid container spacing={1} sx={{my : 1.5}}>
                <Grid item md={6}>
                    <Image src={'/header.png'} alt="priducts" width={440} height={340} layout="responsive"></Image>
                </Grid>
                <Grid item md={3}>
                    <List>
                        <ListItem>
                            <Typography variant="h1">
                                {productId}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>
                                Category : Shirts
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>
                                Brand : Shirts
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>
                                 Rating : 4.5  starts of 10 (reviews)
                            </Typography>
                        </ListItem>
                        <ListItem>
                            Description : 
                            <Typography>
                                A popular tshirt
                            </Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={3}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item><Typography>Price : </Typography></Grid>
                                    <Grid item><Typography>200</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item><Typography>status : </Typography></Grid>
                                    <Grid item><Typography>in stock</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem >
                                <Button fullWidth variant="contained">Add To Cart</Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Productid;
