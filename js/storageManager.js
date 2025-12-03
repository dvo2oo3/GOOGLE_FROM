/**
 * Storage Manager - Quản lý localStorage
 * File: storageManager.js (đã đổi tên từ storage.js)
 */

class StorageManager {
    constructor() {
        this.isAvailable = this.checkAvailability();
    }
    
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('⚠️ localStorage không khả dụng:', e);
            return false;
        }
    }
    
    async get(key) {
        if (!this.isAvailable) return null;
        
        try {
            const value = localStorage.getItem(key);
            return value ? { key, value } : null;
        } catch (error) {
            console.error('❌ Lỗi get:', error);
            return null;
        }
    }
    
    async set(key, value) {
        if (!this.isAvailable) return null;
        
        try {
            localStorage.setItem(key, value);
            console.log('💾 Đã lưu:', key);
            return { key, value };
        } catch (error) {
            console.error('❌ Lỗi set:', error);
            return null;
        }
    }
    
    async delete(key) {
        if (!this.isAvailable) return null;
        
        try {
            localStorage.removeItem(key);
            console.log('🗑️ Đã xóa:', key);
            return { key, deleted: true };
        } catch (error) {
            console.error('❌ Lỗi delete:', error);
            return null;
        }
    }
    
    async list(prefix = '') {
        if (!this.isAvailable) return { keys: [] };
        
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!prefix || key.startsWith(prefix)) {
                    keys.push(key);
                }
            }
            return { keys };
        } catch (error) {
            console.error('❌ Lỗi list:', error);
            return { keys: [] };
        }
    }
    
    async clear() {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.clear();
            console.log('🧹 Đã xóa toàn bộ storage');
            return true;
        } catch (error) {
            console.error('❌ Lỗi clear:', error);
            return false;
        }
    }
    
    // Export toàn bộ data
    async exportAll() {
        const data = {};
        const allKeys = await this.list();
        
        for (const key of allKeys.keys) {
            const item = await this.get(key);
            if (item) {
                data[key] = item.value;
            }
        }
        
        return data;
    }
    
    // Import data
    async importAll(data) {
        for (const [key, value] of Object.entries(data)) {
            await this.set(key, value);
        }
    }
}

// Khởi tạo instance global
window.storage = new StorageManager();

// Export cho module nếu cần
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}