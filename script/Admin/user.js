import adminApi from '../../api/adminAPI.js'; 
import { setupAdminProfile } from '../../script/Admin/dropdown.js';

let globalUsers = []; 

document.addEventListener('DOMContentLoaded', () => {
    setupAdminProfile();
    fetchUsers();
    setupModalLogic();
});

// --- 1. FETCH API ---
async function fetchUsers() {
    try {
        const response = await adminApi.getAllUsers(); // Hàm này đã có ở bài trước
        globalUsers = Array.isArray(response) ? response : (response.data || []);
        renderUserTable(globalUsers);
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

// --- 2. RENDER TABLE ---
function renderUserTable(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    if (!users || users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Chưa có dữ liệu</td></tr>`;
        return;
    }

    users.forEach(user => {
        const id = user.id || user.user_id; 

        // Map Tier (Hạng)
        const tierMap = {
            'BRONZE': { label: 'Bronze', class: 'tier-bronze', icon: 'fa-shield-alt' },
            'SILVER': { label: 'Silver', class: 'tier-silver', icon: 'fa-medal' },
            'GOLD': { label: 'Gold', class: 'tier-gold', icon: 'fa-crown' },
            'PLATINUM': { label: 'Platinum', class: 'tier-platinum', icon: 'fa-gem' },
            'DIAMOND': { label: 'Diamond', class: 'tier-diamond', icon: 'fa-gem' }
        };
        const tierInfo = tierMap[user.tier] || { label: user.tier, class: 'tier-bronze', icon: 'fa-user' };

        // Map Status (Trạng thái)
        const statusMap = {
            'ACTIVE': { label: 'Hoạt động', class: 'status-active' },
            'RESTRICTED': { label: 'Hạn chế', class: 'status-restricted' },
            'BANNED': { label: 'Đã khoá', class: 'status-banned' }
        };
        const statusInfo = statusMap[user.status] || { label: user.status, class: '' };

        // Avatar
        const avatarUrl = user.avatar && !user.avatar.startsWith('http') 
            ? `http://localhost:3000${user.avatar}` 
            : (user.avatar || null);
        
        const avatarHtml = avatarUrl
            ? `<img src="${avatarUrl}" class="avatar" alt="avt">`
            : `<div class="avatar">${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}</div>`;

        const rowHTML = `
            <tr>
                <td>
                    <div class="user-info">
                        ${avatarHtml}
                        <div class="user-detail">
                            <h4>${user.full_name || 'Chưa đặt tên'}</h4>
                            <span>${user.email}</span>
                        </div>
                    </div>
                </td>
                <td>${user.phone || '---'}</td>
                <td style="font-weight:600; color:#333;">${user.points || 0}</td>
                <td><span class="tier-badge ${tierInfo.class}"><i class="fas ${tierInfo.icon}"></i> ${tierInfo.label}</span></td>
                <td><span class="${statusInfo.class}"><span class="status-dot"></span>${statusInfo.label}</span></td>
                <td style="text-align:center;">
                    <button class="action-btn btn-edit" onclick="openEditModal('${id}')"><i class="fas fa-pen"></i></button>
                    <button class="action-btn btn-delete" onclick="deleteUser('${id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
}

// --- 3. MODAL & FORM LOGIC ---
function setupModalLogic() {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const fileInput = document.getElementById('userAvatar');
    const uploadBox = document.getElementById('uploadTrigger');
    const btnAdd = document.querySelector('.btn-add');
    const overlay = document.querySelector('.modal-overlay');

    const closeModalInternal = () => {
        if (modal) modal.classList.remove('active');
        if (form) {
            form.reset();
            document.getElementById('userId').value = ''; 
            if(document.getElementById('avatarPreview')) {
                document.getElementById('avatarPreview').style.display = 'none';
            }
        }
    };

    document.querySelectorAll('.btn-close-modal').forEach(btn => btn.onclick = closeModalInternal);
    if (overlay) overlay.onclick = closeModalInternal;

    // Upload Preview
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
        }
    }

    // Open Add Modal
    if (btnAdd) {
        btnAdd.onclick = () => {
            closeModalInternal();
            document.getElementById('modalTitle').innerText = "Thêm người dùng mới";
            document.getElementById('btnSaveUser').innerText = "Lưu người dùng";
            document.getElementById('userTier').value = 'BRONZE'; // Mặc định
            document.getElementById('userStatus').value = 'ACTIVE';
            modal.classList.add('active');
        };
    }

    // Submit Form
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const userId = document.getElementById('userId').value;
            const isUpdate = !!userId;

            // Thu thập dữ liệu
            const cleanData = {
                full_name: document.getElementById('userName').value,
                phone: document.getElementById('userPhone').value,
                email: document.getElementById('userEmail').value,
                tier: document.getElementById('userTier').value,
                points: document.getElementById('userPoints').value,
                status: document.getElementById('userStatus').value,
                role: 'MEMBER' // Bắt buộc cho User
            };

            try {
                if (isUpdate) {
                    await adminApi.updateUser(userId, cleanData); // Cần thêm hàm này vào adminApi
                    alert("Cập nhật thành công!");
                } else {
                    const formData = new FormData();
                    Object.keys(cleanData).forEach(key => formData.append(key, cleanData[key]));

                    await adminApi.createUser(formData); // Cần thêm hàm này vào adminApi
                    alert("Thêm người dùng thành công!");
                }
                closeModalInternal();
                fetchUsers();
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Lỗi: " + (error.response?.data?.message || error.message));
            }
        };
    }
}

// --- 4. GLOBAL FUNCTIONS ---
window.openEditModal = (id) => {
    const form = document.getElementById('userForm');
    if (form) form.reset();

    const user = globalUsers.find(u => u.id == id);
    if (!user) return;

    document.getElementById('userId').value = id;
    document.getElementById('userName').value = user.full_name || '';
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userEmail').value = user.email || '';
    
    document.getElementById('userTier').value = user.tier || 'BRONZE';
    document.getElementById('userPoints').value = user.points || 0;
    document.getElementById('userStatus').value = user.status || 'ACTIVE';

    document.getElementById('modalTitle').innerText = "Cập nhật hồ sơ độc giả";
    document.getElementById('btnSaveUser').innerText = "Lưu thay đổi";
    document.getElementById('userModal').classList.add('active');
};

window.deleteUser = async (id) => {
    if (!confirm("Xóa người dùng này?")) return;
    try {
        await adminApi.deleteUser(id); // Cần thêm hàm này vào adminApi
        alert("Đã xóa!");
        fetchUsers();
    } catch (error) {
        alert("Lỗi: " + error.message);
    }
};