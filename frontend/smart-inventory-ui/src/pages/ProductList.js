import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/productService';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button, Chip, Box } from '@mui/material';
import { useCart } from '../context/CartContext'; // <-- Import Hook

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart(); // <-- Get the function from Context

    useEffect(() => {
        const fetchAndSetProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchAndSetProducts();
    }, []);

    return (
        <Container style={{ marginTop: '30px' }}>
            <Typography variant="h4" gutterBottom>
                Available Products
            </Typography>
            
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    SKU: {product.sku}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    Rs. {product.price}
                                </Typography>
                                
                                <Box mt={2}>
                                    <Chip 
                                        label={product.stockQuantity > 0 ? "In Stock" : "Out of Stock"} 
                                        color={product.stockQuantity > 10 ? "success" : "warning"} 
                                        variant="outlined"
                                    />
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        {product.stockQuantity} items left
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                {/* Update the Button to Click */}
                                <Button 
                                    size="small" 
                                    variant="contained"
                                    onClick={() => addToCart(product)} // <-- Magic happens here
                                    disabled={product.stockQuantity === 0}
                                >
                                    Add to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;