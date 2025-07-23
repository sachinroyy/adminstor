
'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, CloudUpload as CloudUploadIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

export default function CategoryPage() {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    description: '',
    image: null
  });
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (form.image) {
        formData.append('image', form.image);
      }

      const url = editingCategory 
        ? `/api/category/${editingCategory._id}`
        : '/api/category';

      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (editingCategory) {
          setCategories(prev => prev.map(cat => 
            cat._id === editingCategory._id ? data.data : cat
          ));
          setSnackbar({ open: true, message: 'Category updated successfully!', severity: 'success' });
        } else {
          setCategories(prev => [...prev, data.data]);
          setSnackbar({ open: true, message: 'Category created successfully!', severity: 'success' });
        }
        setShowForm(false);
        setForm({ name: '', description: '', image: null });
        setPreview('');
        setEditingCategory(null);
      } else {
        throw new Error(data.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbar({ open: true, message: error.message || 'Error creating category', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await fetch(`/api/category/${id}`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          setCategories(prev => prev.filter(cat => cat._id !== id));
          setSnackbar({ open: true, message: 'Category deleted successfully!', severity: 'success' });
        } else {
          throw new Error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        setSnackbar({ open: true, message: error.message || 'Error deleting category', severity: 'error' });
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || '',
      image: null
    });
    setPreview(category.image?.url || '');
    setShowForm(true);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({ open: true, message: 'Error fetching categories', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Category Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Add New Category
        </Button>
      </Box>

      {loading && !categories.length ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : categories.length > 0 ? (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card sx={{ 
                width: 200, 
                height: 200, 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover .card-actions': {
                  opacity: 1,
                }
              }}>
                <Box 
                  className="card-actions"
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    display: 'flex',
                    gap: 0.5,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    zIndex: 1,
                    '& .MuiIconButton-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }
                  }}
                >
                  <IconButton size="small" onClick={() => handleEdit(category)}>
                    <EditIcon fontSize="small" color="primary" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(category._id)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
                {category.image && (
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: 140,
                      objectFit: 'cover'
                    }}
                    image={category.image?.url || '/placeholder.jpg'}
                    alt={category.name}
                  />
                )}
                <CardContent sx={{ 
                  p: 1.5,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
                  '&:last-child': { pb: 1.5 }
                }}>
                  <Typography 
                    variant="subtitle1" 
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%'
                    }}
                  >
                    {category.name}
                  </Typography>
                  {category.description && (
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={() => handleDelete(category._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No categories found. Create your first category!</Typography>
        </Paper>
      )}

      <Dialog 
        open={showForm} 
        onClose={() => !loading && setShowForm(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ 
                  height: 200, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {preview ? (
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <>
                    <CloudUploadIcon fontSize="large" />
                    <Typography>Upload Category Image</Typography>
                  </>
                )}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </Button>

              <TextField
                label="Category Name *"
                variant="outlined"
                fullWidth
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={loading}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setShowForm(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}