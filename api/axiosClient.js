import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.2/+esm';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const { response } = error;

        if (response) {
            // --- TRƯỜNG HỢP 401: CHƯA ĐĂNG NHẬP / TOKEN HẾT HẠN ---
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userInfo');
                window.location.href = '/asset/Homepage/HomePage.html';
            }

            // --- TRƯỜNG HỢP 403: SAI QUYỀN HẠN (Ví dụ: STAFF vào vùng ADMIN) ---
            if (response.status === 403) {              
                // Trả về một Promise không lỗi quá nghiêm trọng để trang hiện tại không bị sập
                return Promise.reject(error); 
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;