import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/productService';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

// --- MATERIAL UI IMPORTS ---
import { 
    Container, Grid, Card, CardContent, Typography, CardActions, 
    Button, Chip, Box, TextField, InputAdornment, IconButton, 
    CircularProgress, LinearProgress, Fade 
} from '@mui/material';
import { 
    Search, AddShoppingCart, Remove, Add, ShoppingBag 
} from '@mui/icons-material';


// SUB-COMPONENT: Product Card 
// =================================================================
const ProductCard = ({ product }) => {
    // 1. Get 'cartItems' to check what we already have
    const { addToCart, cartItems } = useCart();
    const { showNotification } = useNotification();
    
    // Local state for quantity selector
    const [quantity, setQuantity] = useState(1);

    // --- LOGIC: STOCK STATUS ---
    const isOutOfStock = product.stockQuantity === 0;
    const isLowStock = product.isLowStock; // Backend dto

    // 2. Find how many of THIS specific product are already in the cart
    const cartItem = cartItems.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Calculate if the user has already taken all available stock
    const isMaxedOut = quantityInCart >= product.stockQuantity;

    // --- HANDLERS ---

    // Handle Quantity Increment
    const handleIncrement = () => {
        // Only increase if (Current Selection + Already in Cart) < Total Stock
        if (quantity + quantityInCart < product.stockQuantity) {
            setQuantity(prev => prev + 1);
        } else {
            showNotification(`Limit reached! You already have ${quantityInCart} in your cart.`, "warning");
        }
    };

    // Handle Quantity Decrement
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Handle Add to Cart
    const handleAddToCart = () => {
        
        // Prevent adding if (Already In Cart + New Selection) > Stock
        if (quantityInCart + quantity > product.stockQuantity) {
            showNotification(`Cannot add. You have ${quantityInCart} in cart and stock is ${product.stockQuantity}.`, "error");
            return;
        }

        // Loop to add the selected quantity
        for(let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        showNotification(`Added ${quantity} x ${product.name} to cart`, "success");
        setQuantity(1); // Reset local counter back to 1
    };

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Fade in timeout={500}>
                <Card 
                    elevation={2} 
                    sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                    }}
                >
                    {/* 1. Placeholder Image Area */}
                    <Box 
                        sx={{ 
                            height: 140, 
                            bgcolor: isOutOfStock ? '#f5f5f5' : '#e3f2fd', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: isOutOfStock ? '#bdbdbd' : '#2196f3'
                        }}
                    >
                        <ShoppingBag sx={{ fontSize: 60, opacity: 0.5 }} />
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                        {/* 2. Header: Name & Stock Status Chip */}
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                            <Typography variant="h6" fontWeight="bold" component="div" sx={{ lineHeight: 1.2 }}>
                                {product.name}
                            </Typography>
                            <Chip 
                                label={isOutOfStock ? "Sold Out" : (isLowStock ? "Low Stock" : "In Stock")} 
                                color={isOutOfStock ? "default" : (isLowStock ? "warning" : "success")} 
                                size="small" 
                                variant={isOutOfStock ? "filled" : "outlined"}
                            />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            SKU: {product.sku}
                        </Typography>
                        
                        <Typography variant="h5" color="primary.main" fontWeight="700" my={2}>
                            Rs. {product.price.toLocaleString()}
                        </Typography>

                        {/* 3. Visual Stock Progress Bar */}
                        <Box mt={2}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="caption" color="text.secondary">Availability</Typography>
                                <Typography variant="caption" fontWeight="bold">{product.stockQuantity} items</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={Math.min((product.stockQuantity / 50) * 100, 100)} 
                                color={isLowStock ? "warning" : "success"} 
                                sx={{ height: 6, borderRadius: 3, mt: 0.5, bgcolor: '#f0f0f0' }}
                            />
                        </Box>

                        {/* 4. Cart Status Indicator (UX Improvement) */}
                        {quantityInCart > 0 && (
                            <Typography 
                                variant="caption" 
                                color="primary" 
                                sx={{ display: 'block', mt: 1, textAlign: 'center', fontWeight: 'bold', bgcolor: '#e3f2fd', borderRadius: 1, p: 0.5 }}
                            >
                                You have {quantityInCart} in cart
                            </Typography>
                        )}
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 2 }}>
                        {/* 5. Quantity Selector */}
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            justifyContent="space-between" 
                            width="100%" 
                            border="1px solid #e0e0e0" 
                            borderRadius={2}
                            p={0.5}
                            bgcolor={isOutOfStock || isMaxedOut ? '#f5f5f5' : 'transparent'}
                        >
                            <IconButton size="small" onClick={handleDecrement} disabled={isOutOfStock || quantity <= 1}>
                                <Remove fontSize="small" />
                            </IconButton>
                            
                            <Typography variant="body1" fontWeight="bold" color={(isOutOfStock || isMaxedOut) ? 'text.disabled' : 'text.primary'}>
                                {quantity}
                            </Typography>
                            
                            <IconButton 
                                size="small" 
                                onClick={handleIncrement} 
                                // Disable if: Out of Stock OR (Selected + InCart >= Total Stock)
                                disabled={isOutOfStock || (quantity + quantityInCart >= product.stockQuantity)}
                            >
                                <Add fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* 6. Add to Cart Button */}
                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large"
                            startIcon={<AddShoppingCart />}
                            onClick={handleAddToCart}
                            // Disable if Sold Out OR Limit Reached
                            disabled={isOutOfStock || isMaxedOut}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            {isOutOfStock ? "Out of Stock" : (isMaxedOut ? "Limit Reached" : "Add to Cart")}
                        </Button>
                    </CardActions>
                </Card>
            </Fade>
        </Grid>
    );
};


// MAIN COMPONENT: ProductList
// Handles Fetching, Filtering, and Layout
// =================================================================
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [searchTerm, setSearchTerm] = useState(''); 

    // Fetch Data
    useEffect(() => {
        const fetchAndSetProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAndSetProducts();
    }, []);

    // Filter Logic (Search by Name or SKU)
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container style={{ marginTop: '30px', marginBottom: '50px' }}>
            {/* Header Area */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
                <Box>
                    <Typography variant="h4" fontWeight="800">Shop Products</Typography>
                    <Typography variant="body1" color="text.secondary">Browse our exclusive inventory</Typography>
                </Box>
                
                {/* Search Bar */}
                <TextField 
                    placeholder="Search by Name or SKU..." 
                    variant="outlined" 
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                    }}
                    sx={{ width: { xs: '100%', md: 300 }, bgcolor: 'white' }}
                />
            </Box>
            
            {/* Content Area */}
            {loading ? (
                <Box display="flex" justifyContent="center" mt={10}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box textAlign="center" mt={5}>
                                <Typography variant="h6" color="text.secondary">No products found matching your search.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default ProductList;