import { Box,Container, Grid, Typography , Button , Divider} from '@mui/material';   
import React , {useState} from "react"
import CustomLink from "../utilities/customRouting";
import { getSession } from '../auth/session';
import Productcard from '../components/productCard';
import { getTopProducts } from '../models/products/products';
import Sectionsplitter from '../components/sectionSplitter';
import { connect } from '../config/dbConn'; 
export default function Home({topProductsProps}) {
 
   const [ topProducts ] = useState(JSON.parse(topProductsProps))
    
  return (
       <Container>
          <Grid container sx={{alignItems : "center" , minHeight : 300 , mb : 6, mt : 2}} spacing={2}>
             
             <Grid item sm={6}>
                 <Typography variant="h4">Amazing Products For Sale</Typography>
                 
                 <Sectionsplitter variant="h5" title="Enjoy Your Time 😍"/>
                 
                 <Typography gutterBottom mt={2} mb={2}>
                    The computation of values depends on the images intrinsic dimensions (width and height) and intrinsic 
                    proportions (width-to-height ratio). These attributes are as follows
                 </Typography>
                 <Button variant="contained">
                     Enjoy Your Time
                 </Button>

             </Grid>
             <Grid item sm={6}>
                 <img src="/header.png" style={{width : "100%"}}  alt="buy products image"/>
             </Grid>
            
          </Grid>

          <Box sx={{display : topProducts.length === 0 ? "none" : "block" }}>
             
             <Sectionsplitter title="Top Products"/>
             
             <Grid container spacing={2} sx={{mt : 2}}>
                { topProducts.map((product,index)=>(
                     <Grid item md={3} key={index}>
                        <CustomLink route={`/products/${product.slugName}`} disableDecoration>
                           <Productcard
                              image={product.image}
                              name = {product.name}
                              mainCategory={product?.category?.main}
                              price={product.price}
                              rating={product.rating}
                              description={product.description} 
                           />
                       </CustomLink>   
                   </Grid>
                  ))
                }
                
             </Grid>
          </Box>
          <Divider sx={{mt : 4,mb : 4}}/>
          <Box>

             <Sectionsplitter title="Why buy from us?" width={230}/>
            
             <Typography sx={{my : 2}}>
                journal has been the best selling and most loved OpenCart theme since first in 2003.
                Tried and tested by over 20k people. journal is a best opencart theme framework on the market today.
                <CustomLink route="/about-Us">Read More</CustomLink>
             </Typography> 

          </Box>
              
       </Container> 
  )
}


export async function getServerSideProps(context){
   await connect();
   const session = await getSession(context);
    
   const topProducts =  await getTopProducts(0,10);
    
  
   return {
      props : {
         session : (session.type === "SUCCESS") ? session.token : null,
         topProductsProps : JSON.stringify(topProducts)
      }
   }

}
