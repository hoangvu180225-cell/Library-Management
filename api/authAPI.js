import axiosClient from './axiosClient.js';

const authApi = {
    login(data) {
        return axiosClient.post('/auth/login', data);
    },
    register(data) {
        return axiosClient.post('/auth/register', data);
    },
    getMe() {
        return axiosClient.get('/auth/me');
    },
    getProfile() {
        return axiosClient.get('/auth/profile');
    },
    updateProfile(data) {
        return axiosClient.put('/auth/profile', data);
    }
};

export default authApi;