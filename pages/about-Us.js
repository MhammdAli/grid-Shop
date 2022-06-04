import React from 'react';
import {Container,Grid,Box,Typography,Button,Card,CardMedia} from '@mui/material';
import Layout from '../components/Layout';
import Link from 'next/link';

 

export default function AboutUs(props) {
 
  const content = {
    'header-p1': 'Grid Shop',
    'header-p2': 'is the best ecommerce platform.',
    'description1': 'Founded in August of 2008 and based in Lebanon,Grid Shop is a trusted community marketplace for people to list, discover , and book unique accommodations around the world -- online or from a mobile phone or tablet.',
    'primary-action': 'See our Products',
    'image': 'https://images.unsplash.com/photo-1497681883844-82b4f0a359a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    ...props.content
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box py={8}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Box display="flex" height="100%">
                <Box my="auto">
                  <Typography variant="h3" component="h3" gutterBottom={true}>
                    <Typography color="primary" variant="h3" component="span">{content['header-p1']} </Typography>
                    <Typography variant="h3" component="span">{content['header-p2']}</Typography>
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" paragraph={true}>{content['description1']}</Typography>
                  <Box mt={3}>
                    <Link href='/products' passHref> 
                      <Button variant="contained" color="primary">{content['primary-action']}</Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardMedia image={content['image']}  sx={{height : 512}} />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}