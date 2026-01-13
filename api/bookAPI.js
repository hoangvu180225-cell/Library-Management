import axiosClient from './axiosClient.js';

const bookApi = {
    // 1. Danh sách sách
    getAll(params) {
        const url = '/books';
        return axiosClient.get(url, { params });
    },

    // 2. Chi tiết sách
    getById(id) {
        const url = `/books/${id}`;
        return axiosClient.get(url);
    },

    // 3.Bảng xếp hạng
    getRanking(type = 'week') {
        const url = '/books/ranking';
        return axiosClient.get(url, { 
            params: { type } 
        });
    },

    // 4. Thêm sách
    create(bookInfo) {
        const url = '/books';
        return axiosClient.post(url, bookInfo);
    },

    // 5. Sửa sách
    update(id, bookInfo) {
        const url = `/books/${id}`;
        return axiosClient.put(url, bookInfo);
    },

    //6. Xóa sách
    delete(id) {
        const url = `/books/${id}`;
        return axiosClient.delete(url);
    }
};

export default bookApi;