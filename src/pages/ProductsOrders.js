import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  Slider,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';

export default function ProductOrders() {
  const { logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:8000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data.data); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold">Casual</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Box border="1px solid #ccc" borderRadius={2} p={2}>
            <Typography fontWeight="bold" mb={2}>Filters</Typography>

            <Typography variant="subtitle2">Price</Typography>
            <Slider value={[0, 300]} max={300} sx={{ mb: 2 }} />

            <Typography variant="subtitle2">Category</Typography>
            {['T-shirts', 'Polo', 'Jeans', 'Shirts'].map((cat) => (
              <FormControlLabel
                key={cat}
                control={<Checkbox />}
                label={cat}
              />
            ))}

            <Button variant="contained" sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}>
              Apply Filter
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {products.map((product) => (
              <Box
                key={product.id}
                border="1px solid #ddd"
                borderRadius={2}
                width="180px"
                p={2}
                textAlign="center"
              >
                <img
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  style={{ width: '100%', height: 150, objectFit: 'contain' }}
                />
                <Typography fontWeight="bold">{product.name}</Typography>
                <Typography>${product.price}</Typography>
                <Box mt={1} display="flex" justifyContent="center" alignItems="center" gap={1}>
                  <Button size="small" variant="outlined">-</Button>
                  <Typography>0</Typography>
                  <Button size="small" variant="outlined">+</Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box border="1px solid #ccc" borderRadius={2} p={2}>
            <Typography fontWeight="bold">Order Summary</Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: 'black' }}>
              Proceed to Checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
