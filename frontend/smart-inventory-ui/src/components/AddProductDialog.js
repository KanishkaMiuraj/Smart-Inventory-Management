import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Stack, InputAdornment, IconButton, Slide 
} from '@mui/material';
import { Close } from '@mui/icons-material';

// Smooth Transition
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddProductDialog = ({ open, onClose, onAdd }) => {
    // Local State for the Form
    const [product, setProduct] = useState({ name: '', sku: '', price: '', stockQuantity: '' });

    // Handle Input Change
    const handleChange = (prop) => (event) => {
        setProduct({ ...product, [prop]: event.target.value });
    };

    // Handle Submit
    const handleSubmit = () => {
        // Send data to Parent
        onAdd(product);
        // Optional: Clear form after submit (if needed)
        setProduct({ name: '', sku: '', price: '', stockQuantity: '' });
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            TransitionComponent={Transition} 
            fullWidth 
            maxWidth="sm"
        >
            <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
                Add New Product
                <IconButton onClick={onClose}><Close /></IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField 
                        label="Product Name" 
                        fullWidth 
                        value={product.name} 
                        onChange={handleChange('name')} 
                    />
                    <TextField 
                        label="SKU (Stock Keeping Unit)" 
                        fullWidth 
                        value={product.sku} 
                        onChange={handleChange('sku')} 
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField 
                            label="Price" 
                            type="number" 
                            fullWidth 
                            InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} 
                            value={product.price} 
                            onChange={handleChange('price')} 
                        />
                        <TextField 
                            label="Initial Stock Quantity" 
                            type="number" 
                            fullWidth 
                            value={product.stockQuantity} 
                            onChange={handleChange('stockQuantity')} 
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit" size="large">Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} size="large">Add Product</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductDialog;