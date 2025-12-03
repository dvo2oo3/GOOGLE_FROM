/**
 * File cấu hình chính cho toàn bộ hệ thống
 * Chỉnh sửa file này để thay đổi cấu hình
 */

const CONFIG = {
    // Storage Keys
    STORAGE_KEYS: {
        FORM_LINK: 'aev_form_link',
        LOGO: 'aev_logo_base64',
        SIDEBAR: 'aev_sidebar_content',
        ZALO: 'aev_zalo_number'
    },
    
    // Default Values
    DEFAULTS: {
        FORM_LINK: '',
        LOGO_PATH: 'img/logo.jpg',
        ZALO_NUMBER: '0394304799',
        SIDEBAR: {
            guideTitle: '📋 Hướng dẫn',
            guideContent: 'Vui lòng điền đầy đủ thông tin vào biểu mẫu. Mọi thông tin sẽ được bảo mật.',
            timeTitle: '⏱️ Thời gian',
            timeContent: 'Hoàn thành biểu mẫu chỉ mất khoảng 3-5 phút.',
            confirmTitle: '✉️ Xác nhận',
            confirmContent: 'Bạn sẽ nhận email xác nhận ngay sau khi gửi form thành công.',
            supportTitle: '💬 Cần hỗ trợ?',
            supportContent: 'Liên hệ với chúng tôi qua Zalo nếu gặp vấn đề'
        }
    },
    
    // Admin Credentials (nên mã hóa trong production)
    ADMIN: {
        USERNAME: 'admin',
        PASSWORD: 'admin123'
    },
    
    // UI Settings
    UI: {
        TOAST_DURATION: 4000,
        IFRAME_MIN_HEIGHT: {
            MOBILE: 1000,
            TABLET: 800,
            DESKTOP: 700
        }
    }
};

// Export để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}