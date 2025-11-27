/**
 * 数字存证 API 服务
 */
import { request } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';

// 创建存证
export async function createEvidence(data: any) {
  return request<API.Response<any>>('/api/transactions', {
    method: 'POST',
    headers: {
      'nethash': '0ab796cd',
      'version': '0',
    },
    data,
  });
}

// 根据shortHash获取资产详情
export async function getEvidenceByShortHash(shortHash: string) {
  return request<API.Response<any>>(`/api/evidences/shortHash/${shortHash}`, {
    method: 'GET',
  });
}

// 根据数据hash获取资产详情
export async function getEvidenceByHash(hash: string) {
  return request<API.Response<any>>(`/api/evidences/hash/${hash}`, {
    method: 'GET',
  });
}

// 根据数据交易id获取资产详情
export async function getEvidenceByTransactionId(transactionId: string) {
  return request<API.Response<any>>(`/api/evidences/transaction/${transactionId}`, {
    method: 'GET',
  });
}

// 获取所有资产列表
export async function getAllEvidences(params?: { pagesize?: number; pageindex?: number }) {
  return request<API.Response<any>>('/api/evidences/all', {
    method: 'GET',
    params,
  });
}

// 根据数据类型获取这一类存证列表
export async function getEvidencesByType(type: string, params?: { pagesize?: number; pageindex?: number }) {
  return request<API.Response<any>>(`/api/evidences/type/${type}/all`, {
    method: 'GET',
    params,
  });
}
