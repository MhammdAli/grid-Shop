import { Star } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Divider, IconButton, List, ListItem, Rating, Typography } from '@mui/material';
import React from 'react'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import styled from '@emotion/styled';
import CustomLink from "../utilities/customRouting"
const Itemcard = ({itemDetails,image ,slugName, name,updatedAt , mainCategory , price , rating , description }) => {

    const [expanded, setExpanded] = React.useState(false);
    
    const ExpandMore = styled(({ ...other }) => {
       
        return <IconButton {...other} />;
      })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions?.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      }));
       
   
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

 
    function changeDateFormat(date){  
         return new Date(date).toString()
    }

    return (
        <Card>
      <CardHeader 
        title={name}
        subheader={changeDateFormat(updatedAt)}
      />
      <CardMedia
        component="img"
        height="300"
        image={`imgs/products/${image}`}
        alt="Paella dish"
      />
      <CardContent>
        <List>
            <ListItem sx={{px:0,py:.5}}>
                <Typography variant="body2" color="text.secondary">
                    price : ${price}
                </Typography>
            </ListItem>
            <ListItem sx={{px:0,py:.5}}>
                <Typography variant="body2" color="text.secondary">
                    Category : {mainCategory}
                </Typography>
            </ListItem>
            <ListItem sx={{p:0,py:.5}}>
                Ratting :  
                <Rating 
                    name="text-feedback"
                    value={rating}
                    readOnly
                    precision={1}
                    sx={{ml:1}}
                    emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
            </ListItem>
        </List>
        <Typography variant="body2" color="text.secondary">
           {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <CustomLink route={`/products/${slugName}`} disableDecoration>
            <Button variant="contained">
                View Product
            </Button>
            </CustomLink>
        <ExpandMore
          expand={expanded.toString()}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      {itemDetails &&
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Order Details:</Typography>
          <List>
             {itemDetails.map((eachDetail , index)=>{
               return (
                 <>
                 <ListItem sx={{p:.8}} key={index}>
                   {eachDetail}
                 </ListItem> 
                 <Divider/>
                 </>
               )
             }) 
             } 
            </List>
        </CardContent>
      </Collapse>
      }
    </Card>
    );
}


export default Itemcard;
