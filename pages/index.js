import { Star } from '@mui/icons-material'
import { Box,Container, Grid, Typography , Button , CardActionArea , Card , CardContent , CardMedia,CardActions, Rating, Divider} from '@mui/material'  
import Image from 'next/image'
import CustomLink from "../utilities/customRouting"
import {useSession , getSession} from "next-auth/react"
export default function Home() {

   const {data : session , status} = useSession()
 

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

          <Box>
             <Typography variant="h4" sx={{textAlign : "center",fontWeight : "bold"}} color="primary.primaryText" gutterBottom>
                   Top Products
             </Typography>

             <Grid container spacing={2} sx={{mt : 2}}>
                { [1,2,3,4,5,6,7].map((item,index)=>(
                     <Grid item md={3} key={index}>
                        <CustomLink route={`/product/product${index}`} disableDecoration>
                           <Card>
                              <CardActionArea>
                                 <CardMedia
                                    component="img"
                                    height="200"
                                    image="/header.png"
                                    alt="green iguana"
                                 />
                                 <CardContent>
                                    <Box sx={{display : "flex",alignItems : "center",justifyContent : "space-between"}}>
                                       <Box>
                                          <Typography gutterBottom variant="h5" paragraph sx={{m : 0}}>
                                             Lizard
                                          </Typography>
                                          <Typography gutterBottom variant="subtitle2" paragraph sx={{m : 0}}>
                                             Lizard Product
                                          </Typography>
                                       </Box>

                                       <Typography>875$</Typography>

                                    </Box>

                                    <Box sx={{display : "flex",alignItems : "center"}}>
                                       <Rating 
                                          name="text-feedback"
                                          value={3}
                                          readOnly
                                          precision={0.5}
                                          emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                                       />
                                    
                                       <Box sx={{ ml: 2 }}>Good</Box>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{mt : 2}}>
                                       Lizards are a widespread group of squamate reptiles, with over 6,000
                                       species, ranging across all continents except Antarctica
                                    </Typography>
                                    
                                 </CardContent>
                              </CardActionArea> 
                           </Card>  
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

     
    return {
       props : {
          session
       }
    }

}
