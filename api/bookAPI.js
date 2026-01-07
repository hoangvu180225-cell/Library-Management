import axiosClient from './axiosClient.js';

const bookApi = {
    getAll(params) {
        return axiosClient.get('/books', { params }); // params là object {page: 1, limit: 10...}
    },
    get(id) {
        return axiosClient.get(`/books/${id}`);
    },
    add(data) {
        return axiosClient.post('/books', data);
    },
    borrow(data) {
        return axiosClient.post('/loans', data);
    }
};

export default bookApi;