'use client';

import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import ConstructionIcon from '@mui/icons-material/Construction';

const OrderPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ConstructionIcon 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main',
              mb: 3 
            }} 
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Coming Soon
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '600px',
              mx: 'auto',
              mb: 4 
            }}
          >
            We're working hard to bring you an amazing order management experience. 
            This section will be available shortly!
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            Stay tuned for updates
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default OrderPage;