/**
 * 网络请求工具
 * 
 * 官网文档：
 * 
 * https://umijs.org/docs/max/request
 * 
 * 执行顺序：
 * 1. responseInterceptors 在请求成功返回后首先执行，处理 HTTP 状态码为 200 但业务逻辑可能失败的情况
 * 2. errorThrower 在 responseInterceptors 之后执行，对错误信息进行处理（不要抛出）
 * 3. errorHandler 捕获任何错误（包括 errorThrower 抛出的错误）后执行错误处理（展示）
 * 
 * 处理方式：
 * 1. responseInterceptors 显示错误消息但不抛出错误，让请求正常返回
 * 2. errorThrower 处理（不抛出，不然会出现错误页面，并不能走到下一步）错误但不显示消息
 * 3. errorHandler 显示错误消息并拒绝 Promise
 */
import { message } from 'antd';
import { history } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from './authority';
import { API_BASE_URLS, STORAGE_KEYS } from '@/constants';

console.log('DdnJS:', DdnJS);

// 获取环境配置
const ENV = process.env.NODE_ENV || 'development';

// 获取API基础URL
export function getApiBaseUrl() {
  return API_BASE_URLS[ENV];
}

// 请求拦截器
export const requestInterceptors = [
  (url: string, options: any) => {
    const keyStore = getKeyStore();
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      nethash: DdnJS.config.nethash,
      version: '',
    };

    // 如果有密钥，添加到请求头
    if (keyStore && keyStore.publicKey) {
      headers['DDN-Public-Key'] = keyStore.publicKey;
    }

    return {
      url: `${getApiBaseUrl()}${url}`,
      options: { ...options, headers },
    };
  },
];

// 响应拦截器
export const responseInterceptors = [
  async (response: Response) => {
    const res = await response;
    // 正确获取 data 属性
    const data = res.data;
    // console.log('data:', data);

    // 处理错误响应
    if (data && !data.success) {
      // 如果是未授权错误，跳转到登录页
      if (data.error && (data.error.includes('auth') || data.error.includes('login'))) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem(STORAGE_KEYS.KEY_STORE);
        history.push('/user/login');
      } else if (data.error) {
        // 只有当有明确的错误信息时才显示错误消息
        message.error(data.error || '请求失败');
      }
      // 注意：这里不抛出错误，让请求正常返回，由业务代码处理
    }

    return response;
  },
];

// 自定义错误抛出器
export const errorThrower = (res: any) => {
  // 检查 res 是否存在且有正确的结构
  if (!res) {
    return; // 如果 res 不存在，直接返回，不抛出错误
  }

  // 只有当 success 为 false 且有明确的错误信息时才抛出错误
  if (res.success === false && res.error) {
    console.log('errorThrower res.error:', res);

    const error: any = new Error(res.error);
    error.name = 'BizError';
    error.info = res;
    // error.displayed = true; // 标记错误已经显示过
    // throw error; // 这里不能抛出，否则后面不会弹出错误信息
  }
  // 如果只是 success: false 但没有错误信息，不抛出错误
};

// 错误处理
export const errorHandler = (error: any) => {
  const { response } = error;
  console.log('errorHandler error:', error);

  // 处理 BizError 类型错误
  if (error.name === 'BizError') {
    // 只有当错误没有被显示过时才显示
    message.error(error.message || '业务处理失败');
    return Promise.reject(error);
  }

  if (response && response.status) {
    const { status, statusText } = response;
    const errorText = statusText || '请求错误';

    // 避免重复显示错误消息
    if (status !== 200) {
      message.error(`请求错误 ${status}: ${errorText}`);
    }

    // 如果是未授权错误，跳转到登录页
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.KEY_STORE);
      history.push('/user/login');
    }
  } else if (!response) {
    message.error('网络异常，无法连接服务器');
  }

  return Promise.reject(error);
};

// 导出完整的请求配置
export const requestConfig = {
  errorConfig: {
    errorThrower,
    errorHandler,
  },
  requestInterceptors,
  responseInterceptors,
};

