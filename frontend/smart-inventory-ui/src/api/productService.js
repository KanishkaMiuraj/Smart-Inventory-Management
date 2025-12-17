import api from './axiosConfig';

// Fetch all products from Backend
export const getProducts = async () => {
    try {
        const response = await api.get('/Products');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};