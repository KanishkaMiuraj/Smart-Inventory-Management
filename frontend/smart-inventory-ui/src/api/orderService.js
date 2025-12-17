import api from './axiosConfig';

export const placeOrder = async (orderData) => {
    try {
        // This sends the data to your C# Backend
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error("Order failed:", error);
        throw error;
    }
};