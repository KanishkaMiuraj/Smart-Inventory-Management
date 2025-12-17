import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Typography, Box, Stack, IconButton, Divider, 
    Table, TableBody, TableCell, TableHead, TableRow, Slide 
} from '@mui/material';
import { Close, ReceiptLong } from '@mui/icons-material';

// Smooth Transition for the Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDetailsDialog = ({ open, onClose, order }) => {
    if (!order) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            TransitionComponent={Transition} 
            fullWidth 
            maxWidth="sm"
        >
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ReceiptLong />
                        <Typography variant="h6">Order Details #{order.id}</Typography>
                    </Stack>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            
            <DialogContent dividers>
                {/* Customer Info */}
                <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Customer Name</Typography>
                    <Typography variant="h6">{order.customerName}</Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {/* Items Table */}
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Items Purchased</Typography>
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderItems?.map((item, index) => {
                            // Ensure we catch price from any field safely
                            const itemPrice = item.price || item.unitPrice || item.product?.price || 0;
                            const itemTotal = itemPrice * item.quantity;

                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        {item.productName || item.product?.name || "Unknown Product"}
                                    </TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">Rs. {itemPrice.toLocaleString()}</TableCell>
                                    <TableCell align="right"><strong>Rs. {itemTotal.toLocaleString()}</strong></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* Total Amount */}
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                        Total: Rs. {order.totalAmount?.toLocaleString()}
                    </Typography>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;