import api from './axiosConfig';

// =============================================================================
// 1. Get All Orders (US-007)
// Supports Status Filter AND Date Filter
// =============================================================================
export const getAllOrders = async (status = '', date = '') => {
    // We use URLSearchParams to build the query string cleanly
    const params = new URLSearchParams();

    // Add Status parameter if it's selected and not "All"
    if (status && status !== 'All') {
        params.append('status', status);
    }

    // ✅ NEW UPDATE: Add Date parameter if a date is selected
    if (date) {
        params.append('date', date);
    }

    // Example URL generated: /orders?status=Pending&date=2025-12-15
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
};

// =============================================================================
// 2. Update Order Status (US-008)
// Sends the new status string to the backend to update workflow
// =============================================================================
export const updateOrderStatus = async (id, newStatus) => {
    // We send the status as a JSON string because the Backend expects [FromBody] string
    const response = await api.put(`/orders/${id}/status`, JSON.stringify(newStatus), {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

// =============================================================================
// 3. Add New Product (US-002)
// Sends Name, SKU, Price, Stock to create a new inventory item
// =============================================================================
export const addProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

// =============================================================================
// 4. Get Low Stock Warnings (US-004)
// Fetches items where Stock < Threshold (configured in appsettings.json)
// =============================================================================
export const getLowStock = async () => {
    const response = await api.get('/products/low-stock');
    return response.data;
};