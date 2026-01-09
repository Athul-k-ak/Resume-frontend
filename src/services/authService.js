import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/users/auth', credentials);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
};

export default authService;
