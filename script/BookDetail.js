// script/bookDetail.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy ID từ URL (ví dụ: detail.html?id=ACT1)
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    // 2. Tìm sách trong mảng 'books' (được load từ booksData.js)
    const book = books.find(b => b.id === bookId);

    if (book) {
        renderBookInfo(book);
    } else {
        // Xử lý khi không tìm thấy sách (hoặc id sai)
        document.querySelector('.book-container').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Không tìm thấy sách!</h2>
                <p>Có thể sách này không tồn tại hoặc đã bị xóa.</p>
                <a href="index.html" style="color: blue; text-decoration: underline;">Quay lại trang chủ</a>
            </div>
        `;
    }
});

function renderBookInfo(book) {
    // --- CẬP NHẬT HÌNH ẢNH & TIÊU ĐỀ ---
    document.title = `${book.title} - Chi tiết sách`; // Title tab trình duyệt
    document.getElementById('detail-image').src = book.image;
    document.getElementById('detail-title').textContent = book.title;
    
    // --- CẬP NHẬT BREADCRUMB ---
    document.getElementById('crumb-genre').textContent = book.genre;
    document.getElementById('crumb-title').textContent = book.title;

    // --- CẬP NHẬT THÔNG TIN CƠ BẢN ---
    document.getElementById('detail-author').textContent = book.author;
    document.getElementById('detail-rating').textContent = book.rating;
    document.getElementById('review-score-big').textContent = book.rating + "/5";
    
    // Format lượt xem có dấu chấm (ví dụ: 12.500)
    document.getElementById('detail-views').textContent = book.views.toLocaleString('vi-VN');

    // --- XỬ LÝ GIÁ (Vì data không có giá, ta tự tạo giá dựa trên rating hoặc random để demo) ---
    // Giả sử giá gốc từ 100k đến 300k
    const fakePrice = (book.views % 200) * 1000 + 100000; 
    const discount = 0.2; // Giảm 20%
    const currentPrice = fakePrice * (1 - discount);

    document.getElementById('detail-price').textContent = currentPrice.toLocaleString('vi-VN') + ' đ';
    document.getElementById('detail-old-price').textContent = fakePrice.toLocaleString('vi-VN') + ' đ';

    // --- XỬ LÝ TỒN KHO ---
    const stockEl = document.getElementById('detail-stock');
    if (book.stock > 0) {
        stockEl.innerHTML = `<i class="fa-solid fa-check-circle" style="color: green;"></i> Còn hàng (Số lượng: ${book.stock})`;
        stockEl.style.color = '#28a745';
    } else {
        stockEl.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: red;"></i> Tạm hết hàng`;
        stockEl.style.color = 'red';
        // Vô hiệu hóa nút mua nếu hết hàng
        document.querySelector('.btn-cart').disabled = true;
        document.querySelector('.btn-buy').disabled = true;
        document.querySelector('.btn-cart').style.opacity = '0.5';
        document.querySelector('.btn-buy').style.opacity = '0.5';
    }

    // --- CẬP NHẬT MÔ TẢ & BẢNG CHI TIẾT ---
    document.getElementById('detail-desc').textContent = book.desc;
    document.getElementById('info-id').textContent = book.id;
    document.getElementById('info-genre').textContent = book.genre;
    document.getElementById('info-author').textContent = book.author;
}

// Hàm thêm vào giỏ hàng (Demo)
function addToCart() {
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}