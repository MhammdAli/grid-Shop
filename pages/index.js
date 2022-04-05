import { Box,Container, Grid, Typography , Button , Divider} from '@mui/material'   
import CustomLink from "../utilities/customRouting"
import { getSession} from "next-auth/react"
import axios from 'axios'
import Productcard from '../components/productCard'
export default function Home({topProducts}) {

 

  return (
       <Container>
          <Grid container sx={{alignItems : "center" , minHeight : 300 , mb : 6, mt : 2}} spacing={2}>
             
             <Grid item sm={6}>
                 <Typography variant="h4">Amazing Products For Sale</Typography>
                 <Typography variant='h5' color="primary.primaryText" gutterBottom>Enjoy Your Time 😍</Typography>
                 <Typography gutterBottom>
                    The computation of values depends on the images intrinsic dimensions (width and height) and intrinsic 
                    proportions (width-to-height ratio). These attributes are as follows
                 </Typography>
                 <Button variant="contained">
                     Enjoy Your Time
                 </Button>
             </Grid>
             <Grid item sm={6}>
                 <img src="/header.png" style={{width : "100%"}}  alt="This ismge #1"/>
             </Grid>
            
          </Grid>

          <Box sx={{display : topProducts.length === 0 ? "none" : "block" }}>
             <Typography variant="h4" sx={{textAlign : "center",fontWeight : "bold"}} color="primary.primaryText" gutterBottom>
                   Top Products
             </Typography>

             <Grid container spacing={2} sx={{mt : 2}}>
                { topProducts.map((product,index)=>(
                     <Grid item md={3} key={index}>
                        <CustomLink route={`/product/${product.slugName}`} disableDecoration>
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
          <Box sx={{textAlign : "center"}}>

             <Typography variant="h4" sx={{textAlign : "center",fontWeight : "bold"}} color="primary.primaryText" gutterBottom>
                   Why buy from us?
             </Typography>

             <Typography>
                journal has been the best selling and most loved OpenCart theme since first in 2003.
                Tried and tested by over 20k people. journal is a best opencart theme framework on the market today.
                <CustomLink route="/about-Us">Read More</CustomLink>
             </Typography> 

          </Box>
              
       </Container> 
  )
}

export async function getServerSideProps(context){

    const session = await getSession(context)

    const {data} = await axios.get(`http://localhost:3000/api/products/topProducts?page=0&pageSize=10`)
     
    return {
       props : {
          session,
          topProducts :  data.result
       }
    }

}
