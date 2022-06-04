import React from 'react';
import {CardActionArea , Card , CardContent , CardMedia , Box,Typography} from "@mui/material"
const Productcard = ({image,name,mainCategory,price,description}) => {
    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200"
                    image={`/imgs/products/${image}`}
                    alt="green iguana"
                />
                <CardContent>
                <Box sx={{display : "flex",alignItems : "center",justifyContent : "space-between"}}>
                    <Box>
                        <Typography gutterBottom variant="h5" paragraph sx={{m : 0}}>
                            {name}
                        </Typography>
                        <Typography gutterBottom variant="subtitle2" paragraph sx={{m : 0}}>
                            {mainCategory}
                        </Typography>
                    </Box>

                    <Typography>{price}$</Typography>

                </Box>

                <Typography variant="body2" color="text.secondary" sx={{mt : 2}}>
                    {description}
                </Typography>
                
                </CardContent>
            </CardActionArea> 
        </Card> 
    );
}

export default Productcard;
