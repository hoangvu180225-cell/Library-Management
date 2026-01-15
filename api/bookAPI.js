/* api/bookAPI.js */
import axiosClient from './axiosClient.js';

const bookApi = {
    // 1. Lấy danh sách sách (Public - Trang chủ)
    getAll(params) {
        const url = '/books';
        return axiosClient.get(url, { params });
    },

    // 2. Chi tiết 1 cuốn sách
    getById(id) {
        const url = `/books/${id}`;
        return axiosClient.get(url);
    },

    // 3. Bảng xếp hạng
    getRanking(type = 'week') {
        const url = '/books/ranking';
        return axiosClient.get(url, { params: { type } });
    },

    // --- CÁC HÀM ADMIN (Quản lý sách) ---
    
    // 4. Thêm sách mới
    create(bookInfo) {
        const url = '/books';
        return axiosClient.post(url, bookInfo);
    },

    // 5. Sửa thông tin sách
    update(id, bookInfo) {
        const url = `/books/${id}`;
        return axiosClient.put(url, bookInfo);
    },

    // 6. Xóa sách khỏi hệ thống
    delete(id) {
        const url = `/books/${id}`;
        return axiosClient.delete(url);
    }
};

export default bookApi;