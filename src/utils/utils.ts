/**
 * 通用工具函数
 */
import copy from 'copy-to-clipboard';
import DdnJS from '@ddn/js-sdk'
import { TRANS_TYPES } from '@/constants';
import { getIntl } from 'umi';

const { constants } = DdnJS;

/**
 * 格式化金额，将最小单位转换为显示单位
 * @param amount 金额（最小单位）
 * @param precision 精度，默认为 8
 * @returns 格式化后的金额
 */
export function formatAmount(amount: number | string, precision: number = 8): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (num / Math.pow(10, precision)).toFixed(precision);
}

/**
 * 解析金额，将显示单位转换为最小单位
 * @param amount 金额（显示单位）
 * @param precision 精度，默认为 8
 * @returns 解析后的金额
 */
export function parseAmount(amount: number | string, precision: number = 8): number {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num;
}

/**
 * 获取交易类型名称
 * @param type 交易类型
 * @returns 交易类型名称
 */
export function getTransactionTypeName(type: number): string {
  switch (type) {
    case TRANS_TYPES.TRANSFER:
      return '转账';
    case TRANS_TYPES.SIGNATURE:
      return '设置二级密码';
    case TRANS_TYPES.DELEGATE:
      return '注册受托人';
    case TRANS_TYPES.VOTE:
      return '投票';
    case TRANS_TYPES.MULTISIGNATURE:
      return '多重签名';
    case TRANS_TYPES.CONTRACT:
      return '智能合约';
    case TRANS_TYPES.CONTRACT_TRANSFER:
      return '合约交易';
    case TRANS_TYPES.DAPP:
      return '应用';
    case TRANS_TYPES.IN_TRANSFER:
      return '应用内转账';
    case TRANS_TYPES.OUT_TRANSFER:
      return '应用外转账';
    case TRANS_TYPES.STORE:
      return '存储';
    case TRANS_TYPES.EVIDENCE:
      return '存证';
    // // DAO 40-59
    case TRANS_TYPES.DAO_ORG:
      return 'DAO 组织';
    case TRANS_TYPES.DAO_EXCHANGE:
      return 'DAO 交易';
    case TRANS_TYPES.DAO_CONTRIBUTION:
      return 'DAO 贡献';
    case TRANS_TYPES.DAO_CONFIRMATION:
      return 'DAO 确认';

    // // Coupon
    // case TRANS_TYPES.COUPON_ISSUER_AUDITOR_BUY:
    // return '注册资产发行商';
    // case TRANS_TYPES.COUPON_ISSUER_APPLY: 50,
    // case TRANS_TYPES.COUPON_ISSUER_CHECK: 51,
    // case TRANS_TYPES.COUPON_ISSUER_UPDATE: 52,
    // case TRANS_TYPES.COUPON_ISSUER_FREEZE: 53,
    // case TRANS_TYPES.COUPON_ISSUER_UNFREEZE: 54,
    // case TRANS_TYPES.COUPON_ISSUE_NEW: 55,
    // case TRANS_TYPES.COUPON_ISSUE_CLOSE: 56,
    // case TRANS_TYPES.COUPON_ISSUE_REOPEN: 57,
    // case TRANS_TYPES.COUPON_EXCH_BUY: 58,
    // case TRANS_TYPES.COUPON_EXCH_PAY: 59,
    // case TRANS_TYPES.COUPON_EXCH_TRANSFER_ASK: 71,
    // case TRANS_TYPES.COUPON_EXCH_TRANSFER_CONFIRM: 72,

    // // AOB-ASSET ON BLOCKCHAIN: 60-79
    case TRANS_TYPES.AOB_ISSUER:
      return '注册资产发行商';
    case TRANS_TYPES.AOB_ASSET:
      return '注册资产';
    case TRANS_TYPES.AOB_FLAG:
      return '资产设置';
    case TRANS_TYPES.AOB_ACL:
      return '资产访问控制';
    case TRANS_TYPES.AOB_ISSUE:
      return '资产发行';
    case TRANS_TYPES.AOB_TRANSFER:
      return '资产转账';
    case TRANS_TYPES.LOCK:
      return '锁仓';
    default:
      return '未知';
  }
}

