/* =========================================
   SCRIPT: Homepage.js
   Mục đích: Xử lý logic riêng của Trang Chủ (Danh sách sách, Phân trang, Bảng xếp hạng)
   ========================================= */
import bookApi from '../api/bookAPI.js'; 
import { initSharedUI } from './ShareUI.js'; // Import giao diện chung

// --- CẤU HÌNH ---
const ITEMS_PER_PAGE = 6;       // Số sách mỗi trang
let currentPage = 1;            // Trang hiện tại
let currentCategory = 'Tất cả'; // Danh mục đang chọn
let globalBookList = [];        // Biến lưu trữ danh sách sách từ API

const CATEGORY_MAP = {
    1: 'Hành động',
    2: 'Khoa học viễn tưởng',
    3: 'Lãng mạn',
    4: 'Lịch sử',
    5: 'Tiểu thuyết',
    6: 'Thiếu nhi',
    7: 'Trinh thám'
};

/* =========================================
   1. ENTRY POINT (CHẠY KHI WEB TẢI XONG)
   ========================================= */
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1.1 KHỞI TẠO GIAO DIỆN CHUNG (Header, Footer, Modal, Login/Register)
    initSharedUI(); 

    // 1.2 LOGIC RIÊNG CỦA HOMEPAGE
    const bookContainer = document.getElementById('book-list-container');
    
    // Chỉ chạy logic load sách nếu đang ở trang có chứa container sách
    if (bookContainer) {
        setupCategoryTabs(); // Cài đặt sự kiện click cho các nút danh mục
        await fetchAndRenderBooks(); // Gọi API lấy dữ liệu
    }
});

/* =========================================
   2. LOGIC TƯƠNG TÁC API & DỮ LIỆU
   ========================================= */
async function fetchAndRenderBooks() {
    try {
        const response = await bookApi.getAll(); 
        
        // Xử lý dữ liệu tùy theo cấu trúc trả về của API (mảng trực tiếp hoặc object .data)
        globalBookList = Array.isArray(response) ? response : (response.data || []);

        // Log kiểm tra dữ liệu
        // console.log("Dữ liệu sách:", globalBookList); 
        
        if (globalBookList.length === 0) {
            document.getElementById('book-list-container').innerHTML = 
                `<p style="text-align:center; color:#64748b;">Chưa có dữ liệu sách.</p>`;
            return;
        }

        // Render trang đầu tiên
        loadPage(1);
        
        // Render bảng xếp hạng (Mặc định là Top Reading)
        renderRanking(globalBookList, 'reading');

    } catch (error) {
        console.error("Lỗi lấy dữ liệu sách:", error);
        document.getElementById('book-list-container').innerHTML = 
            `<p style="text-align:center; color:red;">Không thể kết nối đến máy chủ dữ liệu.</p>`;
    }
}

/* =========================================
   3. LOGIC HIỂN THỊ SÁCH (LỌC & PHÂN TRANG)
   ========================================= */
function loadPage(page) {
    currentPage = page;
    
    // 3.1 Lọc dữ liệu theo danh mục
    const filteredBooks = (currentCategory === 'Tất cả') 
        ? globalBookList 
        : globalBookList.filter(book => {
            // Mapping ID thể loại sang Tên thể loại
            const catName = CATEGORY_MAP[book.category_id]; 
            return catName === currentCategory;
        });

    // 3.2 Tính toán phân trang (Cắt mảng)
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const displayBooks = filteredBooks.slice(start, end);
    
    // 3.3 Render ra HTML
    renderBooks(displayBooks);
    renderPagination(filteredBooks.length, page);
}

