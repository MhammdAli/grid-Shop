import React from 'react'; 
import { Box, List,Toolbar ,Typography , Divider , ListItemText
,ListItemIcon ,ListItemButton ,IconButton} from '@mui/material';
import NextLink from "next/link"; 
import { styled, useTheme as useMuiTheme} from '@mui/material/styles';
 
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
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
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const Drawer = styled(MuiDrawer, { shouldForwardProp : (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );
  

  const drawerWidth = 240;



const AdminLayout = ({children,Title}) => {
 
    const theme = useMuiTheme(); 
    const {theme : {myTheme}} = useTheme()
    
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
            link : "/admin/add/products"
        },
        {
            name : 'View Products',
            icon : <DescriptionIcon />,
            link : "/admin/products"
        },
        {
            name : 'View Users',
            icon : <GroupIcon />,
            link : "/admin/users"
        },
        {
            name : 'branches',
            icon : <AddLocationIcon />,
            link : "/admin/branches"
        },
        {
            name : 'categories',
            icon : <CategoryIcon />,
            link : "/admin/categories"
        },
        {
            name : 'Brand',
            icon : <Inventory2Icon />,
            link : "/admin/brand"
        }

    ]
    
    return ( 
        <Box sx={{ display: 'flex' }}>
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
                  <Typography variant="h6" noWrap component="div">
                      {Title}
                  </Typography>
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
                    {ListItems.map((item, index) => (
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
                    ))}
                </List>
                <Divider /> 
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
               <DrawerHeader />
               {children}
            </Box>
        </Box>  
    );
}

 
 
export default AdminLayout;
