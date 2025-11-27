/**
 * DAO 自治组织 API 服务
 */
import { request } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';

// 组织相关 API

// 获取组织列表
export async function queryOrgs(params?: { limit?: number; offset?: number }) {
  return request<API.Response<any>>('/api/dao/orgs', {
    method: 'GET',
    params,
  });
}

// 根据组织ID获取组织
export async function getOrgById(orgId: string) {
  return request<API.Response<any>>(`/api/dao/orgs/${orgId}`, {
    method: 'GET',
  });
}

// 根据地址获取组织
export async function getOrgByAddress(address: string) {
  return request<API.Response<any>>(`/api/dao/orgs/address/${address}`, {
    method: 'GET',
  });
}

// 根据标签获取组织
export async function getOrgsByTags(tags: string) {
  return request<API.Response<any>>(`/api/dao/orgs/tags/${tags}`, {
    method: 'GET',
  });
}

// 根据标签获取组织列表
export async function getOrgListByTags(tags: string) {
  return request<API.Response<any>>(`/api/dao/orgs/tags/${tags}/all`, {
    method: 'GET',
  });
}

// 根据状态获取组织
export async function getOrgByState(state: number) {
  return request<API.Response<any>>(`/api/dao/orgs/state/${state}`, {
    method: 'GET',
  });
}

// 根据状态获取组织列表
export async function getOrgListByState(state: number) {
  return request<API.Response<any>>(`/api/dao/orgs/state/${state}/all`, {
    method: 'GET',
  });
}

// 根据交易ID获取组织
export async function getOrgByTransactionId(transactionId: string) {
  return request<API.Response<any>>(`/api/dao/orgs/transaction/${transactionId}`, {
    method: 'GET',
  });
}

// 提交组织交易到区块链
export async function putOrg(transaction: any) {
  return request<API.Response<any>>('/api/dao/orgs', {
    method: 'POST',
    headers: {
      'nethash': DdnJS.config.nethash,
      'version': '0',
    },
    data: transaction,
  });
}

// 交易相关 API

// 获取所有交易列表
export async function queryExchanges(params?: { limit?: number; offset?: number }) {
  return request<API.Response<any>>('/api/dao/exchanges/all', {
    method: 'GET',
    params,
  });
}

// 根据组织ID获取交易
export async function getExchangeByOrgId(orgId: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/org_id/${orgId}`, {
    method: 'GET',
  });
}

// 根据组织ID获取交易列表
export async function getExchangeListByOrgId(orgId: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/org_id/${orgId}/all`, {
    method: 'GET',
  });
}

// 根据发送者地址获取交易
export async function getExchangeBySenderAddress(address: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/sender_address/${address}`, {
    method: 'GET',
  });
}

// 根据发送者地址获取交易列表
export async function getExchangeListBySenderAddress(address: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/sender_address/${address}/all`, {
    method: 'GET',
  });
}

// 根据接收者地址获取交易
export async function getExchangeByReceivedAddress(address: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/received_address/${address}`, {
    method: 'GET',
  });
}

// 根据接收者地址获取交易列表
export async function getExchangeListByReceivedAddress(address: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/received_address/${address}/all`, {
    method: 'GET',
  });
}

// 根据价格获取交易
export async function getExchangeByPrice(price: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/price/${price}`, {
    method: 'GET',
  });
}

// 根据价格获取交易列表
export async function getExchangeListByPrice(price: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/price/${price}/all`, {
    method: 'GET',
  });
}

// 根据状态获取交易
export async function getExchangeByState(state: number) {
  return request<API.Response<any>>(`/api/dao/exchanges/state/${state}`, {
    method: 'GET',
  });
}

// 根据状态获取交易列表
export async function getExchangeListByState(state: number) {
  return request<API.Response<any>>(`/api/dao/exchanges/state/${state}/all`, {
    method: 'GET',
  });
}

// 根据交易ID获取交易
export async function getExchangeByTransactionId(transactionId: string) {
  return request<API.Response<any>>(`/api/dao/exchanges/transaction/${transactionId}`, {
    method: 'GET',
  });
}

// 提交交易交易到区块链
export async function putExchange(transaction: any) {
  return request<API.Response<any>>('/api/dao/exchanges', {
    method: 'POST',
    headers: {
      'nethash': DdnJS.config.nethash,
      'version': '0',
    },
    data: transaction,
  });
}

// 贡献相关 API

// 获取所有贡献列表
export async function queryContributions() {
  return request<API.Response<any>>('/api/dao/contributions/all', {
    method: 'GET',
  });
}

// 根据组织ID获取贡献列表
export async function getContributionsByOrgId(orgId: string) {
  return request<API.Response<any>>(`/api/dao/contributions/${orgId}/all`, {
    method: 'GET',
  });
}

// 根据交易ID获取贡献
export async function getContributionByTransactionId(transactionId: string) {
  return request<API.Response<any>>(`/api/dao/contributions/transaction/${transactionId}`, {
    method: 'GET',
  });
}

// 提交贡献交易到区块链
export async function putContribution(transaction: any, org_id: string) {
  return request<API.Response<any>>(`/api/dao/contributions/${org_id}`, {
    method: 'POST',
    headers: {
      'nethash': DdnJS.config.nethash,
      'version': '0',
    },
    data: transaction,
  });
}

// 确认相关 API

// 根据组织ID获取确认列表
export async function getConfirmationsByOrgId(orgId: string) {
  return request<API.Response<any>>(`/api/dao/confirmations/${orgId}/all`, {
    method: 'GET',
  });
}

// 根据交易ID获取确认
export async function getConfirmationByTransactionId(transactionId: string) {
  return request<API.Response<any>>(`/api/dao/confirmations/transaction/${transactionId}`, {
    method: 'GET',
  });
}

// 提交确认交易到区块链
export async function putConfirmation(transaction: any) {
  return request<API.Response<any>>('/api/dao/confirmations', {
    method: 'POST',
    headers: {
      'nethash': DdnJS.config.nethash,
      'version': '0',
    },
    data: transaction,
  });
}