function renderBooks(bookList) {
    const container = document.getElementById('book-list-container');
    if (!container) return;
    
    container.innerHTML = ''; // Xóa nội dung cũ

    if(bookList.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; margin-top:30px;">
            Không có sách nào thuộc mục "${currentCategory}".
        </p>`;
        return;
    }

    bookList.forEach(book => {
        // --- XỬ LÝ UI ---
        // Badge tồn kho
        let stockBadge = book.stock > 0 
            ? `<span class="badge in-stock">Còn ${book.stock}</span>` 
            : `<span class="badge out-stock">Hết hàng</span>`;
        
        // Tên thể loại
        let categoryName = book.genre || CATEGORY_MAP[book.category_id] || 'Khác';

        // Cắt mô tả ngắn
        let rawDesc = book.description || 'Chưa có mô tả.';
        let shortDesc = rawDesc.length > 80 ? rawDesc.substring(0, 80) + '...' : rawDesc;

        // Format tiền tệ
        let priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price || 0);

        // --- HTML CARD ---
        const html = `
            <div class="book-card">
                <div class="book-thumb">
                    ${stockBadge}
                    <img src="${book.image}" alt="${book.title}" loading="lazy">
                </div>
                <div class="book-details">
                    <h3 class="book-title" title="${book.title}">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    
                    <div class="book-meta">
                        <span class="genre">${categoryName}</span>
                        <span class="rating"><i class="fa-solid fa-star"></i> ${book.rating || 5.0}</span>
                    </div>

                    <p class="book-desc" title="${rawDesc}">${shortDesc}</p>
                    
                    <p class="book-price" style="color: #d9534f; font-weight: bold; margin-top: 5px;">
                        ${priceFormatted}
                    </p>
                </div>
                <div class="book-actions">
                    <button class="btn-text" onclick="viewDetails('${book.book_id}')">Xem chi tiết</button>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function renderPagination(totalItems, activePage) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = ''; 
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    // Helper tạo nút
    const createBtn = (content, targetPage, isActive = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = content;
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.onclick = () => loadPage(targetPage);
        return btn;
    };

    // Nút Previous
    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-left"></i>', activePage > 1 ? activePage - 1 : 1));

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        // Chỉ hiện tối đa 5 nút trang để tránh quá dài (Optional logic)
        if (totalPages > 10 && (i < activePage - 2 || i > activePage + 2) && i !== 1 && i !== totalPages) continue;
        
        paginationContainer.appendChild(createBtn(i, i, i === activePage));
    }

    // Nút Next
    paginationContainer.appendChild(createBtn('<i class="fa-solid fa-chevron-right"></i>', activePage < totalPages ? activePage + 1 : totalPages));
}

function setupCategoryTabs() {
    // Tab Danh mục chính
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            currentCategory = this.innerText.trim();
            loadPage(1); // Reset về trang 1 khi đổi danh mục
        });
    });
    
    // Tab Bảng xếp hạng (Top Reading / Trending)
    const rankTimeBtns = document.querySelectorAll('.ranktime');
    rankTimeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.ranktime.active')?.classList.remove('active');
            this.classList.add('active');

            const type = this.innerText.trim();
            if (type === "Top Reading") {
                renderRanking(globalBookList, 'reading');
            } else if (type === "Trending") {
                renderRanking(globalBookList, 'trending');
            }
        });
    });
}

/* =========================================
   4. LOGIC BẢNG XẾP HẠNG (SIDEBAR)
   ========================================= */
function renderRanking(bookList, criteria = 'reading') {
    const container = document.getElementById('rank-list-container');
    if (!container) return;
    
    container.innerHTML = '';

    // Clone mảng để sort không ảnh hưởng mảng gốc
    let sortedBooks = [...bookList];

    if (criteria === 'reading') {
        // Sắp xếp theo lượt mượn (giả sử field là borrow_count)
        sortedBooks.sort((a, b) => (b.borrow_count || 0) - (a.borrow_count || 0));
    } else {
        // Sắp xếp theo lượt xem (views)
        sortedBooks.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    // Lấy Top 5
    const topBooks = sortedBooks.slice(0, 5);

    topBooks.forEach((book, index) => {
        const statsLabel = criteria === 'reading' 
            ? `${(book.borrow_count || 0).toLocaleString()} lượt mượn`
            : `${(book.views || 0).toLocaleString()} lượt xem`;

        const html = `
            <div class="rank-item">
                <div class="rank-num top-${index + 1}">${index + 1}</div>
                <img src="${book.image}" alt="${book.title}" onclick="viewDetails('${book.book_id}')" style="cursor:pointer">
                <div class="rank-info">
                    <h4 class="btn-text" onclick="viewDetails('${book.book_id}')" style="cursor:pointer">${book.title}</h4>
                    <span class="views">${statsLabel}</span>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

/* =========================================
   5. UTILS (Global Functions)
   ========================================= */
// Gán vào window để HTML onclick gọi được (Do dùng type="module")
window.viewDetails = function(id) {
    // Chuyển hướng sang trang chi tiết kèm ID
    window.location.href = `BookDetail.html?id=${id}`;
};