import axiosClient from './axiosClient.js';

const transactionApi = {
    // 1. Thêm vào Tủ sách cá nhân
    addToLibrary(bookID) {
        const url = '/api/transaction/add';
        return axiosClient.post(url, { bookID });
    },

    // 2. Mở tủ sách (Lấy danh sách sách cá nhân)
    getLibrary() {
        const url = '/api/transaction';
        return axiosClient.get(url);
    },

    // 3. Mượn sách
    borrowBook(bookID) {
        const url = '/api/transaction/loans';
        return axiosClient.post(url, { bookID });
    },

    // 4. Mua sách
    buyBook(bookID) {
        const url = '/api/transaction/buy';
        return axiosClient.post(url, { bookID });
    },

    // 5. Xóa sách khỏi tủ sách/giao dịch
    deleteTransaction(id) {
        const url = `/api/transaction/${id}`;
        return axiosClient.delete(url);
    }
};

export default transactionApi;