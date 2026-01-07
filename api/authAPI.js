import axiosClient from './axiosClient.js';

const authApi = {
    login(data) {
        // Chỉ cần viết phần đuôi, axiosClient tự ghép với baseURL
        return axiosClient.post('/auth/login', data);
    },
    register(data) {
        return axiosClient.post('/auth/register', data);
    },
    getMe() {
        return axiosClient.get('/auth/me');
    }
};

export default authApi;