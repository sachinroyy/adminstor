'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Button,
  styled,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  ChatBubbleOutline as ChatIcon,
  EmailOutlined as EmailIcon,
  AssignmentOutlined as TodoIcon,
  PersonOutline as PersonIcon,
  GroupOutlined as GroupIcon,
  LockOutlined as AuthIcon,
  ErrorOutline as ErrorIcon,
  SettingsOutlined as SettingsIcon,
  AttachMoney as PricingIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationsIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const drawerWidth =280;



const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '750px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  minWidth: '750px',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const menuItems = [
  {
    section: 'E-Commerce',
    items: [
      { 
        text: 'Dashboard', 
        icon: <DashboardIcon />, 
        path: '/Deshboard/deshboard'
      },
      { 
        text: 'Orders', 
        icon: <ShoppingCartIcon />,
        path: '/Deshboard/orders'
      },
      { 
        text: 'Products', 
        icon: <ShoppingBagIcon />,
        path: '/Deshboard/product'
      },
      { 
        text: 'category', 
        icon: <PeopleIcon />,
        path: '/Deshboard/category'
      },
      { 
        text: 'Deals', 
        icon: <PeopleIcon />,
        path: '/Deshboard/Deals'
      },
      { 
        text: 'Invoices', 
        icon: <ReceiptIcon />,
        path: '/Deshboard/invoices'
      },
    ],
  },
  {
    section: 'Apps',
    items: [
      { 
        text: 'Chats', 
        icon: <ChatIcon />, 
        badge: 3,
        path: '/Deshboard/chats'
      },
      { 
        text: 'Email', 
        icon: <EmailIcon />,
        path: '/Deshboard/email'
      },
      { 
        text: 'Todo App', 
        icon: <TodoIcon />,
        path: '/Deshboard/todo'
      },
    ],
  },
  {
    section: 'Pages',
    items: [
      { 
        text: 'Profile', 
        icon: <PersonIcon />,
        path: '/deshboard'
      },
      { 
        text: 'Users', 
        icon: <GroupIcon />,
        path: '/Deshboard/users'
      },
      { 
        text: 'Authentication', 
        icon: <AuthIcon />,
        path: '/Deshboard/auth'
      },
      { 
        text: 'Error Pages', 
        icon: <ErrorIcon />,
        path: '/Deshboard/error'
      },
      { 
        text: 'Settings', 
        icon: <SettingsIcon />,
        path: '/Deshboard/settings'
      },
      { 
        text: 'Pricing Table', 
        icon: <PricingIcon />, 
        label: 'New',
        path: '/Deshboard/pricing'
      },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Function to handle navigation
  const handleNavigation = (path) => {
    router.push(path);
  };

  const drawer = (
    <div>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo.jpg" alt="logo" width={40} height={40} style={{ borderRadius: '50%' }} />
          JinStore
        </Typography>
      </Box>
        
      <Box sx={{ px: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>B</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Sachin Kumar</Typography>
            <Typography variant="caption" color="text.secondary">Admin Developer</Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {menuItems.map((section, index) => (
        <Box key={index} sx={{ mt: index > 0 ? 2 : 0 }}>
          <Typography
            variant="caption"
            sx={{
                px: 3,
              py: 1,
              color: 'text.secondary',
              fontWeight: 'medium',
              display: 'block',
            }}
          >
            {section.section}
          </Typography>
          <List>
            {section.items.map((item, itemIndex) => (
              <ListItem key={itemIndex} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: pathname === item.path ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.badge && (
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                  {item.label && (
                    <Box
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        borderRadius: 1,
                        px: 1,
                        py: 0.25,
                        fontSize: '0.625rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.label}
                    </Box>
                  )}
                  {!item.badge && !item.label && (item.items ? <ExpandMoreIcon /> : null)}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', paddingLeft: '46px' }}>
            Overview
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <ShoppingCartIcon />
          </IconButton>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              ml: 1,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 'none',
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
           profile
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // Height of the AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
