import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, addProduct, getLowStock } from '../api/adminService';
import { getProducts } from '../api/productService';
import api from '../api/axiosConfig';
import { useNotification } from '../context/NotificationContext';

// --- IMPORT COMPONENTS ---
import OrderDetailsDialog from '../components/OrderDetailsDialog';
import AddProductDialog from '../components/AddProductDialog';
import StatCard from '../components/StatCard'; // <--- NEW IMPORT

import { 
    Container, Grid, Paper, Typography, TextField, Button, 
    Table, TableBody, TableCell, TableHead, TableRow, 
    Select, MenuItem, FormControl, InputLabel, Chip, Box, Stack,
    Tab, Tabs, InputAdornment, IconButton, 
    LinearProgress, Fade, Tooltip 
} from '@mui/material';
import { 
    Inventory, ShoppingCart, Warning, AddCircle, 
    LocalShipping, CheckCircle, Cancel, Edit, Save, Search, 
    TrendingUp, Visibility, FilterAltOff, Category
} from '@mui/icons-material';

const STATUS_COLORS = { Pending: 'warning', Approved: 'info', Shipped: 'success', Cancelled: 'error' };

const AdminDashboard = () => {
    // --- STATE ---
    const [tabValue, setTabValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [allItems, setAllItems] = useState([]); 
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- SMART FILTER STATE ---
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    // Inventory Edit State
    const [editStockId, setEditStockId] = useState(null);
    const [editStockValue, setEditStockValue] = useState('');
    
    // Dialog States
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { showNotification } = useNotification();

    // --- DATA LOADING ---
    const fetchData = async () => {
        try {
            const orderData = await getAllOrders(filterStatus, filterDate);
            setOrders(orderData);
            const lowStockData = await getLowStock();
            setLowStockItems(lowStockData);
            const productData = await getProducts();
            setAllItems(productData);
        } catch (error) {
            console.error("Error loading data");
            showNotification("Failed to load dashboard data", "error");
        }
    };

    useEffect(() => { fetchData(); }, [filterStatus, filterDate]);

    // --- HANDLERS ---
    
    // Handle Click on Low Stock Card
    const handleLowStockClick = () => {
        // If there are no low stock items (Value is 0), don't filter, just notify
        if(lowStockItems.length === 0) {
            showNotification("Inventory is healthy! No low stock items.", "success");
            return;
        }
        setTabValue(1); // Switch to Inventory Tab
        setShowLowStockOnly(true); // Activate Filter
        showNotification("Showing only low stock items", "info");
    };

    const handleAddProduct = async (productData) => {
        if (!productData.name || !productData.sku || !productData.price || !productData.stockQuantity) {
            showNotification("Please fill all fields", "warning"); return;
        }
        try {
            await addProduct(productData);
            showNotification("Product Added Successfully!", "success");
            setOpenAddDialog(false); 
            fetchData();
        } catch (error) {
            showNotification("Failed to add product. SKU might exist.", "error");
        }
    };

    const handleUpdateStock = async (id) => {
        if (!editStockValue) return;
        try {
            await api.put(`/products/${id}/stock`, parseInt(editStockValue));
            showNotification("Stock Updated Successfully", "success");
            setEditStockId(null); fetchData();
        } catch (error) { showNotification("Failed to update stock", "error"); }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if(!window.confirm(`Mark order as ${newStatus}?`)) return;
        try {
            await updateOrderStatus(id, newStatus);
            showNotification(`Order marked as ${newStatus}`, "success"); fetchData();
        } catch (error) { showNotification("Status update failed", "error"); }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOpenViewDialog(true);
    };

    // --- SMART FILTER LOGIC ---
    const filteredInventory = allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Use Backend DTO Flag 'isLowStock'
        const matchesStock = showLowStockOnly ? item.isLowStock === true : true;

        return matchesSearch && matchesStock;
    });

    // --- RENDER ---
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
            <Box mb={4}><Typography variant="h4" gutterBottom fontWeight="700">Admin Dashboard</Typography><Typography variant="body1" color="text.secondary">Real-time overview.</Typography></Box>

            {/* STATS GRID */}
            <Grid container spacing={3} mb={5}>
                
                {/* Normal Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Products" value={allItems.length} icon={<Category />} gradient="linear-gradient(135deg, #6366f1 0%, #4338ca 100%)" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Orders" value={orders.length} icon={<ShoppingCart />} gradient="linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Revenue (Est)" value={`Rs. ${orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}`} icon={<TrendingUp />} gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
                </Grid>
                
                {/* THE SMART LOW STOCK CARD */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title={lowStockItems.length === 0 ? "Stock Status" : "Low Stock Alert"} 
                        value={lowStockItems.length} 
                        icon={<Warning />} 
                        gradient="linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
                        onClick={handleLowStockClick}
                        isAlert={true} // Triggers Pulse & Green Check Logic
                    />
                </Grid>

            </Grid>

            {/* TABS */}
            <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ bgcolor: 'background.paper' }}>
                    <Tab icon={<ShoppingCart />} iconPosition="start" label="Order Management" sx={{ py: 3, fontWeight: 600 }} />
                    <Tab icon={<Inventory />} iconPosition="start" label="Inventory Management" sx={{ py: 3, fontWeight: 600 }} />
                </Tabs>
            </Paper>

            {/* TAB 1: ORDERS */}
            {tabValue === 0 && (
                <Fade in timeout={500}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="600">Recent Orders</Typography>
                            <Stack direction="row" spacing={2}>
                                <TextField type="date" size="small" label="Filter Date" InputLabelProps={{ shrink: true }} value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                                <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}><MenuItem value="All">All Statuses</MenuItem><MenuItem value="Pending">Pending</MenuItem><MenuItem value="Approved">Approved</MenuItem><MenuItem value="Shipped">Shipped</MenuItem><MenuItem value="Cancelled">Cancelled</MenuItem></Select></FormControl>
                            </Stack>
                        </Box>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Date</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell><TableCell align="center">Actions</TableCell><TableCell align="center">Details</TableCell></TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} hover>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>#{order.id}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>Rs. {order.totalAmount}</TableCell>
                                        <TableCell><Chip label={order.status} color={STATUS_COLORS[order.status]} size="small" /></TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                                {order.status === 'Pending' && <><Button variant="contained" color="success" size="small" onClick={() => handleStatusUpdate(order.id, 'Approved')} disableElevation>Approve</Button><Button variant="outlined" color="error" size="small" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Cancel</Button></>}
                                                {order.status === 'Approved' && <><Button variant="contained" color="primary" size="small" onClick={() => handleStatusUpdate(order.id, 'Shipped')} startIcon={<LocalShipping fontSize="small"/>} disableElevation>Ship Order</Button><Button variant="outlined" color="error" size="small" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Cancel</Button></>}
                                                {order.status === 'Shipped' && <Typography variant="body2" fontWeight="bold" color="success.main">Done</Typography>}
                                                {order.status === 'Cancelled' && <Typography variant="body2" fontWeight="bold" color="text.secondary">Closed</Typography>}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View Order Items"><IconButton size="small" onClick={() => handleViewOrder(order)} color="primary"><Visibility /></IconButton></Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Fade>
            )}

            {/* TAB 2: INVENTORY */}
            {tabValue === 1 && (
                <Fade in timeout={500}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Box display="flex" alignItems="center">
                                <Typography variant="h6" sx={{ mr: 3 }} fontWeight="600">Inventory</Typography>
                                
                                {/* FILTER CHIP */}
                                {showLowStockOnly && (
                                    <Chip 
                                        icon={<FilterAltOff />} 
                                        label="Showing Low Stock Only" 
                                        color="error" 
                                        onDelete={() => setShowLowStockOnly(false)} 
                                        sx={{ mr: 2 }}
                                    />
                                )}

                                <TextField placeholder="Search products..." size="small" InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: 300 }} />
                            </Box>
                            <Button variant="contained" startIcon={<AddCircle />} onClick={() => setOpenAddDialog(true)} size="large" sx={{ borderRadius: 8, px: 3 }}>Add New Product</Button>
                        </Box>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow><TableCell width="40%">Product Details</TableCell><TableCell align="center" width="40%">Stock Health</TableCell><TableCell align="center">Action</TableCell></TableRow></TableHead>
                            <TableBody>
                                {filteredInventory.map((p) => {
                                    const stockPercent = Math.min((p.stockQuantity / 50) * 100, 100); 
                                    // Use Backend DTO Flag
                                    const stockColor = p.isLowStock ? 'error' : 'success';
                                    
                                    return (
                                        <TableRow key={p.id} hover>
                                            <TableCell><Typography variant="body1" fontWeight="600">{p.name}</Typography><Typography variant="caption" color="text.secondary">SKU: {p.sku} | Price: Rs. {p.price}</Typography></TableCell>
                                            <TableCell align="center"><Box display="flex" alignItems="center" justifyContent="center"><Box width="60%" mr={2}>{editStockId === p.id ? <TextField autoFocus size="small" type="number" value={editStockValue} onChange={(e) => setEditStockValue(e.target.value)} /> : <Tooltip title={`${p.stockQuantity} items in stock`}><LinearProgress variant="determinate" value={stockPercent} color={stockColor} sx={{ height: 10, borderRadius: 5 }} /></Tooltip>}</Box><Typography variant="body2" fontWeight="bold" color={stockColor + ".main"}>{editStockId !== p.id && `${p.stockQuantity} units`}</Typography></Box></TableCell>
                                            <TableCell align="center">{editStockId === p.id ? <IconButton color="success" onClick={() => handleUpdateStock(p.id)}><Save /></IconButton> : <IconButton onClick={() => { setEditStockId(p.id); setEditStockValue(p.stockQuantity); }}><Edit /></IconButton>}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Fade>
            )}

            <AddProductDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAdd={handleAddProduct} />
            <OrderDetailsDialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} order={selectedOrder} />

        </Container>
    );
};

export default AdminDashboard;