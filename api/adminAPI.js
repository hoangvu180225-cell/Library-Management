import axiosClient from './axiosClient.js';

const adminApi = {
    // ==============================
    // 1. QUẢN LÝ NGƯỜI DÙNG (USER)
    // ==============================
    getAllUsers() {
        return axiosClient.get('/admin/users');
    },

    createUser(data) {
        return axiosClient.post('/admin/users', data); 
    },

    updateUser(id, data) {
        return axiosClient.put(`/admin/users/${id}`, data);
    },

    deleteUser(id) {
        return axiosClient.delete(`/admin/users/${id}`);
    },

    // ==============================
    // 2. QUẢN LÝ NHÂN VIÊN (STAFF)
    // ==============================
    getAllStaffs() {
        return axiosClient.get('/admin/staffs');
    },

    createStaff(data) {
        return axiosClient.post('/admin/staffs', data);
    },

    updateStaff(id, data) {
        return axiosClient.put(`/admin/staffs/${id}`, data);
    },

    deleteStaff(id) {
        return axiosClient.delete(`/admin/staffs/${id}`);
    },

    // ==============================
    // 3. QUẢN LÝ GIAO DỊCH (TRANSACTION) - BỔ SUNG PHẦN NÀY
    // ==============================
    // Lấy tất cả đơn hàng để Admin duyệt
    getAllTransactions() {
        return axiosClient.get('/admin/transactions');
    },

    // Cập nhật trạng thái (Duyệt mượn / Đã trả / Đã giao)
    updateTransaction(id, data) {
        return axiosClient.put(`/admin/transactions/${id}`, data);
    },

    // Xóa đơn hàng (nếu cần)
    deleteTransaction(id) {
        return axiosClient.delete(`/admin/transactions/${id}`);
    }
};

export default adminApi;