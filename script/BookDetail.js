// 1. Import service
import bookApi from './services/bookApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (!bookId) {
        window.location.href = 'index.html';
        return;
    }

    // Hiển thị trạng thái đang tải (Loading)
    const container = document.querySelector('.book-container');
    
    try {
        // 2. GỌI API THAY VÌ DÙNG MẢNG CỨNG
        const response = await bookApi.getById(bookId);
        const book = response.data; // Giả định server trả về object sách trực tiếp

        if (book) {
            renderBookInfo(book);
        }
    } catch (error) {
        // 3. Xử lý khi không tìm thấy sách hoặc lỗi server
        console.error("Lỗi lấy chi tiết sách:", error);
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Không tìm thấy sách!</h2>
                <p>Có thể sách này không tồn tại hoặc lỗi kết nối.</p>
                <a href="index.html" style="color: blue; text-decoration: underline;">Quay lại trang chủ</a>
            </div>
        `;
    }
});

function renderBookInfo(book) {
    // Giữ nguyên các logic DOM của bạn, nhưng lưu ý:
    // Nếu API đã trả về giá (price), hãy dùng book.price thay vì fakePrice.
    
    document.title = `${book.title} - Chi tiết sách`;
    document.getElementById('detail-image').src = book.image;
    document.getElementById('detail-title').textContent = book.title;
    
    // ... các phần khác giữ nguyên ...

    // Cập nhật tồn kho dựa trên dữ liệu thật từ Server
    const stockEl = document.getElementById('detail-stock');
    if (book.stock > 0) {
        stockEl.innerHTML = `<i class="fa-solid fa-check-circle" style="color: green;"></i> Còn hàng (${book.stock})`;
        // Mở khóa nút bấm nếu có hàng
        document.querySelectorAll('.btn-cart, .btn-buy').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    } else {
        stockEl.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: red;"></i> Tạm hết hàng`;
        document.querySelectorAll('.btn-cart, .btn-buy').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    }
}