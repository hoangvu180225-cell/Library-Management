import axiosClient from './axiosClient.js';

const adminApi = {
    // --- USER ---
    getAllUsers() {
        return axiosClient.get('/admin/users');
    },

    createUser(data) {
        // Bỏ FormData, gửi JSON object
        return axiosClient.post('/admin/users', data); 
    },

    updateUser(id, data) {
        return axiosClient.put(`/admin/users/${id}`, data);
    },

    deleteUser(id) {
        return axiosClient.delete(`/admin/users/${id}`);
    },

    // --- STAFF ---
    getAllStaffs() {
        return axiosClient.get('/admin/staffs');
    },

    createStaff(data) {
        // Bỏ FormData, gửi JSON object
        return axiosClient.post('/admin/staffs', data);
    },

    updateStaff(id, data) {
        return axiosClient.put(`/admin/staffs/${id}`, data);
    },

    deleteStaff(id) {
        return axiosClient.delete(`/admin/staffs/${id}`);
    }
};

export default adminApi;