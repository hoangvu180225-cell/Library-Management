import axiosClient from './axiosClient.js';

const transactionApi = {
    // 1. Thêm vào Tủ sách (Wishlist)
    addToLibrary(bookId) {
        const url = '/transaction/add';
        // SỬA: bookId (tham số) -> gán cho bookID (backend cần)
        return axiosClient.post(url, { bookID: bookId }); 
    },

    // 2. Lấy danh sách
    getLibrary(params) { 
        const url = '/transaction';
        // Truyền object params vào axios để backend nhận được req.query
        return axiosClient.get(url, { params: params });
    },

    // 3. Mượn sách
    borrowBook(bookId) {
        const url = '/transaction/loans';
        // SỬA:
        return axiosClient.post(url, { bookID: bookId });
    },

    // 4. Mua sách (LỖI CỦA BẠN NẰM Ở ĐÂY)
    buyBook(bookId) {
        const url = '/transaction/buy';
        // SỬA: Truyền object tường minh { key_backend: value_frontend }
        return axiosClient.post(url, { bookID: bookId });
    },

    // 5. Xóa
    deleteTransaction(id) {
        const url = `/transaction/${id}`;
        return axiosClient.delete(url);
    },

    // 6. Cập nhật trạng thái (Dùng để TRẢ SÁCH)
    // Script gọi: updateStatus(id, { status: 'RETURNED', return_date: ... })
    updateStatus(id, data) {
        const url = `/transaction/${id}`;
        // Dùng PUT hoặc PATCH tùy backend qui định cho việc update
        return axiosClient.put(url, data); 
    }
};

export default transactionApi;  