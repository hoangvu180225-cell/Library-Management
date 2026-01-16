// file: api/axiosClient.js
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Đảm bảo port này đúng với Server của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 1. REQUEST INTERCEPTOR (Gửi đi) ---
// Tự động gắn Token vào Header trước khi gửi request
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- 2. RESPONSE INTERCEPTOR (Nhận về) ---
// Xử lý dữ liệu trả về và bắt lỗi tự động
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về thẳng data cho gọn (bỏ qua bước .data ở file gọi)
        return response.data;
    },
    (error) => {
        // Kiểm tra nếu lỗi là 401 (Chưa đăng nhập) hoặc 403 (Token hết hạn/Không có quyền)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Thông báo cho người dùng
            alert("Bạn cần đăng nhập để thực hiện thao tác này!");

            // Xóa sạch Token và Thông tin User cũ
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userInfo');

            // Chuyển hướng về Trang chủ (đường dẫn dựa theo cấu trúc folder của bạn)
            window.location.href = '/asset/Homepage/HomePage.html';
        }
        
        // Trả lỗi về để hàm gọi (try/catch) có thể xử lý tiếp nếu cần
        return Promise.reject(error);
    }
);

export default axiosClient;