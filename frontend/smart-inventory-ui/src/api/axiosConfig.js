import axios from 'axios';

const api = axios.create({
    // CHECK YOUR PORT! Is it 7123? 5001?
    baseURL: 'https://localhost:7199/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;