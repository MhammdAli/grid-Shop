import React from 'react';
import {Button,Typography,Box,Container,ThemeProvider, Paper} from '@mui/material';
import Link from 'next/link'; 
import {useTheme} from '../themes/theme';
import {useStore} from '../store/store';
export default function HttpCode() {
     
  const {state} = useStore()
    
  const {theme} = useTheme(state.darkMode)

  
  return ( 
      
  <ThemeProvider theme={theme}>
    <Paper sx={{height : '100vh'}}> 
      <Container maxWidth="md">
        <Box pt={8} pb={10} textAlign="center">
          <Typography variant="h1" sx={{fontSize : 90}}>404</Typography>
          <Typography variant="h4" component="h2" gutterBottom={true}>Page not found</Typography>
          <Typography variant="subtitle1" color="textPrimary">The requested page couldnt be located. Checkout for any URL misspelling.</Typography>
          <Box mt={4}>
              <Link href="/" passHref>
                <Button variant="contained" color="primary">Return to the homepage</Button>
              </Link>
          </Box>
        </Box>
      </Container> 
       
    </Paper>
  </ThemeProvider>
  );
}