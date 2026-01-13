import axiosClient from './axiosClient.js';

const reviewApi = {
    // 1. Lấy danh sách đánh giá của một cuốn sách theo ID sách
    getReviewsByBookId(bookId) {
        const url = `/reviews/${bookId}`;
        return axiosClient.get(url);
    },

    // 2. Viết đánh giá cho sách
    createReview(bookId, reviewData) {
        const url = `/reviews/${bookId}`;
        return axiosClient.post(url, reviewData);
    }
};

export default reviewApi;