/* =========================================
   QUẢN LÝ SÁCH (ADMIN) - SỬ DỤNG IMPORT API
   ========================================= */
import bookApi from '../../api/bookAPI.js'; // Đường dẫn trỏ về file API của bạn

let globalBooks = []; 

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    setupModalLogic();
});

// --- 1. GỌI API (Sạch sẽ hơn nhiều) ---
async function fetchBooks() {
    try {
        // Gọi qua function đã gói sẵn, không cần quan tâm URL là gì
        const response = await bookApi.getAll(); 
        
        // Tùy vào cách bookApi trả về, có thể cần response.data hoặc response
        globalBooks = Array.isArray(response) ? response : (response.data || []);
        
        renderBooks(globalBooks);
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi tải dữ liệu: " + error.message);
    }
}

// --- 2. RENDER UI (Giữ nguyên) ---
function renderBooks(books) {
    const gridContainer = document.getElementById('bookGrid');
    const listContainer = document.getElementById('bookListBody');

    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';

    books.forEach(book => {
        // --- 1. SỬA QUAN TRỌNG: Lấy đúng ID từ Database ---
        // API MySQL thường trả về 'book_id', còn json-server thì là 'id'
        // Dòng này đảm bảo lấy được ID dù backend trả về tên gì
        const id = book.book_id || book.id; 

        // Kiểm tra ngay tại đây, nếu id vẫn null thì báo lỗi để biết
        if (!id) console.error("Lỗi: Sách thiếu ID (book_id)", book);

        // Lấy các trường còn lại
        const { title, author, price, stock } = book; 

        // Xử lý link ảnh
        const imgUrl = book.image && !book.image.startsWith('http') 
            ? `http://localhost:3000/${book.image}` 
            : (book.image || 'https://via.placeholder.com/200x300');

        // --- 2. SỬA QUAN TRỌNG: Thêm dấu nháy đơn '' vào onclick ---
        // Cũ: openEditModal(${id}) -> Nếu id là chuỗi "ISBN1" nó sẽ lỗi
        // Mới: openEditModal('${id}') -> An toàn tuyệt đối

        // RENDER GRID
        const gridHTML = `
            <div class="book-card">
                <div class="book-cover-container">
                    <img src="${imgUrl}" class="book-cover-img">
                </div>
                <div class="book-info">
                    <h4 class="book-title">${title}</h4>
                    <span class="book-author">${author}</span>
                    <div style="color: #d9534f; font-weight: bold;">
                        ${Number(price).toLocaleString('vi-VN')} đ
                    </div>
                </div>
                <div class="book-actions">
                    <button class="btn-card-action" onclick="openEditModal('${id}')"><i class="fas fa-pen"></i></button>
                    <button class="btn-card-action" onclick="deleteBook('${id}')" style="color:#e74c3c"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
        gridContainer.insertAdjacentHTML('beforeend', gridHTML);

        // RENDER LIST
        const rowHTML = `
            <tr>
                <td>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <img src="${imgUrl}" class="list-cover">
                        <div><h4 style="margin:0;">${title}</h4><span>${author}</span></div>
                    </div>
                </td>
                <td>${Number(price).toLocaleString('vi-VN')} đ</td>
                <td>${stock || 0}</td> 
                <td style="text-align:center;">
                    <button class="btn-card-action" onclick="openEditModal('${id}')"><i class="fas fa-pen"></i></button>
                    <button class="btn-card-action" onclick="deleteBook('${id}')" style="color:#e74c3c"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
        listContainer.insertAdjacentHTML('beforeend', rowHTML);
    });
}

