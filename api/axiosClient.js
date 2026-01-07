// file: api/axiosClient.js
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Chỉ cần sửa 1 chỗ này nếu Server đổi địa chỉ
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
            alert("Phiên đăng nhập hết hạn!");
            localStorage.removeItem('accessToken');
            window.location.href = '/login.html';
        }
        return Promise.reject(error);
    }
);

// Export ra để dùng (nếu dùng module) hoặc gán vào window (nếu dùng HTML thuần)
// window.axiosClient = axiosClient; 
export default axiosClient;