/**
 * 格式化地址，显示部分地址
 * @param address 地址
 * @param prefixLength 前缀长度，默认为 10
 * @param suffixLength 后缀长度，默认为 10
 * @returns 格式化后的地址
 */
export function formatAddress(address: string, prefixLength: number = 10, suffixLength: number = 10): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns 是否复制成功
 */
export function copyToClipboard(text: string) {
  try {
    // 使用第三方库 copy-to-clipboard 来处理复制
    const result = copy(text, {
      debug: false,
      format: 'text/plain'
    });
    return result;
  } catch (error) {
    console.error('Failed to copy text to clipboard', error);
    return false;
  }
}
/**
 * 生成随机字符串
 * @param length 长度，默认为 16
 * @returns 随机字符串
 */
export function randomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 延迟函数
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化日期时间
 * @param timestamp 时间戳
 * @param format 格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间
 */
export function formatDateTime(timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 将区块链时间戳转换为实际时间
 * @param timestamp 区块链时间戳
 * @returns 转换后的时间戳（毫秒）
 */
export function convertBlockTimestamp(timestamp: number = Date.now()): number {
  const beginDate = constants.beginDate;
  // 区块链创世时间
  const d = new Date(beginDate); // 可根据实际创世时间调整
  const beginEpochTime = d.getTime();
  const t = Math.floor(beginEpochTime / 1000);

  // 将区块链时间戳转换为实际时间戳（毫秒）
  return (timestamp + t) * 1000;
}

/**
 * 格式化区块链时间戳为可读日期时间
 * @param timestamp 区块链时间戳
 * @param format 格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间字符串
 */
export function formatBlockTime(timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const realTimestamp = convertBlockTimestamp(timestamp);
  return formatDateTime(realTimestamp, format);
}

/**
 * 格式化时间戳为可读日期时间
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串
 */
export function formatTime(timestamp: number): string {
  if (!timestamp) return '-';

  // 判断是否为区块链时间戳（通常区块链时间戳小于当前时间的一个数量级）
  const now = Date.now();
  const isBlockchainTimestamp = timestamp < now / 1000 / 10;

  if (isBlockchainTimestamp) {
    return formatBlockTime(timestamp);
  } else {
    // 如果是毫秒时间戳
    if (timestamp > 10000000000) {
      return formatDateTime(timestamp);
    }
    // 如果是秒时间戳
    return formatDateTime(timestamp * 1000);
  }
}

/**
 * 计算从区块链创世时间到现在已经过去的时间
 * @param useI18n 是否使用国际化，默认为 true
 * @returns 格式化后的时间差字符串
 */
export function getTimeElapsed(useI18n: boolean = true): string {
  const beginDate = constants.beginDate;
  const genesisTime = new Date(beginDate).getTime();
  const now = Date.now();
  const diffMs = now - genesisTime;

  // 计算时间差的各个部分
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30; // 近似值
  const msPerYear = msPerDay * 365; // 近似值

  // 计算年、月、日、时
  const years = Math.floor(diffMs / msPerYear);
  const months = Math.floor((diffMs % msPerYear) / msPerMonth);
  const days = Math.floor((diffMs % msPerMonth) / msPerDay);
  const hours = Math.floor((diffMs % msPerDay) / msPerHour);

  if (useI18n) {
    const intl = getIntl();

    // 构建结果字符串（国际化版本）
    let result = '';
    if (years > 0) result += intl.formatMessage({ id: 'time.years' }, { value: years });
    if (months > 0) result += intl.formatMessage({ id: 'time.months' }, { value: months });
    if (days > 0) result += intl.formatMessage({ id: 'time.days' }, { value: days });
    if (hours > 0) result += intl.formatMessage({ id: 'time.hours' }, { value: hours });

    // 如果时间差小于1小时，至少显示"1时"
    if (result === '') {
      result = intl.formatMessage({ id: 'time.hours' }, { value: 1 });
    }

    return result;
  } else {
    // 构建结果字符串（非国际化版本）
    let result = '';
    if (years > 0) result += `${years}年`;
    if (months > 0) result += `${months}月`;
    if (days > 0) result += `${days}天`;
    if (hours > 0) result += `${hours}个小时`;

    // 如果时间差小于1小时，至少显示"1时"
    if (result === '') {
      result = '1个小时';
    }

    return result;
  }
}
