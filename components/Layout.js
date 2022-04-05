import Head from "next/head"
import React from 'react';
// MATERIAL UI 
import 
{
    ThemeProvider ,AppBar,
    Toolbar, 
    IconButton, Button, Box, Menu, MenuItem, Avatar, Collapse, MenuList, CssBaseline,createTheme
} from "@mui/material";
import 
{
    SearchInput,
    SearchIconWrapper,
    StyledInputBase
}from "./SearchInput/Search";
////////////////////////////////////////////////////
// MATERIAL UI ICONS
import {
    Search,DarkMode, Close ,LightMode,
    ShoppingCart,RemoveShoppingCart,Login, AppRegistration,
} from '@mui/icons-material';
//////////////////////////////////////////////////
import MenuIcon from "@mui/icons-material/Menu"   
//import theme from "../themes/theme"

import CustomLink from "../utilities/customRouting";
import {useSession,signOut} from "next-auth/react"
import { useRouter } from "next/router";
import { useDarkMode } from "../themes/store"; 
const Layout = ({children}) => {
    
    const listmenu = [
        {name : "Home", slugName : ""},
        {name : "Docs" , slugName : "docs"},
        {name : "Products",slugName : "products"},
        {name : "About Us",slugName : "about-Us"},
        {name : "Blog",slugName : "blogs"}
    ]

    
    const [selectedIndex , setSelectedIndex] = React.useState(0)
    const [openMenu , setOpenMenu] = React.useState(false)
    const [openAvatarMenu , setOpenAvatarmenu] = React.useState(null)
    const router = useRouter()

    const { status } = useSession()
    const {state , dispatch} = useDarkMode()
   
    function changeThemeMode(){
        dispatch({type : state.darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" })
        localStorage.setItem("darkMode",!state.darkMode )
    }

    const theme =  createTheme({
        palette : {
            mode : state.darkMode ? "dark" : "light",
            navBar : {
               main : "#fff",
               contrastText : "#000"
            },
            primary : {
                main : "#007fff",
                contrastText : "#fff",
                primaryText : "#007fff"
            },
            secondary : {
                main : "#208080"
            }
        },
        typography : { 
            h1 : {
                fontSize : '1.6rem',
                fontWeight : 400,
                margin : "1rem 0"
            },
            h2 : {
                fontSize : '1.4rem',
                fontWeight : 400,
                margin : "1rem 0"
            },
            CustomLink : { 
                color : "#fff",
                textDecoration : "underline",
                fontSize : 24
            }
          
        }
    })

    return (
        <>
            <Head>
                <title>Grid Shop</title>
            </Head>

            <ThemeProvider theme={theme}> <CssBaseline/>  
                <AppBar position="sticky" color="navBar">
                    <Toolbar variant="dense" sx={{pl : {md : 5} , pr : {md : 5}}}>
                        <Box sx={{mr : 2}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 36 32" fill="none" className="css-1170n61"><path fillRule="evenodd" clipRule="evenodd" d="M30.343 21.976a1 1 0 00.502-.864l.018-5.787a1 1 0 01.502-.864l3.137-1.802a1 1 0 011.498.867v10.521a1 1 0 01-.502.867l-11.839 6.8a1 1 0 01-.994.001l-9.291-5.314a1 1 0 01-.504-.868v-5.305c0-.006.007-.01.013-.007.005.003.012 0 .012-.007v-.006c0-.004.002-.008.006-.01l7.652-4.396c.007-.004.004-.015-.004-.015a.008.008 0 01-.008-.008l.015-5.201a1 1 0 00-1.5-.87l-5.687 3.277a1 1 0 01-.998 0L6.666 9.7a1 1 0 00-1.499.866v9.4a1 1 0 01-1.496.869l-3.166-1.81a1 1 0 01-.504-.87l.028-16.43A1 1 0 011.527.86l10.845 6.229a1 1 0 00.996 0L24.21.86a1 1 0 011.498.868v16.434a1 1 0 01-.501.867l-5.678 3.27a1 1 0 00.004 1.735l3.132 1.783a1 1 0 00.993-.002l6.685-3.839zM31 7.234a1 1 0 001.514.857l3-1.8A1 1 0 0036 5.434V1.766A1 1 0 0034.486.91l-3 1.8a1 1 0 00-.486.857v3.668z" fill="#007FFF"></path></svg>
                        </Box>
                        <Box flexGrow={1} sx={{display : {xs : "block" , "md" : "none"}}}></Box>
                        <Box sx={{display : {xs : "none" , "md" : "flex"}}} flexGrow={1}>
                            {listmenu.map((item,index)=>(
                                <React.Fragment key={index}>
                                    <CustomLink route={`/${item.slugName}`} disableDecoration color="inherit">
                                        <Button component="span" color="inherit"  xs={{cursor : "pointer"}} >
                                            {item.name} 
                                        </Button>
                                     </CustomLink>
                                </React.Fragment>
                            ))}
                        </Box>
                        <Box flexDirection="row" sx={{display : "flex",alignItems:"center"}}>

                            <SearchInput sx={{mr : 2}}>
                                <SearchIconWrapper>
                                    <Search />
                                </SearchIconWrapper>

                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </SearchInput>

                            <IconButton sx={{color : "primary.main" , borderRadius : theme.shape.borderRadius}}>
                                {status === "authenticated" ? <ShoppingCart sx={{width : 24 , height : 24}}/> : <RemoveShoppingCart sx={{width : 24 , height : 24}}/>}
                            </IconButton>

                            <IconButton  sx={{color : "primary.main" , borderRadius : theme.shape.borderRadius}}>
                                {state.darkMode ? <LightMode onClick={changeThemeMode} sx={{width : 24 , height : 24}}/> : <DarkMode onClick={changeThemeMode} sx={{width : 24 , height : 24}}/>}
                            </IconButton>
                        
                             
                            {status === "authenticated" 
                                ?   <>

                                 
                                        <Avatar src="/header.png" sx={{ width: 30, height: 30 ,ml : 1 , mr : {xs : 1,md : 0}}} onClick={({currentTarget})=>{setOpenAvatarmenu(currentTarget)}}/>     
                                     
                                        <Menu
                                            open={Boolean(openAvatarMenu)}
                                            onClose={()=>{setOpenAvatarmenu(null)}}
                                            anchorEl={openAvatarMenu}
                                            PaperProps = {{
                                                style : {
                                                    width : 200
                                                }
                                            }}
                                        >
                                            <MenuItem dense onClick={()=>{setOpenAvatarmenu(null)}}>View profile</MenuItem>
                                            <MenuItem dense onClick={()=>{
                                                 setOpenAvatarmenu(null)
                                                 signOut({callbackUrl : "/about-Us" , redirect : false}).then(()=>{router.replace("/signin")})
                                            }}>Logout</MenuItem>

                                            
                                        </Menu>
                                   </>
                                :  
                                    <>
                                    <CustomLink route="/signin">
                                        <IconButton sx={{color : "primary.main" , borderRadius : theme.shape.borderRadius}}>
                                            <Login sx={{width : 24 , height : 24}}/>   
                                        </IconButton>   
                                    </CustomLink>

                                    <CustomLink route="/registration">
                                        <IconButton sx={{color : "primary.main" , borderRadius : theme.shape.borderRadius}}>
                                            <AppRegistration sx={{width : 24 , height : 24}}/>   
                                        </IconButton>   
                                    </CustomLink>
                                    
                                    </>
                            } 
                           
                            <Box flexGrow={1} sx={{display : {xs : "block" , "md" : "none"}}}>
                                <IconButton  sx={{color : "primary.main" , borderRadius : theme.shape.borderRadius}} onClick={()=>{setOpenMenu(!openMenu)}}>
                                    {!openMenu ? <MenuIcon sx={{width : 24 , height : 24}} /> : <Close/>}
                                </IconButton>
                            </Box>
                        </Box>
                    </Toolbar>

                    <Collapse in={openMenu} sx={{display : {md : "none"}}}> 
                       <MenuList>
                            {listmenu.map((item,index)=>( 
                                <CustomLink key={index} route={`/${item.slugName}`} disableDecoration color="inherit" >
                                    <MenuItem selected={index === selectedIndex} onClick={()=>{setSelectedIndex(index)}}> 
                                            <Button component="span" color="inherit"  xs={{cursor : "pointer"}} >
                                                {item.name} 
                                            </Button>
                                    </MenuItem>  
                                </CustomLink>
                            ))}
                       </MenuList>
                    </Collapse>
                </AppBar>

             
                {children}  
            </ThemeProvider>
            
        </>
    );
}

export default Layout;
