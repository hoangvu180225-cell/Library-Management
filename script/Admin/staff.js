import adminApi from '../../api/adminAPI.js'; 
import { setupAdminProfile } from '../../script/Admin/dropdown.js'; 

let globalStaff = []; 

// --- CẤU HÌNH QUYỀN HẠN (MOCK) ---
// Trong thực tế, bạn sẽ lấy giá trị này từ localStorage sau khi đăng nhập
// Ví dụ: localStorage.getItem('role')
const CURRENT_USER_ROLE = localStorage.getItem('role') || 'ADMIN'; 
// Mẹo: Mở Console trình duyệt gõ: localStorage.setItem('role', 'STAFF') rồi F5 để test chế độ nhân viên

document.addEventListener('DOMContentLoaded', () => {
    setupAdminProfile();
    fetchStaffs();
    setupModalLogic();
    checkPermissionUI();
});

// 0. Xử lý giao diện dựa trên quyền hạn
function checkPermissionUI() {
    const btnAdd = document.querySelector('.btn-add');
    // Nếu là STAFF thì ẩn nút "Thêm nhân viên"
    if (CURRENT_USER_ROLE !== 'ADMIN' && btnAdd) {
        btnAdd.style.display = 'none';
    }
}

// 1. FETCH API
async function fetchStaffs() {
    try {
        const response = await adminApi.getAllStaffs();
        globalStaff = Array.isArray(response) ? response : (response.data || []);
        renderStaffTable(globalStaff);
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

// 2. RENDER
function renderStaffTable(staffList) {
    const tableBody = document.getElementById('staffTableBody');
    tableBody.innerHTML = '';

    if (!staffList || staffList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Chưa có dữ liệu</td></tr>`;
        return;
    }

    staffList.forEach(staff => {
        // Backend trả về user_id as id
        const id = staff.id || staff.user_id; 

        // === 1. Map Role (Chỉ còn ADMIN và STAFF) ===
        const roleMap = {
            'ADMIN': { label: 'Quản trị viên', class: 'badge-admin' },
            'STAFF': { label: 'Nhân viên', class: 'badge-lib' } 
        };
        const roleInfo = roleMap[staff.role] || { label: staff.role, class: 'badge-lib' };

        // === 2. Map Status ===
        const statusMap = {
            'ACTIVE': { label: 'Hoạt động', class: 'status-active' },
            'RESTRICTED': { label: 'Bị hạn chế', class: 'status-leave' },
            'BANNED': { label: 'Đã khóa', class: 'status-quit' }
        };
        const statusInfo = statusMap[staff.status] || { label: staff.status, class: '' };

        // === 3. Hiển thị Avatar (Chữ cái đầu) ===
        // Đã bỏ upload ảnh, nên mặc định hiển thị chữ cái đầu cho gọn nhẹ
        // Nếu DB vẫn còn link ảnh cũ thì vẫn hiển thị được, nhưng ưu tiên text avatar
        const avatarUrl = staff.avatar && !staff.avatar.startsWith('http') 
             ? `http://localhost:3000${staff.avatar}` 
             : (staff.avatar || null);

        const avatarHtml = avatarUrl
            ? `<img src="${avatarUrl}" class="avatar" alt="avt">`
            : `<div class="avatar">${staff.full_name ? staff.full_name.charAt(0).toUpperCase() : 'U'}</div>`;

        const joinDate = staff.created_at ? new Date(staff.created_at).toLocaleDateString('vi-VN') : '---';

        // === 4. LOGIC PHÂN QUYỀN NÚT BẤM ===
        let actionButtons = '';
        if (CURRENT_USER_ROLE === 'ADMIN') {
            actionButtons = `
                <button class="action-btn btn-edit" onclick="openEditModal('${id}')"><i class="fas fa-pen"></i></button>
                <button class="action-btn btn-delete" onclick="deleteStaff('${id}')"><i class="fas fa-trash"></i></button>
            `;
        } else {
            // Nếu là STAFF thì hiện icon khóa hoặc để trống
            actionButtons = `<span style="color:#999; font-size:0.85rem;"><i class="fas fa-lock"></i> Chỉ xem</span>`;
        }

        const rowHTML = `
            <tr>
                <td>
                    <div class="user-info">
                        ${avatarHtml}
                        <div class="user-detail">
                            <h4>${staff.full_name || 'Chưa đặt tên'}</h4>
                            <span>${staff.email}</span>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${roleInfo.class}">${roleInfo.label}</span></td>
                <td>${staff.phone || '---'}</td>
                <td>${joinDate}</td> 
                <td><span class="${statusInfo.class}"><span class="status-dot"></span>${statusInfo.label}</span></td>
                <td style="text-align:center;">
                    ${actionButtons}
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
}

// 3. LOGIC FORM
function setupModalLogic() {
    const modal = document.getElementById('staffModal');
    const form = document.getElementById('staffForm');
    const btnAdd = document.querySelector('.btn-add');
    const overlay = document.querySelector('.modal-overlay');

    const closeModalInternal = () => {
        if (modal) modal.classList.remove('active');
        if (form) {
            form.reset();
            document.getElementById('staffId').value = ''; 
        }
    };

    document.querySelectorAll('.btn-close-modal').forEach(btn => btn.onclick = closeModalInternal);
    if (overlay) overlay.onclick = closeModalInternal;
    
    // Mở Modal Thêm mới
    if (btnAdd) {
        btnAdd.onclick = () => {
            closeModalInternal();
            document.getElementById('modalTitle').innerText = "Thêm nhân viên mới";
            document.getElementById('btnSaveStaff').innerText = "Lưu nhân viên";
            
            // Set mặc định
            document.getElementById('staffRole').value = 'STAFF';
            document.getElementById('staffStatus').value = 'ACTIVE';
            
            modal.classList.add('active');
        };
    }

    // Submit Form
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const staffId = document.getElementById('staffId').value;
            const isUpdate = !!staffId;

            // Thu thập dữ liệu (JSON thuần)
            const cleanData = {
                full_name: document.getElementById('staffName').value,
                phone: document.getElementById('staffPhone').value,
                email: document.getElementById('staffEmail').value,
                role: document.getElementById('staffRole').value,
                status: document.getElementById('staffStatus').value
            };

            try {
                if (isUpdate) {
                    await adminApi.updateStaff(staffId, cleanData);
                    alert("Cập nhật thành công!");
                } else {
                    // Gửi JSON object trực tiếp
                    await adminApi.createStaff(cleanData);
                    alert("Thêm nhân viên thành công!");
                }
                closeModalInternal();
                fetchStaffs();
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Lỗi: " + (error.response?.data?.message || error.message));
            }
        };
    }
}

// 4. GLOBAL FUNCTIONS
window.openEditModal = (id) => {
    // Kiểm tra quyền lần nữa cho chắc
    if (CURRENT_USER_ROLE !== 'ADMIN') {
        alert("Bạn không có quyền sửa thông tin!");
        return;
    }

    const form = document.getElementById('staffForm');
    if (form) form.reset();

    const staff = globalStaff.find(s => s.id == id);
    if (!staff) return;

    document.getElementById('staffId').value = id;
    document.getElementById('staffName').value = staff.full_name || '';
    document.getElementById('staffPhone').value = staff.phone || '';
    document.getElementById('staffEmail').value = staff.email || '';
    
    // Gán đúng value ENUM
    document.getElementById('staffRole').value = staff.role || 'STAFF';
    document.getElementById('staffStatus').value = staff.status || 'ACTIVE';

    document.getElementById('modalTitle').innerText = "Cập nhật hồ sơ";
    document.getElementById('btnSaveStaff').innerText = "Lưu thay đổi";
    document.getElementById('staffModal').classList.add('active');
};

window.deleteStaff = async (id) => {
    // Kiểm tra quyền
    if (CURRENT_USER_ROLE !== 'ADMIN') {
        alert("Bạn không có quyền xóa nhân viên!");
        return;
    }

    if (!confirm("Xóa nhân viên này?")) return;
    try {
        await adminApi.deleteStaff(id);
        alert("Đã xóa!");
        fetchStaffs();
    } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
};