import { Box,Container, Grid, Typography , Button , Divider, Avatar} from '@mui/material';   
import React , {useState} from "react"
import CustomLink from "../utilities/customRouting";
import { getSession } from '../auth/session';
import Productcard from '../components/productCard';
import { getTopProducts } from '../models/products/products';
import Sectionsplitter from '../components/sectionSplitter';
import { connect } from '../config/dbConn'; 
import Layout from '../components/Layout';
import NextLink from "next/link";
import Image from "next/image";
export default function Home({topProductsProps}) {
 
   const [ topProducts ] = useState(JSON.parse(topProductsProps))
    

   const content = {
      'header': 'Our Teams',
      'description': 'We are the guys that made this whole thing possible.',
      '01_image': 'https://images.unsplash.com/photo-1560298803-1d998f6b5249?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&ah=256&q=80',
      '01_name': 'Richard Hendricks',
      '01_job': 'Chief Executive Officer',
      '01_description': 'When I\'m not obsessively stressing about the fate of Pied Piper, I sometimes give lectures to school kids.',
      '02_image': 'https://images.unsplash.com/photo-1561463385-0e5ea0ca925b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&ah=256&q=80',
      '02_name': 'Dinesh Chugtai',
      '02_job': 'chief of staff jobs',
      '02_description': 'I am the chief for applying people. if you want to apply for a job, contact me at (myemail@gridShop.com).',
      '03_image': 'https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&ah=256&q=80',
      '03_name': 'Bertram Gilfoyle',
      '03_job': 'chief marketing officer',
      '03_description': 'I\'m responsible for overseeing the planning, development and execution of an organization\'s marketing and advertising initiatives', 
       
    };

    const s = {
      width: 200,
      height: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 20
    }

  

  return (
       <Layout>
         <Container>
            <Grid container sx={{alignItems : "center" , minHeight : 300 , mb : 6, my : 2}} spacing={2}>
               
               <Grid item sm={6} sx={{my:2}}>
                  <Typography variant="h4">Amazing Products For Sale</Typography>
                  
                  <Sectionsplitter variant="h5" title="Enjoy Your Time 😍"/>
                  
                  <Typography gutterBottom mt={2} mb={2}>
                     The computation of values depends on the images intrinsic dimensions (width and height) and intrinsic 
                     proportions (width-to-height ratio). These attributes are as follows
                  </Typography>
                  <NextLink href="/products" passHref>
                     <Button variant="contained">
                           Enjoy Your Time
                     </Button> 
                  </NextLink>

               </Grid>
               <Grid item sm={6}> 
                  <Image
                     src="/header.png"
                     alt="Picture of the author"
                     width={700}
                     height={500}
                     priority
                   />
               </Grid>
               
            </Grid>

            <Box sx={{display : topProducts?.length === 0 ? "none" : "block" }}>
               
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
                                 description={product.description} 
                              />
                        </CustomLink>   
                     </Grid>
                     ))
                  }
                  
               </Grid>
            </Box>
            <Divider sx={{mt : 4,mb : 4}}/>
            <Box sx={{pb : 2}}>

               <Sectionsplitter title="Why buy from us?" width={230}/>
               
               <Typography sx={{my : 2}}>
                  journal has been the best selling and most loved OpenCart theme since first in 2003.
                  Tried and tested by over 20k people. journal is a best opencart theme framework on the market today.
                  <CustomLink route="/about-Us">Read More</CustomLink>
               </Typography> 

            </Box>

            <Divider/>               
         </Container> 

         <section>
            <Container maxWidth="lg">
               <Box pt={8} pb={10} textAlign="center">
                  <Box mb={6}>
                     <Typography variant="h4" component="h2" gutterBottom={true}>{content['header']}</Typography>
                     <Typography variant="subtitle1" color="textSecondary">{content['description']}</Typography>
                  </Box>
                  <Grid container spacing={6}>
                     <Grid item xs={12} md={4}>
                     <Avatar alt="" src={content['01_image']} style={s} />
                     <Box mb={2}>
                        <Typography variant="h6" component="h4" gutterBottom={true}>{content['01_name']}</Typography>
                        <Typography variant="body1" color="primary" component="span">{content['01_job']}</Typography>
                     </Box>
                     <Typography variant="body2" paragraph={true}>{content['01_description']}</Typography>
                     </Grid>
                     <Grid item xs={12} md={4}>
                     <Avatar alt="" src={content['02_image']} style={s} />
                     <Box mb={2}>
                        <Typography variant="h6" component="h4" gutterBottom={true}>{content['02_name']}</Typography>
                        <Typography variant="body1" color="primary" component="span">{content['02_job']}</Typography>
                     </Box>
                     <Typography variant="body2" paragraph={true}>{content['02_description']}</Typography>
                     </Grid>
                     <Grid item xs={12} md={4}>
                     <Avatar alt="" src={content['03_image']} style={s} />
                     <Box mb={2}>
                        <Typography variant="h6" component="h4" gutterBottom={true}>{content['03_name']}</Typography>
                        <Typography variant="body1" color="primary" component="span">{content['03_job']}</Typography>
                     </Box>
                     <Typography variant="body2" paragraph={true}>{content['03_description']}</Typography>
                     </Grid>
                  </Grid>
               </Box>
            </Container>
         </section>

         <footer>
            <Container maxWidth="lg">
            <Box py={6} display="flex" flexWrap="wrap" alignItems="center" justifyContent='end'>               
               <Typography color="textSecondary" component="p" variant="caption" gutterBottom={false}>© 2020 Nereus All rights reserved.</Typography>
            </Box>
            </Container>
         </footer>
      </Layout>
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
