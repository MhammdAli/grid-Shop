import React from 'react';
import {CardActionArea , Card , CardContent , CardMedia, Rating , Box,Typography} from "@mui/material"
import { Star } from '@mui/icons-material';
const Productcard = ({image,name,mainCategory,price,rating,description}) => {
    return (
        <Card>
            <CardActionArea>
                <CardMedia
                component="img"
                height="200"
                image={`${image}`}
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

                <Box sx={{display : "flex",alignItems : "center"}}>
                    <Rating 
                        name="text-feedback"
                        value={rating}
                        readOnly
                        precision={0.5}
                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                
                    <Box sx={{ ml: 2 }}>{rating > 3 ? "Good" : rating < 2 ? "Poor" : "normal"}</Box>
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
