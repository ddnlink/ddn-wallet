import DdnJS from '@ddn/js-sdk'

// 应用名称
export const APP_NAME = 'DDN Wallet';

// 交易类型
export const TRANS_TYPES = DdnJS.utils.assetTypes

// 网络类型
export const NETWORKS = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
};

// API 基础路径
export const API_BASE_URLS = {
  development: 'http://localhost:8001',
  test: 'http://localhost:8001',
  production: 'http://localhost:8001',
};

// 本地存储键
export const STORAGE_KEYS = {
  KEY_STORE: 'ddn-keyStore',
  AUTHORITY: 'ddn-authority',
  CONTACTS: 'ddn-contacts',
  SETTINGS: 'ddn-settings',
};

// 默认设置
export const DEFAULT_SETTINGS = {
  language: 'zh-CN',
  network: NETWORKS.TESTNET,
  theme: 'light',
};

// 也可以使用 DdnJS 里的常量
export const TokenName = 'DDN';