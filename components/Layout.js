import Head from "next/head"
import React from 'react';
import axios from "axios";
// MATERIAL UI 
import 
{
    ThemeProvider ,AppBar,
    Toolbar, 
    IconButton, Button, Box, Menu, MenuItem, Avatar, Collapse, MenuList, CssBaseline,Badge
} from "@mui/material";
 
////////////////////////////////////////////////////
// MATERIAL UI ICONS
import {
    DarkMode, Close ,LightMode,
    ShoppingCart,RemoveShoppingCart,Login, AppRegistration,
} from '@mui/icons-material';
//////////////////////////////////////////////////
import MenuIcon from "@mui/icons-material/Menu"   
//import theme from "../themes/theme"
import CustomLink from "../utilities/customRouting"; 
import { useRouter } from "next/router";
import { useStore } from "../store/store";
import {addUserInfoAction} from "../store/actions";
import {changeDarkMode} from "../store/actions";
import {useAuth,logOut} from "../auth/AuthContext";
import { useTheme } from "../themes/theme";
import { CheckPermission, PERMISSIONS } from "../middlewares/hasPermission";
const Layout = ({children}) => {
    
    const listmenu = [
        {name : "Home", slugName : ""}, 
        {name : "Products",slugName : "products"},
        {name : "About Us",slugName : "about-Us"}
    ] 
    
    const [selectedIndex , setSelectedIndex] = React.useState(0)
    const [openMenu , setOpenMenu] = React.useState(false)
    const [openAvatarMenu , setOpenAvatarmenu] = React.useState(null)
    const router = useRouter()
 
    const {session, status} = useAuth()
     
    const {state , dispatch} = useStore()
   
    function changeThemeMode(){
        dispatch(changeDarkMode(!state.darkMode ))
        localStorage.setItem("darkMode",!state.darkMode )
    }

    const {theme} = useTheme(state.darkMode)

    React.useEffect(()=>{ 
        if(status === "AUTHENTICATED"){  
             
            axios.get("/api/users/me")
            .then(({data})=>{   
                dispatch(addUserInfoAction(data))
            })
            .catch(err=>{
                console.log(err)
            })
        }
 
    },[status,dispatch])
     
    
    const routes = {
        "products" : PERMISSIONS.READ_PRODUCTS,
        "users" : PERMISSIONS.READ_USER,
        "brand" : PERMISSIONS.READ_BRAND,
        "categories" : PERMISSIONS.READ_CATEGORY,
        "branches" : PERMISSIONS.READ_BRANCH
    }

    function getFirstGrantedRoute(){ 
        const allRoutes = Object.keys(routes); 
        if(session?.isAdmin && allRoutes.length > 0) return allRoutes[0];
        return allRoutes.find((route)=>session?.roles.includes(routes[route]))
    }

    
    return (
        <>  
            <Head>
                <title>Grid Shop</title>
            </Head>

            <ThemeProvider theme={theme}> 
                <CssBaseline/>  
                <AppBar position="sticky" >
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

                            <IconButton sx={{color : "primary.contrastText" , borderRadius : theme.shape.borderRadius}}>
                                {status === "AUTHENTICATED" 
                                ? 
                                    <CustomLink route="/Cart" disableDecoration color="inherit">
                                        <Badge badgeContent={state?.cart?.reduce((agg,{quantity})=>agg + quantity,0)} color="error">
                                            <ShoppingCart sx={{width : 24 , height : 24}}/>
                                        </Badge> 
                                    </CustomLink>
                                : 
                                    <RemoveShoppingCart sx={{width : 24 , height : 24}}/>}
                            </IconButton>
                           
                            <IconButton onClick={changeThemeMode}  sx={{color : "primary.contrastText" , borderRadius : theme.shape.borderRadius}}>
                                {state.darkMode ? <LightMode  sx={{width : 24 , height : 24}}/> : <DarkMode  sx={{width : 24 , height : 24}}/>}
                            </IconButton>
                        
                             
                            {status === "AUTHENTICATED" 
                                ?
                                <>
                                    <Avatar src={state.userInfo && `/images/${state.userInfo.imageUrl}`} sx={{ width: 30, height: 30 ,ml : 1 , mr : {xs : 1,md : 0}}} onClick={({currentTarget})=>{setOpenAvatarmenu(currentTarget)}} alt="user image"/>     
                                    
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
                                        
                                        <MenuItem dense onClick={()=>{setOpenAvatarmenu(null);router.push("/profile") }}>View profile</MenuItem>
                                        {(session?.isAdmin || CheckPermission(session?.roles ,Object.values(routes))) &&
                                        <MenuItem dense onClick={()=>{setOpenAvatarmenu(null);router.push(`/admin/${getFirstGrantedRoute()}`) }}>Admin Page</MenuItem>
                                        }
                                        <MenuItem dense onClick={()=>{setOpenAvatarmenu(null);router.push("/order/orderHistory") }}>Order History</MenuItem>
                                        <MenuItem dense onClick={()=>{
                                                setOpenAvatarmenu(null)
                                                logOut().then(()=>{
                                                router.replace("/signin")   
                                                })  
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
