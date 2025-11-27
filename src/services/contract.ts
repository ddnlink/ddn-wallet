/**
 * 智能合约 API 服务
 */
import { request } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';

// 查询合约列表
export async function queryContracts(params?: { limit?: number; offset?: number }) {
  return request<API.Response<API.ContractList>>('/api/contracts', {
    method: 'GET',
    params,
  });
}

// 获取单个合约
export async function getContract(params: { id: string }) {
  return request<API.Response<API.ContractInfo>>('/api/contracts/get', {
    method: 'GET',
    params,
  });
}

// 获取合约代码
export async function getContractCode(params: { id: string }) {
  return request<API.Response<{ code: string }>>('/api/contracts/code', {
    method: 'GET',
    params,
  });
}

// 获取合约元数据
export async function getContractMeta(params: { id: string }) {
  return request<API.Response<{ metadata: string; meta?: API.ContractMeta }>>('/api/contracts/metadata', {
    method: 'GET',
    params,
  });
}

// 获取交易的合约执行结果
export async function getContractResult(params: { transactionId?: string; id?: string }) {
  return request<API.Response<API.ContractResultList>>('/api/contracts/results', {
    method: 'GET',
    params,
  });
}

// 获取合约转账
export async function getContractTransfers(params: { id?: string; senderId?: string; recipientId?: string }) {
  return request<API.Response<API.ContractTransferList>>('/api/contracts/transfers', {
    method: 'GET',
    params,
  });
}

// 调用合约查询方法
export async function callContractMethod(data: { id: string; method: string; args?: string[] }) {
  return request<API.Response<any>>('/api/contracts/call', {
    method: 'POST',
    data,
  });
}

// 调用合约方法（修改状态）
export async function sendContractMethod(data: any) {
  return request<API.Response<{ transactionId: string }>>('/api/transactions', {
    method: 'POST',
    headers: {
      nethash: DdnJS.constants.nethash,
      version: '',
    },
    data,
  });
}

// 转账到合约
export async function transferToContract(data: any) {
  return request<API.Response<{ transactionId: string }>>('/api/transactions', {
    method: 'POST',
    headers: {
      nethash: DdnJS.constants.nethash,
      version: '',
    },
    data,
  });
}

// 部署智能合约
export async function deployContract(data: any) {
  return request<API.Response<{ transactionId: string }>>('/api/transactions', {
    method: 'POST',
    data,
  });
}
