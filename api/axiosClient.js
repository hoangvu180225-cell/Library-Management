// file: api/axiosClient.js
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor (Bộ đón lõng Request): Tự động gắn Token trước khi gửi
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor (Bộ đón lõng Response): Xử lý lỗi chung (VD: Token hết hạn)
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về data luôn cho gọn (bỏ qua bước response.data ở component)
        return response.data;
    },
    (error) => {
        // Xử lý lỗi chung, ví dụ nếu 401 (Unauthorized) thì đá về trang login
        if (error.response && error.response.status === 401) {
            alert("Vui lòng đăng nhập để thực hiện chức năng!");
            localStorage.removeItem('accessToken');
            window.location.href = '/asset/Homepage/HomePage.html';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;