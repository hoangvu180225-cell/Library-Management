/* =========================================
   SCRIPT: BookDetail.js
   ========================================= */
import bookApi from '../api/bookAPI.js';
import transactionApi from '../api/transactionAPI.js';
import { initSharedUI } from './ShareUI.js'; 

document.addEventListener('DOMContentLoaded', async () => {
    
    initSharedUI(); 

    // 2. LOGIC RIÊNG CỦA TRANG CHI TIẾT
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    // Kiểm tra ID sách
    if (!bookId) {
        // Sửa lại đường dẫn cho đúng
        window.location.href = 'HomePage.html'; 
        return;
    }

    // Gọi API lấy dữ liệu và Render
    try {
        const response = await bookApi.getById(bookId);
        // Tăng tính tương thích: hỗ trợ cả {data: ...} và trả về thẳng object
        const book = response.data || response; 

        if (book) {
            renderBookInfo(book);
            // Gán sự kiện cho các nút bấm sau khi đã có bookId
            setupActionButtons(bookId);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        document.querySelector('.book-container').innerHTML = `
            <div style="text-align: center; padding: 100px 20px; width: 100%;">
                <h2 style="color: #d9534f;">Không tìm thấy sách!</h2>
                <p>Sách bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <a href="HomePage.html" class="btn btn-primary" style="margin-top:20px; display:inline-block;">Về trang chủ</a>
            </div>
        `;
    }
});

// --- HÀM GÁN SỰ KIỆN CHO NÚT BẤM ---
function setupActionButtons(bookId) {
    // Nút Mượn
    const btnBorrow = document.getElementById('btn-borrow');
    if (btnBorrow) {
        btnBorrow.addEventListener('click', async () => {
            try {
                await transactionApi.borrowBook(bookId);
                alert("Đã gửi yêu cầu mượn thành công!");
                location.reload(); 
            } catch (error) {
                alert(error.response?.data?.message || "Lỗi mượn sách");
            }
        });
    }

    // Nút Mua
    const btnBuy = document.getElementById('btn-buy');
    if (btnBuy) {
        btnBuy.addEventListener('click', async () => {
            if (confirm("Bạn muốn mua cuốn sách này?")) {
                try {
                    await transactionApi.buyBook(bookId);
                    alert("Mua thành công! Kiểm tra trong tủ sách của bạn.");
                    window.location.href = 'MyBook.html';
                } catch (error) {
                    console.error("Lỗi mua sách:", error); 
                    const msg = error.response?.data?.message || error.message || "Giao dịch thất bại.";
                    alert(msg);
                }
            }
        });
    }

    // Nút Thêm vào tủ (Quan tâm)
    const btnCart = document.getElementById('btn-cart');
    if (btnCart) {
        btnCart.addEventListener('click', async () => {
            try {
                await transactionApi.addToLibrary(bookId);
                alert("Đã thêm vào danh sách quan tâm!");
            } catch (error) {
                alert("Không thể thêm vào tủ sách. (Có thể bạn chưa đăng nhập)");
            }
        });
    }
}

// --- HÀM RENDER CHI TIẾT SÁCH ---
function renderBookInfo(book) {
    document.title = `${book.title} - Thư viện Online`;
    const imgElement = document.getElementById('detail-image');
    // Sửa lại đường dẫn ảnh mặc định nếu cần
    if (imgElement) imgElement.src = book.image || '../../assets/images/default-book.png';

    setText('detail-title', book.title);
    setText('detail-author', book.author);
    setText('detail-views', book.views || 0);

    renderStars(book.rating || 0);

    // Xử lý Giá tiền
    const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price || 0);
    setText('detail-price', priceFormatted);
    
    // Giả lập giá cũ để hiển thị giảm giá cho đẹp
    const fakeOldPrice = (book.price || 0) * 1.25; 
    const oldPriceEl = document.getElementById('detail-old-price');
    const discountEl = document.getElementById('detail-discount');
    
    if (oldPriceEl && discountEl && book.price > 0) {
        oldPriceEl.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fakeOldPrice);
        oldPriceEl.style.display = 'inline-block';
        discountEl.style.display = 'inline-block';
        discountEl.textContent = '-20%';
    } else {
        if(oldPriceEl) oldPriceEl.style.display = 'none';
        if(discountEl) discountEl.style.display = 'none';
    }

    // Thông tin chi tiết bảng
    setText('info-isbn', book.isbn || "Chưa có ISBN");
    setText('info-genre', book.category_name || "Đang cập nhật");
    setText('info-author-table', book.author); 
    setText('info-publisher', book.publisher || "Đang cập nhật"); 
    setText('info-year', book.publication_year || "---");
    setText('info-format', book.book_format || "Bìa mềm");

    // Breadcrumb (Đường dẫn)
    setText('crumb-title', book.title);
    const crumbGenre = document.getElementById('crumb-genre');
    if(crumbGenre) crumbGenre.textContent = book.category_name || "Sách";

    // Mô tả
    const descEl = document.getElementById('detail-desc');
    if (descEl) {
        descEl.innerHTML = book.description 
            ? book.description.replace(/\n/g, '<br>') 
            : "<em>Chưa có mô tả chi tiết.</em>";
    }

    // Tồn kho và Trạng thái nút
    const stockEl = document.getElementById('detail-stock');
    const btnIds = ['btn-borrow', 'btn-buy', 'btn-cart'];

    if (stockEl) {
        if (book.stock > 0) {
            stockEl.innerHTML = `<i class="fa-solid fa-check-circle" style="color: #28a745;"></i> Còn hàng (Kho: ${book.stock})`;
            stockEl.style.color = "#28a745";
            btnIds.forEach(id => {
                const btn = document.getElementById(id);
                if(btn) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
            });
        } else {
            stockEl.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: #dc3545;"></i> Hết hàng`;
            stockEl.style.color = "#dc3545";
            btnIds.forEach(id => {
                const btn = document.getElementById(id);
                if(btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
            });
        }
    }
}

function renderStars(rating) {
    setText('detail-rating', rating); 
    setText('review-score-big', `${rating}/5`); 

    let starsHtml = '';
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
        starsHtml += i <= roundedRating 
            ? '<i class="fa-solid fa-star" style="color: #FFD43B;"></i>' 
            : '<i class="fa-solid fa-star" style="color: #ccc;"></i>';
    }

    const headerStars = document.getElementById('header-stars');
    if (headerStars) headerStars.innerHTML = starsHtml;

    const reviewStars = document.getElementById('review-stars');
    if (reviewStars) reviewStars.innerHTML = starsHtml;
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}