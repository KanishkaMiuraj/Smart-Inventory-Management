import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { placeOrder } from '../api/orderService';
import { useNavigate } from 'react-router-dom';

// --- MATERIAL UI IMPORTS ---
import { 
    Container, Typography, Button, TextField, Box, Alert, 
    Paper, IconButton, Grid, Divider, Stack, Tooltip 
} from '@mui/material';
import { 
    Delete, Add, Remove, ShoppingCartCheckout, ArrowBack, 
    SentimentDissatisfied, ProductionQuantityLimits 
} from '@mui/icons-material';

const CartPage = () => {
    // 1. Get Functions from Context
    const { cartItems, clearCart, removeFromCart, updateQuantity } = useCart();
    const { showNotification } = useNotification();
    
    // Local State
    const [customerName, setCustomerName] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' }); // For inline errors
    const navigate = useNavigate();

    // 2. Calculate Total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // --- HANDLERS ---

    // Handle Remove (Safety Confirmation)
    const handleRemove = (item) => {
        if(window.confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
            removeFromCart(item.id);
            showNotification("Item removed", "info");
        }
    };

    // Handle Quantity Update
    const handleQtyChange = (id, currentQty, amount) => {
        // Prevent going below 1 (Use delete button for that)
        if (currentQty === 1 && amount === -1) return;
        updateQuantity(id, amount);
    };

    // Handle Checkout
    const handleCheckout = async () => {
        setStatus({ type: '', msg: '' }); // Reset error

        if (!customerName.trim()) {
            setStatus({ type: 'error', msg: 'Please enter your name to complete the purchase.' });
            return;
        }

        const orderPayload = {
            customerName: customerName,
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            await placeOrder(orderPayload);
            clearCart();
            showNotification("Order placed successfully! Thank you.", "success");
            navigate('/'); // Redirect to Shop
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', msg: 'Failed to place order. Insufficient Stocks.' });
        }
    };

    // --- EMPTY CART STATE ---
    if (cartItems.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
                <Paper elevation={0} sx={{ p: 5, bgcolor: 'transparent' }}>
                    <SentimentDissatisfied sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="text.secondary">
                        Your cart is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Looks like you haven't made your choice yet.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large"
                        startIcon={<ArrowBack />} 
                        onClick={() => navigate('/')}
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            </Container>
        );
    }

    // --- MAIN RENDER ---
    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
            {/* Page Header */}
            <Box display="flex" alignItems="center" mb={4}>
                <ShoppingCartCheckout sx={{ fontSize: 35, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="800">Shopping Cart</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ ml: 2, mt: 1 }}>
                    ({cartItems.length} items)
                </Typography>
            </Box>

            {/* Error Alert */}
            {status.msg && (
                <Alert severity={status.type} sx={{ mb: 3 }}>
                    {status.msg}
                </Alert>
            )}

            <Grid container spacing={4}>
                
                {/* LEFT COLUMN: Cart Items */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                        {cartItems.map((item) => (
                            <Paper 
                                key={item.id} 
                                elevation={2} 
                                sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
                            >
                                {/* Icon / Placeholder Image */}
                                <Box 
                                    sx={{ 
                                        width: 80, height: 80, 
                                        bgcolor: '#e3f2fd', borderRadius: 2, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mr: 3
                                    }}
                                >
                                    <ProductionQuantityLimits color="primary" />
                                </Box>

                                {/* Item Details */}
                                <Box sx={{ flexGrow: 1, minWidth: '200px' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        SKU: {item.sku} | Unit: Rs. {item.price.toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* Quantity Controls */}
                                <Box 
                                    sx={{ 
                                        display: 'flex', alignItems: 'center', 
                                        border: '1px solid #e0e0e0', borderRadius: 2,
                                        mx: 3
                                    }}
                                >
                                    <IconButton 
                                        onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                                        disabled={item.quantity <= 1}
                                        size="small"
                                    >
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    
                                    <Typography sx={{ mx: 2, fontWeight: 'bold' }}>
                                        {item.quantity}
                                    </Typography>
                                    
                                    <IconButton 
                                        onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                                        size="small"
                                    >
                                        <Add fontSize="small" />
                                    </IconButton>
                                </Box>

                                {/* Price & Remove */}
                                <Box sx={{ textAlign: 'right', minWidth: '100px' }}>
                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                    </Typography>
                                    <Tooltip title="Remove Item">
                                        <IconButton 
                                            color="error" 
                                            size="small" 
                                            onClick={() => handleRemove(item)}
                                            sx={{ mt: 0.5 }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Grid>

                {/* RIGHT COLUMN: Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Order Summary
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography fontWeight="bold">Rs. {totalAmount.toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography color="text.secondary">Shipping</Typography>
                            <Typography color="success.main" fontWeight="bold">Free</Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box display="flex" justifyContent="space-between" mb={4}>
                            <Typography variant="h5" fontWeight="800">Total</Typography>
                            <Typography variant="h5" fontWeight="800" color="primary.main">
                                Rs. {totalAmount.toLocaleString()}
                            </Typography>
                        </Box>

                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                            Customer Information
                        </Typography>
                        <TextField 
                            label="Full Name" 
                            variant="outlined" 
                            fullWidth 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ex: Kanishka Miuraj"
                            sx={{ mb: 3 }}
                            size="small"
                        />
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            size="large"
                            onClick={handleCheckout}
                            sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: 2 }}
                            disableElevation
                        >
                            Confirm Order
                        </Button>
                        
                        <Button 
                            variant="text" 
                            fullWidth 
                            onClick={() => navigate('/')}
                            sx={{ mt: 1, color: 'text.secondary' }}
                        >
                            Continue Shopping
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CartPage;