/**
 * 用户权限和密钥管理工具
 */
import { STORAGE_KEYS } from '@/constants';

// 获取本地存储的密钥
export function getKeyStore() {
  const keyStoreStr = localStorage.getItem(STORAGE_KEYS.KEY_STORE);
  if (keyStoreStr) {
    try {
      return JSON.parse(keyStoreStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 保存密钥到本地存储
export function setKeyStore(keyStore: any) {
  if (keyStore) {
    localStorage.setItem(STORAGE_KEYS.KEY_STORE, JSON.stringify(keyStore));
    return true;
  }
  return false;
}

// 清除本地存储的密钥
export function clearKeyStore() {
  localStorage.removeItem(STORAGE_KEYS.KEY_STORE);
}

// 获取用户权限
export function getAuthority() {
  const keyStore = getKeyStore();
  if (keyStore && keyStore.address) {
    return ['user'];
  }
  return ['guest'];
}

// 设置用户权限
export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem(STORAGE_KEYS.AUTHORITY, JSON.stringify(proAuthority));
}

// 获取设置
export function getSettings() {
  const settingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (settingsStr) {
    try {
      return JSON.parse(settingsStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 保存设置
export function setSettings(settings: any) {
  if (settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  }
  return false;
}
