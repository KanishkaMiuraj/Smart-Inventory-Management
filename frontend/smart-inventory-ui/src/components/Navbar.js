import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Badge, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Dashboard, Storefront } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'primary' : 'inherit';

  return (
    <AppBar position="sticky" color="default" sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Dashboard color="primary" sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="h6" color="primary" fontWeight="700" sx={{ letterSpacing: '-0.5px' }}>
              Smart Inventory
            </Typography>
          </Box>

          <Box>
            <Button component={Link} to="/" color={isActive('/')} startIcon={<Storefront />} sx={{ mr: 2 }}>
              Shop
            </Button>
            <Button component={Link} to="/admin" color={isActive('/admin')} startIcon={<Dashboard />} sx={{ mr: 2 }}>
              Admin
            </Button>
            <Button component={Link} to="/cart" variant="contained" disableElevation startIcon={<Badge badgeContent={cartItems.length} color="secondary"><ShoppingCart /></Badge>}>
              Cart
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;