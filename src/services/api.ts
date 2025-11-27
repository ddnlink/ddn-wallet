/**
 * API 服务
 */
import { request } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';

// 账户相关 API
export async function queryAccount(params: { address: string }) {
  return request<API.Response<API.AccountInfo>>('/api/accounts', {
    method: 'GET',
    params,
  });
}

// 交易相关 API
export async function queryTrans(params: any) {
  return request<API.Response<API.TransactionList>>('/api/transactions', {
    method: 'GET',
    params,
  });
}

// 创建交易
export async function createTransaction(data: any) {
  return request<API.Response<any>>('/api/transactions', {
    method: 'POST',
    headers: {
      'nethash': '0ab796cd',
      'version': '0',
    },
    data,
  });
}

// 提交交易（转账、AoB创建等各种交易都可以使用本接口）
export async function postTransaction(params: any) {
  return request<API.Response<any>>('/api/transactions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      nethash: DdnJS.constants.nethash,
      version: '',
    },
    data: params,
  });
}

// 节点信息 API
export async function queryPeerInfo() {
  // This API might return either a standard Response<PeerInfo> or a direct version object
  // We'll handle both formats in the component
  return request<API.Response<API.PeerInfo> | { version: { version: string; build: string; net: string } }>('/api/peers/version', {
    method: 'GET',
  });
}

// 区块信息 API
export async function queryLatestBlock() {
  return request<API.Response<API.BlockInfo>>('/api/blocks/getHeight', {
    method: 'GET',
  });
}

// 受托人相关 API
export async function queryDelegates(params: any) {
  return request<API.Response<{ delegates: API.DelegateInfo[] }>>('/api/delegates', {
    method: 'GET',
    params,
  });
}

// 投票相关 API
export async function queryVoters(params: { publicKey: string }) {
  return request<API.Response<{ accounts: API.VoterInfo[] }>>('/api/delegates/voters', {
    method: 'GET',
    params,
  });
}

// 获取我的投票列表
export async function queryVotes(params: { address: string }) {
  return request<API.Response<{ delegates: API.DelegateInfo[] }>>('/api/votes', {
    method: 'GET',
    params,
  });
}

// 资产相关 API
export async function queryAssets(params: any) {
  return request<API.Response<{ assets: API.AssetInfo[] }>>('/api/aob/assets', {
    method: 'GET',
    params,
  });
}

// --------------------------- AOB ------------------------ //
// 获取指定发行商信息
export async function getIssuerByAddress(address: string) {
  return request<API.Response<any>>(`/api/aob/issuers/${address}`);
}

// 获取指定发行商发行的资产
export async function getAssetsByIssuer(issuerName: string) {
  return request<API.Response<any>>(`/api/aob/assets/issuers/${issuerName}/assets`);
}

// 获取指定账户所有aob的余额
export async function getAobBalances(address: string) {
  return request<API.Response<any>>(`/api/aob/assets/balances/${address}`);
}

// 获取指定账户指定aob的余额
export async function getAobBalance(params: { address: string; currency: string }) {
  return request<API.Response<any>>(`/api/aob/assets/balances/${params.address}/${params.currency}`);
}

// 获取指定账户指定资产转账记录
export async function getAobTransaction(params: { address: string; currency: string; limit?: number; offset?: number }) {
  return request<API.Response<any>>(
    `/api/aob/transfers/my/${params.address}/${params.currency}?limit=${params.limit || 10}&offset=${params.offset || 0}`
  );
}

// 获取指定资产转账记录
export async function getAobTransfers(currency: string, params?: { limit?: number; offset?: number }) {
  const limit = params?.limit || 10;
  const offset = params?.offset || 0;
  return request<API.Response<any>>(`/api/aob/transfers/${currency}?limit=${limit}&offset=${offset}`);
}

// 多重签名相关 API
export async function queryMultiSignatureAccounts(params: { publicKey: string }) {
  return request<{ success: boolean, data: { accounts: any[] } }>('/api/multisignatures/accounts', {
    method: 'GET',
    params,
  });
}

// 获取多重签名待处理交易
export async function queryPendingMultiSignatures(params: { publicKey: string }) {
  // 根据实际返回的数据结构调整类型
  return request<{ success: boolean, transactions: any[] }>('/api/multisignatures/pending', {
    method: 'GET',
    params,
  });
}

// 获取用户已签名的交易
export async function querySignedTransactions(params: { publicKey: string }) {
  return request<{ success: boolean, transactions: any[] }>('/api/multisignatures/signatures', {
    method: 'GET',
    params,
  });
}

// 检查账户是否可以创建多重签名
export async function checkMultiSignatureEligibility(params: { address: string }) {
  return request<{
    success: boolean,
    eligible: boolean,
    reason?: string,
    details?: {
      currentMultisignature?: {
        min: number,
        lifetime: number,
        keysgroup: string[]
      },
      pendingTransactions?: any[]
    }
  }>('/api/multisignatures/checkEligibility', {
    method: 'GET',
    params,
  });
}

// 获取交易的签名进度
export async function getSignatureProgress(params: { transactionId: string }) {
  return request<{
    success: boolean,
    transaction: {
      id: string,
      type: number,
      senderId: string,
      requiredSignatures: number,
      currentSignatures: number,
      signers: Array<{publicKey: string, address: string}>,
      pendingSigners: Array<{publicKey: string, address: string}>,
      progress: number,
      isReady: boolean,
      expirationTime: number,
      isExpired: boolean
    }
  }>('/api/multisignatures/signatureProgress', {
    method: 'GET',
    params,
  });
}

// 创建多重签名账户
export async function createMultiSignatureAccount(data: any) {
  return request<{ success: boolean, transactionId: string }>('/api/multisignatures', {
    method: 'PUT', // 根据文档，应该使用 PUT 方法
    data,
  });
}

// 签名交易
export async function signTransaction(data: any) {
  return request<{ success: boolean }>('/api/multisignatures/sign', {
    method: 'POST',
    data,
  });
}
