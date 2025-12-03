/**
 * Utility Functions - Các hàm hỗ trợ chung
 */

const Utils = {
    /**
     * Hiển thị toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 500);
        }, CONFIG.UI.TOAST_DURATION);
    },
    
    /**
     * Trích xuất link từ iframe code
     */
    extractLinkFromIframe(input) {
        if (input.includes('<iframe')) {
            const match = input.match(/src="([^"]+)"/);
            return match ? match[1] : null;
        }
        return input;
    },
    
    /**
     * Thêm embedded=true vào URL
     */
    ensureEmbedded(url) {
        if (!url.includes('embedded=true')) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}embedded=true`;
        }
        return url;
    },
    
    /**
     * Validate Google Form URL
     */
    isValidGoogleFormURL(url) {
        return url.includes('docs.google.com/forms');
    },
    
    /**
     * Validate số điện thoại VN
     */
    isValidPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    },
    
    /**
     * Copy to clipboard với fallback
     */
    async copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                return this.fallbackCopy(text);
            }
        } else {
            return this.fallbackCopy(text);
        }
    },
    
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (error) {
            document.body.removeChild(textArea);
            return false;
        }
    },
    
    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    /**
     * Load image as base64
     */
    loadImageAsBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File không phải là ảnh'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    },
    
    /**
     * Generate QR code URL
     */
    generateQRCodeURL(data, size = 200) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}