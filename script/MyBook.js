/* =========================================
   SCRIPT QUẢN LÝ GIAO DIỆN TỦ SÁCH
   (Logic hiển thị & Xử lý sự kiện)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra Dữ liệu đầu vào
    if (typeof books === 'undefined') {
        showError("Lỗi: Không tìm thấy dữ liệu gốc (BookData.js)");
        return;
    }
    if (typeof myCollection === 'undefined') {
        showError("Lỗi: Không tìm thấy dữ liệu người dùng (UserData.js)");
        return;
    }

    // 2. Khởi tạo
    renderMyBooks('all');
    setupFilterTabs();
});

// --- HÀM HIỂN THỊ LỖI ---
function showError(msg) {
    const container = document.getElementById('my-book-container');
    if(container) container.innerHTML = `<p style="color:red; text-align:center; margin-top:20px;">${msg}</p>`;
    console.error(msg);
}

// --- HÀM RENDER CHÍNH ---
function renderMyBooks(filterStatus) {
    const container = document.getElementById('my-book-container');
    if (!container) return;
    container.innerHTML = ''; 

    // Lọc dữ liệu từ UserData
    const filteredCollection = (filterStatus === 'all')
        ? myCollection
        : myCollection.filter(item => item.status === filterStatus);

    if (filteredCollection.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#64748b; margin-top:30px;">Danh sách trống.</p>`;
        return;
    }

    // Duyệt và hiển thị
    filteredCollection.forEach(userBook => {
        // Lấy thông tin chi tiết từ BookData
        const bookInfo = books.find(b => b.id === userBook.bookId);

        if (bookInfo) {
            const html = createBookItemHTML(bookInfo, userBook);
            container.insertAdjacentHTML('beforeend', html);
        }
    });
}

// --- HÀM TẠO HTML CHO TỪNG ITEM (ĐÃ CHỈNH SỬA) ---
function createBookItemHTML(bookInfo, userBook) {
    let statusLabel = '', statusClass = '', dateInfo = '', actionBtn = '';

    switch (userBook.status) {
        case 'borrowed':
            statusClass = 'borrowed';
            statusLabel = 'Đang mượn';
            dateInfo = `<p><i class="fa-regular fa-calendar"></i> Mượn: ${userBook.dateAdded}</p>
                        <p class="due-date"><i class="fa-solid fa-triangle-exclamation"></i> Hạn: ${userBook.dueDate}</p>`;
            // Đã xóa nút Trả sách theo yêu cầu
            actionBtn = ''; 
            break;

        case 'bought':
            statusClass = 'bought';
            statusLabel = 'Đã mua';
            dateInfo = `<p><i class="fa-solid fa-bag-shopping"></i> Mua: ${userBook.dateAdded}</p>`;
            // Đã xóa nút Đọc ngay theo yêu cầu
            actionBtn = '';
            break;

        case 'wishlist':
            statusClass = 'wishlist';
            statusLabel = 'Quan tâm';
            dateInfo = `<p><i class="fa-regular fa-clock"></i> Lưu: ${userBook.dateAdded}</p>`;
            // Cập nhật nút Mượn sách, Thêm nút Mua sách
            actionBtn = `
                <button class="btn-action read" onclick="borrowBook('${bookInfo.title}')">Mượn sách</button>
                <button class="btn-action bought" onclick="buyBook('${bookInfo.title}')">Mua sách</button>
                <button class="btn-action remove" onclick="removeFromList(this)">Xóa</button>
            `;
            break;
    }

    return `
        <div class="my-book-item">
            <img src="${bookInfo.image}" alt="${bookInfo.title}" onerror="this.src='../../images/default.jpg'">
            <div class="item-info">
                <h3>${bookInfo.title}</h3>
                <p class="author">${bookInfo.author}</p>
                <div class="item-meta">${dateInfo}</div>
            </div>
            <div class="item-actions">
                <span class="status-badge ${statusClass}">${statusLabel}</span>
                ${actionBtn}
            </div>
        </div>
    `;
}

// --- CÁC HÀM SỰ KIỆN (ĐÃ CẬP NHẬT) ---
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelector('.tab-btn.active')?.classList.remove('active');
            this.classList.add('active');
            renderMyBooks(this.getAttribute('data-status'));
        });
    });
}

// Hàm xử lý Mượn sách mới
function borrowBook(title) { 
    alert(`Đã tạo phiếu mượn cho sách: ${title}. Vui lòng kiểm tra email.`); 
}

// Hàm xử lý Mua sách mới
function buyBook(title) { 
    alert(`Mua thành công sách: ${title}. Cảm ơn bạn đã ủng hộ!`); 
}

function removeFromList(btn) {
    if(confirm('Xóa sách này khỏi danh sách quan tâm?')) {
        const item = btn.closest('.my-book-item');
        item.style.opacity = '0';
        setTimeout(() => item.remove(), 300);
    }
}