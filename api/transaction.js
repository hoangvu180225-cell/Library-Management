import axiosClient from './axiosClient';

const transactionApi = {
    // 1. Thêm vào Tủ sách cá nhân
    addToPersonalLibrary(bookId) {
        return axiosClient.post('/transaction/add', { bookID: bookId });
    },

    // 2. Mở tủ sách (Lấy danh sách cá nhân)
    getMyLibrary() {
        return axiosClient.get('/transaction');
    },

    // 3. Mượn sách
    borrowBook(bookId) {
        return axiosClient.post('/transaction/loans', { bookID: bookId });
    },

    // 4. Mua sách
    buyBook(bookId) {
        return axiosClient.post('/transaction/buy', { bookID: bookId });
    },

    // 5. Xóa sách khỏi tủ cá nhân
    removeFromLibrary(transactionId) {
        return axiosClient.delete(`/transaction/${transactionId}`);
    }
};

export default transactionApi;