// --- 3. LOGIC FORM (Dùng bookApi thay vì fetch) ---
function setupModalLogic() {
    const modal = document.getElementById('addBookModal');
    const form = document.getElementById('addBookForm');
    const fileInput = document.getElementById('bookCoverInput');
    const uploadBox = document.getElementById('uploadBoxTrigger');
    const overlay = document.querySelector('.modal-overlay');
    
    // --- 1. KHAI BÁO HÀM ĐÓNG MODAL (Dùng nội bộ) ---
    const closeModalInternal = () => {
        if (modal) modal.classList.remove('active');
        if (form) {
            form.reset(); // Xóa dữ liệu cũ
            document.getElementById('bookId').value = ''; // Reset ID
            if (document.getElementById('fileNameDisplay')) {
                document.getElementById('fileNameDisplay').innerText = "Kéo thả ảnh hoặc nhấn để tải lên";
            }
        }
    };

    // --- 2. GÁN SỰ KIỆN ĐÓNG (Nút X, Nút Hủy, Overlay) ---
    const closeBtns = document.querySelectorAll('.btn-close-modal');
    closeBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault(); 
            closeModalInternal();
        };
    });

    if (overlay) {
        overlay.onclick = closeModalInternal;
    }

    // --- 3. XỬ LÝ MỞ MODAL (Nút Thêm Mới) ---
    const btnOpen = document.getElementById('btnOpenAddModal');
    if (btnOpen) {
        btnOpen.onclick = () => {
            closeModalInternal(); // Reset sạch trước khi mở
            document.getElementById('modalTitle').innerText = "Thêm sách mới";
            modal.classList.add('active');
        };
    }

    // --- 4. XỬ LÝ CLICK UPLOAD ẢNH ---
    if (uploadBox && fileInput) {
        uploadBox.onclick = () => fileInput.click();
        
        fileInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                document.getElementById('fileNameDisplay').innerText = e.target.files[0].name;
            }
        };
    }

    // --- 5. XỬ LÝ SUBMIT FORM (QUAN TRỌNG) ---
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const bookId = document.getElementById('bookId').value;
            const isUpdate = !!bookId;

            // --- A. LẤY & LÀM SẠCH DỮ LIỆU CƠ BẢN ---
            const rawCategory = document.getElementById('bookCategory').value;
            const REVERSE_CATEGORY_MAP = {
                'Hành động': 1, 'Khoa học viễn tưởng': 2, 'Lãng mạn': 3,
                'Lịch sử': 4, 'Tiểu thuyết': 5, 'Thiếu nhi': 6, 'Trinh thám': 7
            };
            const categoryId = REVERSE_CATEGORY_MAP[rawCategory] || null;

            // Xử lý số (nếu rỗng thì về 0 để tránh lỗi DB)
            const stockVal = document.getElementById('bookQuantity').value;
            const priceVal = document.getElementById('bookPrice').value;

            // Gom nhóm dữ liệu Text
            const cleanData = {
                isbn: document.getElementById('bookIsbn').value || '',
                title: document.getElementById('bookName').value || '',
                author: document.getElementById('bookAuthor').value || '',
                description: document.getElementById('bookDesc').value || '',
                publisher: document.getElementById('bookPub').value || '',
                publication_year: document.getElementById('bookYear').value || '',
                book_format: document.getElementById('bookType').value || '',
                category_id: categoryId,
                stock: stockVal ? stockVal : 0, 
                price: priceVal ? priceVal : 0
            };

            // --- B. LẤY DỮ LIỆU ẢNH ---
            const imageLink = document.getElementById('bookImageLink').value.trim();
            const imageFile = fileInput.files[0];

            try {
                if (isUpdate) {
                    // === TRƯỜNG HỢP UPDATE (Gửi JSON) ===
                    const updateData = { ...cleanData };
                    
                    // Nếu có link ảnh mới thì gửi kèm
                    // Lưu ý: Update thường backend nhận key 'image' bình thường vì không qua Multer upload
                    if (imageLink) updateData.image = imageLink; 

                    await bookApi.update(bookId, updateData);
                    alert("Cập nhật thông tin sách thành công!");

                } else {
                    // === TRƯỜNG HỢP CREATE (Gửi FormData) ===
                    const formData = new FormData();
                    
                    // 1. Append Text Data
                    Object.keys(cleanData).forEach(key => {
                        if (cleanData[key] !== null && cleanData[key] !== undefined) {
                            formData.append(key, cleanData[key]);
                        }
                    });

                    // 2. Append Image (LOGIC QUAN TRỌNG NHẤT)
                    if (imageFile) {
                        // Nếu có File -> Dùng key 'image' (cho Multer xử lý)
                        formData.append('image', imageFile); 
                    } else if (imageLink) {
                        // Nếu là Link -> Dùng key 'image_link' (để Multer bỏ qua, Controller tự lấy)
                        formData.append('image_link', imageLink);
                    }

                    await bookApi.create(formData);
                    alert("Thêm sách mới thành công!");
                }

                // Thành công thì đóng modal và tải lại danh sách
                closeModalInternal();
                fetchBooks();

            } catch (error) {
                console.error("Lỗi Submit:", error);
                const msg = error.response?.data?.message || error.message;
                alert("Lỗi: " + msg);
            }
        };
    }
}

