/**
 * Admin Panel Logic
 */

class AdminPanel {
    constructor() {
        this.isLoggedIn = false;
        this.currentLogo = '';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
    }
    
    setupEventListeners() {
        // Login form
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Logo upload
        document.getElementById('logoUpload')?.addEventListener('change', (e) => {
            this.handleLogoUpload(e);
        });
        
        // Config import
        document.getElementById('configImport')?.addEventListener('change', (e) => {
            this.handleConfigImport(e);
        });
        
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username === CONFIG.ADMIN.USERNAME && password === CONFIG.ADMIN.PASSWORD) {
            this.isLoggedIn = true;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('displayUsername').textContent = '👤 ' + username;
        } else {
            Utils.showToast('❌ Sai tên đăng nhập hoặc mật khẩu!', 'error');
        }
    }
    
    handleLogout() {
        this.isLoggedIn = false;
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
    
    async loadSavedData() {
        try {
            // Load form link
            const formLinkData = await window.storage.get(CONFIG.STORAGE_KEYS.FORM_LINK);
            if (formLinkData?.value) {
                document.getElementById('currentLinkText').textContent = formLinkData.value;
                document.getElementById('formLink').value = formLinkData.value;
            }
            
            // Load logo
            const logoData = await window.storage.get(CONFIG.STORAGE_KEYS.LOGO);
            if (logoData?.value) {
                this.currentLogo = logoData.value;
                document.getElementById('currentLogo').src = logoData.value;
            }
            
            // Load sidebar
            const sidebarData = await window.storage.get(CONFIG.STORAGE_KEYS.SIDEBAR);
            if (sidebarData?.value) {
                const content = JSON.parse(sidebarData.value);
                this.populateSidebarForm(content);
            }
            
            // Load Zalo
            const zaloData = await window.storage.get(CONFIG.STORAGE_KEYS.ZALO);
            if (zaloData?.value) {
                document.getElementById('currentZaloText').textContent = zaloData.value;
                document.getElementById('zaloNumber').value = zaloData.value;
            }
        } catch (error) {
            console.error('❌ Lỗi load data:', error);
        }
    }
    
    async saveFormLink() {
        let formLink = document.getElementById('formLink').value.trim();
        
        if (!formLink) {
            Utils.showToast('❌ Vui lòng nhập link Google Form!', 'error');
            return;
        }
        
        // Extract from iframe if needed
        formLink = Utils.extractLinkFromIframe(formLink);
        
        if (!formLink || !Utils.isValidGoogleFormURL(formLink)) {
            Utils.showToast('❌ Link không hợp lệ! Vui lòng nhập link Google Form.', 'error');
            return;
        }
        
        // Ensure embedded=true
        formLink = Utils.ensureEmbedded(formLink);
        
        try {
            await window.storage.set(CONFIG.STORAGE_KEYS.FORM_LINK, formLink);
            document.getElementById('currentLinkText').textContent = formLink;
            document.getElementById('formLink').value = formLink;
            Utils.showToast('✅ Đã lưu link Google Form thành công!');
        } catch (error) {
            Utils.showToast('❌ Lỗi khi lưu: ' + error.message, 'error');
        }
    }
    
    async deleteFormLink() {
        if (confirm('⚠️ Bạn có chắc muốn xóa link form?')) {
            try {
                await window.storage.delete(CONFIG.STORAGE_KEYS.FORM_LINK);
                document.getElementById('currentLinkText').textContent = 'Chưa có dữ liệu';
                document.getElementById('formLink').value = '';
                Utils.showToast('✅ Đã xóa link form thành công!');
            } catch (error) {
                Utils.showToast('❌ Lỗi khi xóa: ' + error.message, 'error');
            }
        }
    }
    
    async handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const base64 = await Utils.loadImageAsBase64(file);
            this.currentLogo = base64;
            
            document.getElementById('previewImage').src = base64;
            document.getElementById('newLogoPreview').style.display = 'block';
            document.getElementById('saveLogoBtn').style.display = 'block';
        } catch (error) {
            Utils.showToast('❌ ' + error.message, 'error');
        }
    }
    
    async saveLogo() {
        if (!this.currentLogo) {
            Utils.showToast('❌ Chưa có ảnh để lưu!', 'error');
            return;
        }
        
        try {
            await window.storage.set(CONFIG.STORAGE_KEYS.LOGO, this.currentLogo);
            document.getElementById('currentLogo').src = this.currentLogo;
            document.getElementById('newLogoPreview').style.display = 'none';
            document.getElementById('saveLogoBtn').style.display = 'none';
            Utils.showToast('✅ Đã lưu logo mới thành công!');
        } catch (error) {
            Utils.showToast('❌ Lỗi khi lưu: ' + error.message, 'error');
        }
    }
    
    async saveSidebarContent() {
        const content = {
            guideTitle: document.getElementById('sidebarGuideTitle').value,
            guideContent: document.getElementById('sidebarGuideContent').value,
            timeTitle: document.getElementById('sidebarTimeTitle').value,
            timeContent: document.getElementById('sidebarTimeContent').value,
            confirmTitle: document.getElementById('sidebarConfirmTitle').value,
            confirmContent: document.getElementById('sidebarConfirmContent').value,
            supportTitle: document.getElementById('sidebarSupportTitle').value,
            supportContent: document.getElementById('sidebarSupportContent').value
        };
        
        try {
            await window.storage.set(CONFIG.STORAGE_KEYS.SIDEBAR, JSON.stringify(content));
            Utils.showToast('✅ Đã lưu nội dung Sidebar thành công!');
        } catch (error) {
            Utils.showToast('❌ Lỗi khi lưu: ' + error.message, 'error');
        }
    }
    
    async saveZaloNumber() {
        let zaloNumber = document.getElementById('zaloNumber').value.trim();
        zaloNumber = zaloNumber.replace(/\D/g, '');
        
        if (!Utils.isValidPhoneNumber(zaloNumber)) {
            Utils.showToast('❌ Số điện thoại phải có 10-11 số!', 'error');
            return;
        }
        
        try {
            await window.storage.set(CONFIG.STORAGE_KEYS.ZALO, zaloNumber);
            document.getElementById('currentZaloText').textContent = zaloNumber;
            Utils.showToast('✅ Đã lưu số Zalo thành công!');
        } catch (error) {
            Utils.showToast('❌ Lỗi khi lưu: ' + error.message, 'error');
        }
    }
    
    async exportConfig() {
        try {
            const formLinkData = await window.storage.get(CONFIG.STORAGE_KEYS.FORM_LINK);
            const logoData = await window.storage.get(CONFIG.STORAGE_KEYS.LOGO);
            const sidebarData = await window.storage.get(CONFIG.STORAGE_KEYS.SIDEBAR);
            const zaloData = await window.storage.get(CONFIG.STORAGE_KEYS.ZALO);
            
            const config = {
                formLink: formLinkData?.value || '',
                logoBase64: logoData?.value || '',
                sidebar: sidebarData?.value ? JSON.parse(sidebarData.value) : null,
                zaloNumber: zaloData?.value || '',
                exportDate: new Date().toLocaleString('vi-VN'),
                version: '2.0'
            };
            
            const jsonString = JSON.stringify(config, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `config_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            Utils.showToast('✅ Đã xuất config thành công!');
        } catch (error) {
            Utils.showToast('❌ Lỗi khi xuất config: ' + error.message, 'error');
        }
    }
    
    async handleConfigImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.json')) {
            Utils.showToast('❌ Vui lòng chọn file .json!', 'error');
            return;
        }
        
        if (!confirm('⚠️ Import config sẽ GHI ĐÈ toàn bộ cấu hình hiện tại!\n\nBạn có chắc chắn muốn tiếp tục?')) {
            event.target.value = '';
            return;
        }
        
        try {
            const text = await file.text();
            const config = JSON.parse(text);
            
            if (config.formLink) {
                await window.storage.set(CONFIG.STORAGE_KEYS.FORM_LINK, config.formLink);
            }
            if (config.logoBase64) {
                await window.storage.set(CONFIG.STORAGE_KEYS.LOGO, config.logoBase64);
            }
            if (config.sidebar) {
                await window.storage.set(CONFIG.STORAGE_KEYS.SIDEBAR, JSON.stringify(config.sidebar));
            }
            if (config.zaloNumber) {
                await window.storage.set(CONFIG.STORAGE_KEYS.ZALO, config.zaloNumber);
            }
            
            Utils.showToast('✅ Đã nhập config thành công! Đang tải lại trang...');
            setTimeout(() => location.reload(), 1500);
        } catch (error) {
            Utils.showToast('❌ Lỗi khi nhập config: ' + error.message, 'error');
        }
        
        event.target.value = '';
    }
    
    populateSidebarForm(content) {
        document.getElementById('sidebarGuideTitle').value = content.guideTitle || '';
        document.getElementById('sidebarGuideContent').value = content.guideContent || '';
        document.getElementById('sidebarTimeTitle').value = content.timeTitle || '';
        document.getElementById('sidebarTimeContent').value = content.timeContent || '';
        document.getElementById('sidebarConfirmTitle').value = content.confirmTitle || '';
        document.getElementById('sidebarConfirmContent').value = content.confirmContent || '';
        document.getElementById('sidebarSupportTitle').value = content.supportTitle || '';
        document.getElementById('sidebarSupportContent').value = content.supportContent || '';
    }
    
    closeAllModals() {
        // Add modal closing logic if needed
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Global functions for onclick handlers
function handleLogout() {
    window.adminPanel.handleLogout();
}

function saveFormLink() {
    window.adminPanel.saveFormLink();
}

function deleteFormLink() {
    window.adminPanel.deleteFormLink();
}

function saveLogo() {
    window.adminPanel.saveLogo();
}

function saveSidebarContent() {
    window.adminPanel.saveSidebarContent();
}

function saveZaloNumber() {
    window.adminPanel.saveZaloNumber();
}

function exportConfig() {
    window.adminPanel.exportConfig();
}