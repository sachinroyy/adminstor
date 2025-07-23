'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { CloudUpload, AddPhotoAlternate } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DealsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    offer: '',
    description: '',
    price: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/deals');
      const data = await response.json();
      if (data.success) {
        setDeals(data.data);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.offer || !formData.price || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create deal with base64 image
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Deal created successfully!');
        // Reset form
        setFormData({
          name: '',
          offer: '',
          description: '',
          price: '',
          image: ''
        });
        setImagePreview('');
        // Refresh deals list
        fetchDeals();
      } else {
        throw new Error(data.error || 'Failed to create deal');
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error(error.message || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  // Styled file upload button
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Deal of the Day
      </Typography>
      
      <Grid container spacing={3}>
        {/* Add New Deal Form */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Add New Deal</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 } }}>
              <TextField
                fullWidth
                label="Deal Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              
              <TextField
                fullWidth
                label="Offer"
                name="offer"
                value={formData.offer}
                onChange={handleInputChange}
                placeholder="e.g., 50% OFF"
                required
                variant="outlined"
                size="small"
              />
              
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                variant="outlined"
                size="small"
              />
              
              <TextField
                fullWidth
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  step: '0.01',
                  min: '0'
                }}
              />
              
              <Box sx={{ mb: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  {imageFile ? imageFile.name : 'Upload Image'}
                  <VisuallyHiddenInput 
                    type="file" 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Button>
                
                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                    />
                  </Box>
                )}
                
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  JPG, PNG or WEBP. Max size: 5MB
                </Typography>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || uploading}
                startIcon={loading || uploading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Creating...' : uploading ? 'Uploading...' : 'Create Deal'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Deals List */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Current Deals</Typography>
          
          {loading && deals.length === 0 ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : deals.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No deals available. Create your first deal!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {deals.map((deal) => (
                <Grid item xs={12} sm={6} key={deal._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', pt: '56.25%' }}>
                      <CardMedia
                        component="img"
                        image={deal.image}
                        alt={deal.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Chip
                        label={deal.offer}
                        color="error"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 'bold' }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom noWrap>
                        {deal.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mb: 2
                        }}
                      >
                        {deal.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${parseFloat(deal.price).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DealsPage;