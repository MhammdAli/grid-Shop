import { Box, Typography } from '@mui/material';
import React from 'react';

const Sectionsplitter = ({title , variant = "h4" , color = "primary.main" , borderColor = "primary.main",width = 150,sx}) => {
    return (
        <Box sx={sx}>
           <Typography variant={variant} sx={{fontWeight : "bold"}} color={color} gutterBottom>
                   {title}
           </Typography>

           <Box sx={{height : 2 , width , backgroundColor : borderColor ,mb : .5}}></Box>
           <Box sx={{height : 2 , width : width / 2 , backgroundColor : borderColor ,mb : .5}}></Box>
           <Box sx={{height : 2 , width : width / 3 , backgroundColor : borderColor ,mb : .5}}></Box>
             
 
        </Box>
    );
}

export default Sectionsplitter;
