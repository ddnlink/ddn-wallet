import { stringify } from 'qs';
// import DdnJS from '@/utils/ddn-js';
import request from '../utils/request';

// --------------------------- login ------------------------ //
export async function login(params) {
  return request('/api/accounts/open/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      nethash: DdnJS.constants.nethash,
      version: '',
    },
    body: {
      ...params,
    },
  });
}

// --------------------------- Global ------------------------ //
// 从节点获取区块状态
export async function queryStatus() {
  return request('/api/blocks/getStatus');
}

// 从节点获取节点信息
export async function queryPeerInfo() {
  return request('/api/peers/version');
}

// 获取账户余额
export async function queryBalance(params) {
  return request(`/api/accounts?${stringify(params)}`);
}

// --------------------------- Home ------------------------ //

// 获取账户信息
export async function queryAccount(params) {
  return request(`/api/accounts?${stringify(params)}`);
}

// 获取交易记录数据
export async function queryTrans(params) {
  return request(`/api/transactions?${stringify(params)}`);
}

// --------------------------- Transaction ------------------------ //
// 提交交易（转账、AoB创建等各种交易都可以使用本接口）
export async function postTransaction(params) {
  return request('/peer/transactions/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      nethash: DdnJS.constants.nethash,
      version: '',
    },
    body: {
      ...params,
    },
  });
}
// --------------------------- Multi-Signature ------------------------ //
// 获取多重签名组及其账户信息
export async function queryMultiAccounts(params) {
  return request(`/api/multisignatures/accounts?${stringify(params)}`);
}

// 获取多重签名未处理交易信息
export async function queryMultiTansactions(params) {
  return request(`/api/multisignatures/pending?${stringify(params)}`);
}
// 获取公钥信息
export async function queryPublickey(params) {
  return request(`/api/accounts/getPublickey?${stringify(params)}`);
}

// 多重签名
export async function multiSign(params) {
  return request('/api/multisignatures/sign', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      nethash: DdnJS.constants.nethash,
      version: '',
    },
    body: {
      ...params,
    },
  });
}

// --------------------------- Vote ------------------------ //

// 获取受托人信息
export async function queryDelegates(params) {
  return request(`/api/delegates?${stringify(params)}`);
}

// 获取已投票的受托人(我投过票的)
// export async function queryVotedDelegates(params) {
//   return request(`/api/votes?${stringify(params)}`);
// }
// TODO 获取已投票的受托人(我投过票的),老版本ddn用的是这个接口，新版用的是上一个
export async function queryVotedDelegates(params) {
  return request(`/api/accounts/delegates?${stringify(params)}`);
}

// 获取给我投票的人
export async function queryVoters(params) {
  return request(`/api/delegates/voters?${stringify(params)}`);
}

// 获取受托人详情
export async function queryDelegateInfo(params) {
  return request(`/api/delegates/get?${stringify(params)}`);
}

// --------------------------- AOB ------------------------ //
// 获取指定发行商信息
export async function getIssuerByAddress(params) {
  return request(`/api/aob/issuers/${params}`);
}

// 获取指定发行商发行的资产
export async function getAssetsByIssuer(params) {
  return request(`/api/aob/assets/issuers/${params}/assets`);
}

// 获取指定账户所有aob的余额
export async function getAobList(params) {
  // console.log('getAobList params', `/api/aob/assets/balances/${params}`);

  return request(`/api/aob/assets/balances/${params}`);
}

// 获取指定账户所有aob的余额
export async function getAobBalances(params) {
  // console.log('getAobBalances params', params);

  return request(`/api/aob/assets/balances/${params}`);
}

// 获取指定账户指定aob的余额
export async function getAobBalance(params) {
  return request(`/api/aob/assets/balances/${params.address}/${params.currency}`);
}

// 获取指定账户指定资产转账记录
export async function getAobTransaction(params) {
  // console.log(
  //   `/api/aob/transfers/my/${params.address}/${params.currency}?limit=${params.limit ||
  //     10}&offset=${params.offset || 0}`
  // );

  return request(
    `/api/aob/transfers/my/${params.address}/${params.currency}?limit=${params.limit ||
      10}&offset=${params.offset || 0}`
  );
}
