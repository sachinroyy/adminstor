
'use client'

import { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Modal,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [form, setForm] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    categories: [],
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  // Function to get category names
  const getCategoryNames = (categoryIds) => {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) return 'No categories';
    
    // Find category names by matching IDs
    const names = categoryIds.map(id => {
      const found = categories.find(cat => cat._id === id);
      return found ? found.name : null;
    }).filter(Boolean);
    
    return names.length > 0 ? names.join(', ') : 'No categories';
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and products in parallel
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch('/api/category?fields=name'),
          fetch('/api/products')
        ]);
        
        if (!isMounted) return;
        
        // Process categories
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data || []);
          }
        } else {
          console.error('Failed to fetch categories:', categoriesResponse.statusText);
        }
        
        // Process products
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          if (productsData.success) {
            setProducts(productsData.data || []);
          }
        } else {
          console.error('Failed to fetch products:', productsResponse.statusText);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => {
    setEditingProduct(null);
    setForm({ _id: '', name: '', description: '', price: '', categories: [], image: '' });
    setImagePreview('');
    setOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categories: product.categories,
      image: product.image || ''
    });
    setImagePreview(product.image || '');
    setOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ _id: '', name: '', description: '', price: '', categories: [], image: '' });
    setImagePreview('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      // If the field is price, ensure it's a valid number
      if (name === 'price') {
        // Allow empty string or valid number
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
          return { ...prev, [name]: value };
        }
        return prev;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setForm(prev => ({
      ...prev,
      categories: Array.isArray(value) ? value : [value]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!form.name || !form.description || !form.price || form.categories.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const isEditing = !!form._id;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? '/api/products' : '/api/products';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) // Ensure price is a number
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} product`);
      }
      
      // Refresh the products list
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      
      if (productsData.success) {
        setProducts(productsData.data || []);
      }
      
      alert(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
      handleClose();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message || 'Failed to save product'}`);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await fetch(`/api/products?id=${productToDelete._id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      // Refresh the products list
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      
      if (productsData.success) {
        setProducts(productsData.data || []);
      }
      
      alert('Product deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Error: ${error.message || 'Failed to delete product'}`);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Products</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add New Product
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Categories</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <TableRow key={product._id} hover>
                        <TableCell>
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ width: 50, height: 50, objectFit: 'cover' }} 
                            />
                          )}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ 
                            backgroundColor: '#f0f0f0',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontSize: '0.9em',
                            marginRight: '8px',
                            marginBottom: '4px'
                          }}>
                            {getCategoryNames(product.categories)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(product)} color="primary" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(product)} color="error" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Product Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" textAlign="center" mb={2}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
            />
            <FormControl fullWidth required>
              <InputLabel id="category-label">Categories</InputLabel>
              <Select
                labelId="category-label"
                name="categories"
                multiple
                value={form.categories}
                onChange={handleCategoryChange}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.map((value) => {
                      const category = categories.find(cat => cat._id === value);
                      return category ? (
                        <span 
                          key={value} 
                          style={{
                            backgroundColor: '#e0e0e0',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            margin: '2px',
                            fontSize: '0.75rem',
                          }}
                        >
                          {category.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    <input 
                      type="checkbox" 
                      checked={form.categories.includes(category._id)}
                      style={{ marginRight: '8px' }}
                      readOnly
                    />
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              name="price"
              type="text"
              value={form.price}
              onChange={handleChange}
              required
              inputProps={{
                inputMode: 'decimal',
                pattern: '^\d*\.?\d*$', // Allows numbers and decimal points
              }}
              helperText={form.price && isNaN(parseFloat(form.price)) ? 'Please enter a valid number' : ''}
              error={form.price !== '' && isNaN(parseFloat(form.price))}
            />
           

            {/* Image Upload */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Upload Image
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ height: 120, objectFit: 'cover', borderRadius: 8 }}
              />
            )}

            <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add product"
          variant="extended"

          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' },
            zIndex: 1200,
          }}
          
        >
          <AddIcon />
          Add Product
        </Fab>
      )}
    </Box>
  );
}
