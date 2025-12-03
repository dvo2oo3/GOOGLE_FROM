class App {
    constructor() {
        this.formLink = null;
        this.logoBase64 = null;
        this.sidebarContent = null;
        this.zaloNumber = CONFIG.DEFAULTS.ZALO_NUMBER;
        this.init();
    }
    
    init() {
        console.log('🚀 Khởi động ứng dụng...');
        this.setupEventListeners();
        this.loadAllData();
    }
    
    setupEventListeners() {
        // Đóng modal khi nhấn ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Fade in effect
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s';
                document.body.style.opacity = '1';
            }, 100);
        });
    }
    
    /**
     * Load toàn bộ dữ liệu từ storage
     */
    async loadAllData() {
        try {
            console.log('📂 Đang load dữ liệu...');
            
            // Load song song để tăng tốc
            await Promise.all([
                this.loadFormLink(),
                this.loadLogo(),
                this.loadSidebarContent(),
                this.loadZaloNumber()
            ]);
            
            console.log('✅ Đã load xong tất cả dữ liệu');
        } catch (error) {
            console.error('❌ Lỗi khi load dữ liệu:', error);
        }
    }
    
    /**
     * Load link Google Form
     */
    async loadFormLink() {
        try {
            const data = await window.storage.get(CONFIG.STORAGE_KEYS.FORM_LINK);
            
            if (data && data.value) {
                this.formLink = data.value;
                console.log('✅ Đã load Form Link');
                this.displayForm();
            } else {
                console.log('⚠️ Chưa có Form Link');
                this.showEmptyState();
            }
        } catch (error) {
            console.error('❌ Lỗi load Form Link:', error);
            this.showEmptyState();
        }
    }
    
    /**
     * Hiển thị Google Form trong iframe
     */
    displayForm() {
        const iframe = document.getElementById('formFrame');
        const loading = document.getElementById('loading');
        const emptyState = document.getElementById('emptyState');
        
        if (!iframe) return;
        
        // Ẩn empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Hiển thị loading
        if (loading) {
            loading.style.display = 'flex';
        }
        
        // Set src cho iframe
        iframe.src = this.formLink;
        
        console.log('📋 Đang load form:', this.formLink);
    }
    
    /**
     * Hiển thị trạng thái chưa có form
     */
    showEmptyState() {
        const loading = document.getElementById('loading');
        const emptyState = document.getElementById('emptyState');
        const iframe = document.getElementById('formFrame');
        
        if (loading) {
            loading.style.display = 'none';
        }
        
        if (iframe) {
            iframe.style.display = 'none';
        }
        
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }
    
    /**
     * Load logo
     */
    async loadLogo() {
        try {
            const data = await window.storage.get(CONFIG.STORAGE_KEYS.LOGO);
            
            if (data && data.value) {
                this.logoBase64 = data.value;
                console.log('✅ Đã load Logo');
                this.displayLogo();
            } else {
                console.log('ℹ️ Chưa có logo tùy chỉnh');
                // Giữ logo mặc định hoặc ẩn
                this.hideLogo();
            }
        } catch (error) {
            console.error('❌ Lỗi load Logo:', error);
            this.hideLogo();
        }
    }
    
    /**
     * Hiển thị logo
     */
    displayLogo() {
        const headerLogo = document.getElementById('headerLogo');
        const sidebarLogo = document.getElementById('sidebarLogo');
        
        if (headerLogo) {
            headerLogo.src = this.logoBase64;
            headerLogo.style.display = 'block';
        }
        
        if (sidebarLogo) {
            sidebarLogo.src = this.logoBase64;
            sidebarLogo.style.display = 'block';
        }
    }
    
    /**
     * Ẩn logo
     */
    hideLogo() {
        const headerLogo = document.getElementById('headerLogo');
        const sidebarLogo = document.getElementById('sidebarLogo');
        
        if (headerLogo) {
            headerLogo.style.display = 'none';
        }
        
        if (sidebarLogo) {
            sidebarLogo.style.display = 'none';
        }
    }
    
    /**
     * Load nội dung sidebar
     */
    async loadSidebarContent() {
        try {
            const data = await window.storage.get(CONFIG.STORAGE_KEYS.SIDEBAR);
            
            if (data && data.value) {
                this.sidebarContent = JSON.parse(data.value);
                console.log('✅ Đã load Sidebar Content');
                this.displaySidebarContent();
            } else {
                console.log('ℹ️ Sử dụng nội dung sidebar mặc định');
                this.displayDefaultSidebar();
            }
        } catch (error) {
            console.error('❌ Lỗi load Sidebar:', error);
            this.displayDefaultSidebar();
        }
    }
    
    /**
     * Hiển thị nội dung sidebar
     */
    displaySidebarContent() {
        if (!this.sidebarContent) return;
        
        const elements = {
            guideTitle: document.getElementById('sidebarGuideTitle'),
            guideContent: document.getElementById('sidebarGuideContent'),
            timeTitle: document.getElementById('sidebarTimeTitle'),
            timeContent: document.getElementById('sidebarTimeContent'),
            confirmTitle: document.getElementById('sidebarConfirmTitle'),
            confirmContent: document.getElementById('sidebarConfirmContent'),
            supportTitle: document.getElementById('sidebarSupportTitle'),
            supportContent: document.getElementById('sidebarSupportContent')
        };
        
        // Cập nhật từng element
        Object.keys(elements).forEach(key => {
            if (elements[key] && this.sidebarContent[key]) {
                elements[key].textContent = this.sidebarContent[key];
            }
        });
    }
    
    /**
     * Hiển thị sidebar mặc định
     */
    displayDefaultSidebar() {
        const defaults = CONFIG.DEFAULTS.SIDEBAR;
        
        const elements = {
            guideTitle: document.getElementById('sidebarGuideTitle'),
            guideContent: document.getElementById('sidebarGuideContent'),
            timeTitle: document.getElementById('sidebarTimeTitle'),
            timeContent: document.getElementById('sidebarTimeContent'),
            confirmTitle: document.getElementById('sidebarConfirmTitle'),
            confirmContent: document.getElementById('sidebarConfirmContent'),
            supportTitle: document.getElementById('sidebarSupportTitle'),
            supportContent: document.getElementById('sidebarSupportContent')
        };
        
        if (elements.guideTitle) elements.guideTitle.textContent = defaults.guideTitle;
        if (elements.guideContent) elements.guideContent.textContent = defaults.guideContent;
        if (elements.timeTitle) elements.timeTitle.textContent = defaults.timeTitle;
        if (elements.timeContent) elements.timeContent.textContent = defaults.timeContent;
        if (elements.confirmTitle) elements.confirmTitle.textContent = defaults.confirmTitle;
        if (elements.confirmContent) elements.confirmContent.textContent = defaults.confirmContent;
        if (elements.supportTitle) elements.supportTitle.textContent = defaults.supportTitle;
        if (elements.supportContent) elements.supportContent.textContent = defaults.supportContent;
    }
    
    /**
     * Load số Zalo
     */
    async loadZaloNumber() {
        try {
            const data = await window.storage.get(CONFIG.STORAGE_KEYS.ZALO);
            
            if (data && data.value) {
                this.zaloNumber = data.value;
                console.log('✅ Đã load Zalo Number');
                this.updateZaloNumber();
            } else {
                console.log('ℹ️ Sử dụng số Zalo mặc định');
                this.updateZaloNumber();
            }
        } catch (error) {
            console.error('❌ Lỗi load Zalo:', error);
            this.updateZaloNumber();
        }
    }
    
    /**
     * Cập nhật số Zalo trong popup
     */
    updateZaloNumber() {
        // Cập nhật số điện thoại
        const phoneElements = document.querySelectorAll('.phone-number');
        phoneElements.forEach(el => {
            el.textContent = this.zaloNumber;
        });
        
        // Cập nhật QR code
        const qrImage = document.getElementById('qrCodeImage');
        if (qrImage) {
            qrImage.src = Utils.generateQRCodeURL(`https://zalo.me/${this.zaloNumber}`);
        }
    }
    
    /**
     * Mở popup Zalo
     */
    showZaloPopup() {
        const popup = document.getElementById('zaloPopup');
        if (popup) {
            popup.classList.add('show');
            popup.style.display = 'block';
        }
    }
    
    /**
     * Đóng popup Zalo
     */
    closeZaloPopup() {
        const popup = document.getElementById('zaloPopup');
        if (popup) {
            popup.classList.remove('show');
            popup.style.display = 'none';
        }
    }
    
    /**
     * Đóng tất cả modal
     */
    closeAllModals() {
        this.closeZaloPopup();
    }
    
    /**
     * Copy số điện thoại
     */
    async copyPhoneNumber() {
        const phoneNumber = this.zaloNumber;
        
        try {
            const success = await Utils.copyToClipboard(phoneNumber);
            
            if (success) {
                Utils.showToast('✅ Đã copy số điện thoại!', 'success');
            } else {
                // Fallback: hiển thị alert
                alert('Số điện thoại: ' + phoneNumber + '\n\nVui lòng copy thủ công.');
            }
        } catch (error) {
            alert('Số điện thoại: ' + phoneNumber + '\n\nVui lòng copy thủ công.');
        }
    }
    
    /**
     * Xử lý khi iframe load xong
     */
    handleIframeLoad() {
        const iframe = document.getElementById('formFrame');
        const loading = document.getElementById('loading');
        
        if (!iframe) return;
        
        // Ẩn loading
        if (loading) {
            loading.style.display = 'none';
        }
        
        // Hiển thị iframe
        iframe.style.display = 'block';
        
        // Tự động điều chỉnh chiều cao
        this.adjustIframeHeight();
        
        console.log('✅ Form đã load xong');
    }
    
    /**
     * Điều chỉnh chiều cao iframe
     */
    adjustIframeHeight() {
        const iframe = document.getElementById('formFrame');
        if (!iframe) return;
        
        let height = CONFIG.UI.IFRAME_MIN_HEIGHT.DESKTOP;
        
        if (window.innerWidth < 480) {
            height = CONFIG.UI.IFRAME_MIN_HEIGHT.MOBILE;
        } else if (window.innerWidth < 768) {
            height = CONFIG.UI.IFRAME_MIN_HEIGHT.TABLET;
        } else if (window.innerWidth >= 1200) {
            height = 900; // PC có sidebar nên cao hơn
        }
        
        iframe.style.height = height + 'px';
    }
}

// Khởi tạo app khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Responsive iframe height
    window.addEventListener('resize', Utils.debounce(() => {
        if (window.app) {
            window.app.adjustIframeHeight();
        }
    }, 250));
});

// ==================== GLOBAL FUNCTIONS ====================
// Các hàm được gọi từ HTML onclick

function showZaloPopup() {
    if (window.app) {
        window.app.showZaloPopup();
    }
}

function closeZaloPopup() {
    if (window.app) {
        window.app.closeZaloPopup();
    }
}

function copyPhoneNumber() {
    if (window.app) {
        window.app.copyPhoneNumber();
    }
}

function handleIframeLoad() {
    if (window.app) {
        window.app.handleIframeLoad();
    }
}