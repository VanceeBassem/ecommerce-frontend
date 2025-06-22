import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem('token', token);
      navigate('/products');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Welcome back
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" mb={3}>
          Please enter your details to sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            placeholder="Enter your email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: 'black',
              '&:hover': { backgroundColor: '#333' },
              color: 'white',
              py: 1.2,
              fontWeight: 'bold',
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
