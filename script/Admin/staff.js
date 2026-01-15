import adminApi from '../../api/adminApi.js'; 

let globalStaff = []; 

document.addEventListener('DOMContentLoaded', () => {
    fetchStaffs();
    setupModalLogic();
});

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
        // Backend đã select user_id as id, nên dùng staff.id là ổn
        const id = staff.id || staff.user_id; 

        // === UPDATE 1: Map Role theo DB ENUM ===
        const roleMap = {
            'ADMIN': { label: 'Quản trị viên', class: 'badge-admin' },
            'LIBRARIAN': { label: 'Thủ thư', class: 'badge-lib' },
            'STOCK_MANAGER': { label: 'Quản lý kho', class: 'badge-stock' }
        };
        // Fallback nếu không khớp
        const roleInfo = roleMap[staff.role] || { label: staff.role, class: 'badge-lib' };

        // === UPDATE 2: Map Status theo DB ENUM ===
        const statusMap = {
            'ACTIVE': { label: 'Hoạt động', class: 'status-active' },
            'RESTRICTED': { label: 'Bị hạn chế', class: 'status-leave' }, // Tạm dùng màu cam
            'BANNED': { label: 'Đã khóa', class: 'status-quit' }
        };
        const statusInfo = statusMap[staff.status] || { label: staff.status, class: '' };

        // Xử lý Avatar
        const avatarUrl = staff.avatar && !staff.avatar.startsWith('http') 
            ? `http://localhost:3000${staff.avatar}` 
            : (staff.avatar || null);
            
        const avatarHtml = avatarUrl
            ? `<img src="${avatarUrl}" class="avatar" alt="avt" style="object-fit:cover;">`
            : `<div class="avatar">${staff.full_name ? staff.full_name.charAt(0).toUpperCase() : 'U'}</div>`;

        // === UPDATE 3: Dùng created_at thay vì hire_date ===
        const joinDate = staff.created_at ? new Date(staff.created_at).toLocaleDateString('vi-VN') : '---';

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
                    <button class="action-btn btn-edit" onclick="openEditModal('${id}')"><i class="fas fa-pen"></i></button>
                    <button class="action-btn btn-delete" onclick="deleteStaff('${id}')"><i class="fas fa-trash"></i></button>
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
    const fileInput = document.getElementById('staffAvatar');
    const uploadBox = document.getElementById('uploadTrigger');
    const btnAdd = document.querySelector('.btn-add');
    const overlay = document.querySelector('.modal-overlay');

    const closeModalInternal = () => {
        if (modal) modal.classList.remove('active');
        if (form) {
            form.reset();
            document.getElementById('staffId').value = ''; 
            if(document.getElementById('avatarPreview')) {
                document.getElementById('avatarPreview').style.display = 'none';
            }
        }
    };

    document.querySelectorAll('.btn-close-modal').forEach(btn => btn.onclick = closeModalInternal);
    if (overlay) overlay.onclick = closeModalInternal;
    
    // Preview ảnh
    if (uploadBox) {
        uploadBox.onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const preview = document.getElementById('avatarPreview');
                    preview.querySelector('img').src = evt.target.result;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        };
    }

    if (btnAdd) {
        btnAdd.onclick = () => {
            closeModalInternal();
            document.getElementById('modalTitle').innerText = "Thêm nhân viên mới";
            document.getElementById('btnSaveStaff').innerText = "Lưu nhân viên";
            modal.classList.add('active');
        };
    }

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const staffId = document.getElementById('staffId').value;
            const isUpdate = !!staffId;

            // Thu thập dữ liệu
            const cleanData = {
                full_name: document.getElementById('staffName').value,
                phone: document.getElementById('staffPhone').value,
                email: document.getElementById('staffEmail').value,
                role: document.getElementById('staffRole').value,
                // Bỏ hire_date
                status: document.getElementById('staffStatus').value
            };

            try {
                if (isUpdate) {
                    await adminApi.updateStaff(staffId, cleanData);
                    alert("Cập nhật thành công!");
                } else {
                    const formData = new FormData();
                    Object.keys(cleanData).forEach(key => formData.append(key, cleanData[key]));

                    await adminApi.createStaff(formData);
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
    const form = document.getElementById('staffForm');
    if (form) form.reset();

    const staff = globalStaff.find(s => s.id == id);
    if (!staff) return;

    document.getElementById('staffId').value = id;
    document.getElementById('staffName').value = staff.full_name || '';
    document.getElementById('staffPhone').value = staff.phone || '';
    document.getElementById('staffEmail').value = staff.email || '';
    
    // Gán đúng value ENUM (VD: 'LIBRARIAN')
    document.getElementById('staffRole').value = staff.role || 'LIBRARIAN';
    document.getElementById('staffStatus').value = staff.status || 'ACTIVE';

    document.getElementById('modalTitle').innerText = "Cập nhật hồ sơ";
    document.getElementById('btnSaveStaff').innerText = "Lưu thay đổi";
    document.getElementById('staffModal').classList.add('active');
};

window.deleteStaff = async (id) => {
    if (!confirm("Xóa nhân viên này?")) return;
    try {
        await adminApi.deleteStaff(id);
        alert("Đã xóa!");
        fetchStaffs();
    } catch (error) {
        alert("Lỗi: " + error.message);
    }
};