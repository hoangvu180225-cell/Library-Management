import axiosClient from './axiosClient.js';

const adminApi = {
    // 1. Lấy danh sách người dùng
    getAllUsers() {
        const url = '/api/admin/users';
        return axiosClient.get(url);
    },

    // 2. Sửa thông tin người dùng
    updateUser(id, data) {
        const url = `/api/admin/users/${id}`;
        return axiosClient.put(url, data);
    },

    // 3. Xóa user
    deleteUser(id) {
        const url = `/api/admin/users/${id}`;
        return axiosClient.delete(url);
    },

    // 4. Lấy danh sách nhân viên
    getAllStaffs() {
        const url = '/api/admin/staffs';
        return axiosClient.get(url);
    },

    // 5. Thêm nhân viên
    createStaff(staffInfo) {
        const url = '/api/admin/staffs';
        return axiosClient.post(url, staffInfo);
    },

    // 6. Sửa nhân viên
    updateStaff(id, staffInfo) {
        const url = `/api/admin/staffs/${id}`;
        return axiosClient.put(url, staffInfo);
    },

    // 7. Xóa nhân viên
    deleteStaff(id) {
        const url = `/api/admin/staffs/${id}`;
        return axiosClient.delete(url);
    }
};

export default adminApi;