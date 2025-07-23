"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Stack, 
  Paper,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  Badge
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  // Mock data
  const stats = [
    { 
      title: 'TOTAL EARNINGS', 
      value: '$559.25', 
      change: '+15.34%', 
      isPositive: true,
      icon: <AttachMoneyIcon sx={{ color: 'white' }} />,
      bgColor: '#4e73df',
      iconBgColor: '#2e59d9'
    },
    { 
      title: 'PENDING REQUESTS', 
      value: '18', 
      change: '-2.4%', 
      isPositive: false,
      icon: <ShoppingCartIcon sx={{ color: 'white' }} />,
      bgColor: '#1cc88a',
      iconBgColor: '#17a673'
    },
    { 
      title: 'TASKS', 
      value: '24', 
      change: '+3.48%', 
      isPositive: true,
      icon: <PeopleIcon sx={{ color: 'white' }} />,
      bgColor: '#36b9cc',
      iconBgColor: '#2c9faf'
    },
    { 
      title: 'TOTAL EARNINGS', 
      value: '$559.25', 
      change: '+15.34%', 
      isPositive: true,
      icon: <AccountBalanceWalletIcon sx={{ color: 'white' }} />,
      bgColor: '#f6c23e',
      iconBgColor: '#dda20a'
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#5a5c69' }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search for..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: '0.35rem',
                backgroundColor: '#f8f9fc',
                '& fieldset': { border: 'none' }
              }
            }}
          />
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar sx={{ bgcolor: '#4e73df' }}>
            <PersonIcon />
          </Avatar>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                borderRadius: '0.35rem',
                borderLeft: `0.25rem solid ${stat.bgColor}`,
                height: '100%'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#858796', 
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        mb: 1
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#5a5c69',
                        fontWeight: 700,
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {stat.isPositive ? (
                        <ArrowUpwardIcon color="success" sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                      ) : (
                        <ArrowDownwardIcon color="error" sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: stat.isPositive ? '#1cc88a' : '#e74a3b',
                          fontWeight: 700
                        }}
                      >
                        {stat.change}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#858796', ml: 0.5 }}>
                        since last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: stat.iconBgColor,
                      width: 56, 
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Earnings Overview */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '0.35rem',
              border: '1px solid #e3e6f0',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#4e73df', fontWeight: 700 }}>
                Earnings Overview
              </Typography>
              <Typography variant="body2" sx={{ color: '#858796' }}>
                <Box component="span" sx={{ color: '#4e73df', fontWeight: 700 }}>Monthly</Box> ▼
              </Typography>
            </Box>
            <Box sx={{ height: '300px', backgroundColor: '#f8f9fc', borderRadius: '0.35rem' }}>
              {/* Chart would go here */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#858796'
              }}>
                Chart Area
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tasks */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '0.35rem',
              border: '1px solid #e3e6f0',
              height: '100%'
            }}
          >
            <Typography variant="h6" sx={{ color: '#4e73df', fontWeight: 700, mb: 3 }}>
              Tasks
            </Typography>
            <Stack spacing={2}>
              {['Update new about page', 'Design wireframes', 'Create new database', 'Send meeting notes'].map((task, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 20, 
                    height: 20, 
                    border: '2px solid #e3e6f0', 
                    borderRadius: '3px',
                    mr: 2,
                    cursor: 'pointer'
                  }} />
                  <Typography variant="body2" sx={{ color: '#5a5c69' }}>{task}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;