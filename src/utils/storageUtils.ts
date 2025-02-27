
/**
 * Utility functions for storing and retrieving data
 * This simulates a secure cloud storage system
 */

// Interface for storage providers
interface StorageProvider {
  save: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// LocalStorage provider (default)
class LocalStorageProvider implements StorageProvider {
  private prefix: string = 'finance-app-';
  
  async save(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }
  
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(this.prefix + key);
  }
  
  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key);
  }
  
  async clear(): Promise<void> {
    // Only clear items with our prefix
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

// IndexedDB provider for larger data
class IndexedDBProvider implements StorageProvider {
  private dbName: string = 'finance-app-db';
  private storeName: string = 'finance-data';
  private db: IDBDatabase | null = null;
  
  constructor() {
    this.initDB();
  }
  
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => {
        console.error('Error opening IndexedDB');
        reject(new Error('Failed to open IndexedDB'));
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }
  
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }
    return this.db;
  }
  
  async save(key: string, value: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.put({ key, value });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save data'));
    });
  }
  
  async get(key: string): Promise<string | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      
      request.onerror = () => reject(new Error('Failed to get data'));
    });
  }
  
  async remove(key: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove data'));
    });
  }
  
  async clear(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear data'));
    });
  }
}

// Strategy pattern for storage
class StorageService {
  private provider: StorageProvider;
  
  constructor(providerType: 'localStorage' | 'indexedDB' = 'localStorage') {
    this.provider = providerType === 'localStorage' 
      ? new LocalStorageProvider() 
      : new IndexedDBProvider();
  }
  
  // Switch provider if needed
  setProvider(providerType: 'localStorage' | 'indexedDB'): void {
    this.provider = providerType === 'localStorage' 
      ? new LocalStorageProvider() 
      : new IndexedDBProvider();
  }
  
  // Wrapper methods
  async save(key: string, value: string): Promise<void> {
    return this.provider.save(key, value);
  }
  
  async get(key: string): Promise<string | null> {
    return this.provider.get(key);
  }
  
  async remove(key: string): Promise<void> {
    return this.provider.remove(key);
  }
  
  async clear(): Promise<void> {
    return this.provider.clear();
  }
}

// Create a singleton instance
const storageService = new StorageService();

// Encryption utilities for sensitive data
const encryptData = (data: string, key: string): string => {
  // This is a simple XOR encryption for demonstration
  // In a real app, use a proper encryption library
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted); // Base64 encode
};

const decryptData = (encryptedData: string, key: string): string => {
  try {
    const data = atob(encryptedData); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return '';
  }
};

// Public API
export const saveToStorage = async (key: string, value: string, encrypt: boolean = false): Promise<void> => {
  try {
    // For demonstration purposes, we'll use a fixed encryption key
    // In a real app, this would be a user-specific key or from a secure keystore
    const encryptionKey = 'SECURE_KEY_12345';
    
    const dataToSave = encrypt ? encryptData(value, encryptionKey) : value;
    await storageService.save(key, dataToSave);
    
    // Simulate server sync for cloud storage
    console.log(`[CLOUD SYNC] Data for ${key} saved to cloud storage`);
  } catch (error) {
    console.error('Failed to save data:', error);
    throw error;
  }
};

export const getFromStorage = async (key: string, encrypted: boolean = false): Promise<string | null> => {
  try {
    const value = await storageService.get(key);
    
    if (!value) return null;
    
    // Decrypt if needed
    if (encrypted) {
      const encryptionKey = 'SECURE_KEY_12345';
      return decryptData(value, encryptionKey);
    }
    
    return value;
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return null;
  }
};

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await storageService.remove(key);
    
    // Simulate server sync for cloud storage
    console.log(`[CLOUD SYNC] Data for ${key} removed from cloud storage`);
  } catch (error) {
    console.error('Failed to remove data:', error);
    throw error;
  }
};

// For securing sensitive financial data
export const secureStorage = {
  saveSecurely: async (key: string, value: string): Promise<void> => {
    return saveToStorage(key, value, true);
  },
  
  getSecurely: async (key: string): Promise<string | null> => {
    return getFromStorage(key, true);
  }
};

// Export utility function to check if storage is available
export const isStorageAvailable = (type: 'localStorage' | 'indexedDB'): boolean => {
  try {
    if (type === 'localStorage') {
      const x = '__storage_test__';
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } else if (type === 'indexedDB') {
      return 'indexedDB' in window;
    }
    return false;
  } catch (e) {
    return false;
  }
};