// --- 4. CÁC HÀM GLOBAL ---
// Gán vào window để HTML gọi được onclick
window.openEditModal = (id) => {
    const form = document.getElementById('addBookForm');
    if (form) form.reset();
    // 1. Tìm sách (Dùng == để bắt cả trường hợp id là string hay number)
    const book = globalBooks.find(b => b.id == id || b.book_id == id);
    if (!book) {
        console.error("Không tìm thấy sách có ID:", id);
        return;
    }

    // --- DÒNG QUAN TRỌNG NHẤT BẠN ĐANG THIẾU ---
    // Phải gán ID vào ô ẩn, nếu không lúc bấm Lưu nó sẽ không biết sửa ai
    document.getElementById('bookId').value = id; 
    // --------------------------------------------

    const CATEGORY_MAP = {
        1: 'Hành động',
        2: 'Khoa học viễn tưởng',
        3: 'Lãng mạn',
        4: 'Lịch sử',
        5: 'Tiểu thuyết',
        6: 'Thiếu nhi',
        7: 'Trinh thám'
    };
    
    // Fallback: Nếu không map được thì lấy chính cái id hoặc chuỗi rỗng
    const category_name = CATEGORY_MAP[book.category_id] || book.category || '';

    // 2. Điền dữ liệu (Thêm || '' để tránh lỗi hiện chữ "undefined" hoặc "null" lên ô input)
    document.getElementById('bookIsbn').value = book.isbn || '';
    document.getElementById('bookName').value = book.title || '';
    document.getElementById('bookAuthor').value = book.author || '';
    document.getElementById('bookDesc').value = book.description || '';
    
    // Kiểm tra xem các ID này có đúng trong HTML không nhé (bookPub, bookYear...)
    document.getElementById('bookPub').value = book.publisher || ''; 
    document.getElementById('bookYear').value = book.publication_year || '';
    document.getElementById('bookType').value = book.book_format || '';
    
    // Kiểm tra lại biến total_stock hay stock trong console.log(globalBooks)
    document.getElementById('bookQuantity').value = book.stock || 0;
    
    document.getElementById('bookCategory').value = category_name;
    document.getElementById('bookPrice').value = book.price || 0;
    document.getElementById('bookImageLink').value = book.image || '';

    // 3. Cập nhật UI
    document.getElementById('modalTitle').innerText = "Cập nhật sách";
    
    // Reset thông báo file ảnh
    const fileMsg = document.getElementById('fileNameDisplay');
    if(fileMsg) fileMsg.innerText = book.image ? "Đang dùng ảnh hiện tại" : "Chưa có ảnh";

    document.getElementById('addBookModal').classList.add('active');
};

window.deleteBook = async (id) => {
    if(!confirm("Xóa sách này?")) return;
    try {
        await bookApi.delete(id); // Gọi qua API Wrapper
        alert("Đã xóa!");
        fetchBooks();
    } catch (error) {
        alert("Lỗi xóa: " + error.message);
    }
};