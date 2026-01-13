// File: detail.js (hoặc script trong file html)
import bookApi from '../api/bookAPI';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    // Nếu không có ID trên URL thì đá về trang chủ
    if (!bookId) {
        window.location.href = '/asset/Homepage/HomePage.html';
        return;
    }

    const container = document.querySelector('.book-container');
    
    try {
        // Gọi API lấy dữ liệu thật
        const response = await bookApi.getById(bookId);
        
        // Tùy cấu trúc trả về của axios/backend mà lấy data cho đúng
        // Nếu backend trả về trực tiếp object: const book = response.data;
        const book = response.data || response; 

        if (book) {
            renderBookInfo(book);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        // Giao diện lỗi khi không tìm thấy sách
        document.querySelector('main').innerHTML = `
            <div style="text-align: center; padding: 100px 20px;">
                <h2 style="color: #d9534f;">Không tìm thấy sách!</h2>
                <p>Sách bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <a href="index.html" class="btn btn-primary">Về trang chủ</a>
            </div>
        `;
    }
});

function renderBookInfo(book) {
    // 1. Cập nhật Tiêu đề trang web
    document.title = `${book.title} - Thư viện Online`;

    // 2. Mapping Ảnh & Thông tin cơ bản
    // Lưu ý: Kiểm tra nếu ảnh null thì dùng ảnh mặc định
    const imageUrl = book.image ? book.image : 'assets/images/default-book.png';
    document.getElementById('detail-image').src = imageUrl;
    
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = book.author;
    
    // Hiển thị thể loại (Nếu backend có join bảng Categories)
    const categoryName = book.category_name || "Đang cập nhật";
    const catEl = document.getElementById('detail-category');
    if(catEl) catEl.textContent = categoryName;

    // 3. Xử lý GIÁ TIỀN (Format sang VND: 50000 -> 50.000 đ)
    const priceFormatted = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(book.price);
    
    document.getElementById('detail-price').textContent = priceFormatted;

    // 4. Xử lý MÔ TẢ (Cho phép xuống dòng nếu có thẻ <br> hoặc \n)
    const descEl = document.getElementById('detail-desc');
    // Nếu trong DB lưu \n thì convert sang <br> để hiển thị đẹp
    descEl.innerHTML = book.description ? book.description.replace(/\n/g, '<br>') : "Chưa có mô tả cho sách này.";

    // 5. Render SAO ĐÁNH GIÁ (Rating)
    // Ví dụ: rating = 4 -> Hiện 4 sao vàng, 1 sao xám
    renderStars(book.rating || 0);

    // 6. Xử lý TỒN KHO (Logic cũ của bạn)
    const stockEl = document.getElementById('detail-stock');
    const btnGroups = document.querySelectorAll('.btn-add-cart, .btn-buy-now'); // Class nút mua của bạn

    if (book.stock > 0) {
        stockEl.innerHTML = `<i class="fa-solid fa-check-circle" style="color: green;"></i> Còn hàng (Sl: ${book.stock})`;
        btnGroups.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
    } else {
        stockEl.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: red;"></i> Hết hàng`;
        btnGroups.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }
}

// Hàm phụ trợ: Render Sao (Star Rating)
function renderStars(rating) {
    const starContainer = document.getElementById('detail-rating'); // Cần có thẻ div id="detail-rating" trong HTML
    if (!starContainer) return;

    let html = '';
    // Làm tròn số sao (VD: 4.8 -> 5, 4.2 -> 4) hoặc lấy phần nguyên
    const stars = Math.round(rating); 

    for (let i = 1; i <= 5; i++) {
        if (i <= stars) {
            html += '<i class="fa-solid fa-star" style="color: #FFD43B;"></i>'; // Sao vàng
        } else {
            html += '<i class="fa-regular fa-star" style="color: #ccc;"></i>';   // Sao xám
        }
    }
    // Thêm số điểm bên cạnh (VD: 4.5/5)
    html += ` <span style="color: #666; font-size: 0.9em;">(${rating}/5)</span>`;
    
    starContainer.innerHTML = html;
}