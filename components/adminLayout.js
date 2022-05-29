import React from 'react'; 
import { Box, List,Toolbar ,Typography , Divider , ListItemText
,ListItemIcon ,ListItemButton ,IconButton, Paper, Menu, MenuItem} from '@mui/material';
import NextLink from "next/link"; 
import { ThemeProvider} from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import { useTheme } from "../themes/theme";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; 
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DescriptionIcon from '@mui/icons-material/Description'; 
import GroupIcon from '@mui/icons-material/Group';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { CheckPermission, PERMISSIONS } from '../middlewares/hasPermission';
import { logOut, useAuth } from '../auth/AuthContext';
import { useStore } from '../store/store';
import { DarkMode, LightMode } from '@mui/icons-material';
import { changeDarkMode } from '../store/actions';
import {useRouter} from "next/router";
import {AppBar,Drawer,DrawerHeader} from "../components/DrawerStyles";

const AdminLayout = ({children,Title}) => {
 
    const router = useRouter();
    const {state,dispatch} = useStore()
    const {theme} = useTheme(state.darkMode)
    const {session} = useAuth();
    const [open, setOpen] = React.useState(false);
    
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
      
    const ListItems = [ 
        {
            name : 'Add Products',
            icon : <AddBusinessIcon />,
            link : "/admin/add/products",
            needRole : PERMISSIONS.WRITE_PRODUCTS
        },
        {
            name : 'View Products',
            icon : <DescriptionIcon />,
            link : "/admin/products",
            needRole : PERMISSIONS.READ_PRODUCTS
        },
        {
            name : 'View Users',
            icon : <GroupIcon />,
            link : "/admin/users",
            needRole : PERMISSIONS.READ_USER
        },
        {
            name : 'branches',
            icon : <AddLocationIcon />,
            link : "/admin/branches",
            needRole : PERMISSIONS.WRITE_BRANCH
        },
        {
            name : 'categories',
            icon : <CategoryIcon />,
            link : "/admin/categories",
            needRole : PERMISSIONS.WRITE_CATEGORY
        },
        {
            name : 'Brand',
            icon : <Inventory2Icon />,
            link : "/admin/brand",
            needRole : PERMISSIONS.WRITE_BRAND
        }

    ]

    function changeThemeMode(){
      dispatch(changeDarkMode(!state.darkMode ))
      localStorage.setItem("darkMode",!state.darkMode )
    } 

    const [openAvatarMenu , setOpenAvatarmenu] = React.useState(null)
    
    return ( 
      <ThemeProvider theme={theme}>
        <Paper>
          <Box sx={{ display: 'flex' , minHeight : "100vh" }}>
            <AppBar position="fixed" open={open} >
              <Toolbar variant="dense">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                        marginRight: 5,
                        ...(open && { display: 'none' }),
                    }}
                  >
                      <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div" sx={{flexGrow : 1}}>
                      {Title}
                  </Typography>
                  <IconButton onClick={changeThemeMode}  sx={{color : "primary.contrastText" , borderRadius : theme.shape.borderRadius}}>
                      {state.darkMode ? <LightMode  sx={{width : 24 , height : 24}}/> : <DarkMode  sx={{width : 24 , height : 24}}/>}
                  </IconButton>
                  <IconButton 
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={({currentTarget})=>{setOpenAvatarmenu(currentTarget)}}
                    sx={{color : "primary.contrastText"}}
                  >
                    <MoreVertIcon />
                  </IconButton>
                
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
                    
                    <MenuItem dense onClick={()=>{setOpenAvatarmenu(null); router.push("/") }}>Back To Home</MenuItem>
                    <MenuItem dense onClick={()=>{
                          setOpenAvatarmenu(null)
                          logOut().then(()=>{
                            router.replace("/signin")   
                          })  
                    }}>Logout</MenuItem>

                    
                </Menu>
              </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                  <IconButton onClick={handleDrawerClose}>
                      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                  </IconButton>
                </DrawerHeader> 

                <Divider />

                <List>
                    {ListItems.map((item, index) => { 
                        if(!CheckPermission(session?.roles,item.needRole) && !session?.isAdmin) return null;
                        return (
                            <NextLink href={item.link} passHref key={index}>
                                <ListItemButton
                                    sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    }}
                                >
                              
                                <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                                >
                                { item.icon }
                                </ListItemIcon>
                                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                            
                              </ListItemButton>
                          </NextLink>
                        )
                    })
                  }
                  
                </List>
                <Divider /> 
            </Drawer>

            
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}> 
              <DrawerHeader />
              {children} 
            </Box>
            
          </Box>  
        </Paper>
      </ThemeProvider>
    );
}

 
 
export default AdminLayout;
