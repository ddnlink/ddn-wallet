/**
 * FIXME: 这里无法通过 NODE_ENV=production yarn start 来切换开发环境，好像被 umi 劫持，umi dev 仅工作在 dev 环境下
 * 如果使用类似 DDN_ENV 变量替换，仍然无法使用，可能是 umi dev 首先使用 webpack 打包所致？
 */
export default {
  development: {
    requestUrl: 'http://47.94.144.216:8000',
    centerHost: 'http://localhost:7009',
    // requestUrl: 'http://106.15.227.133:8001',
  },
  test: {
    requestUrl: 'http://localhost:8001',
  },
  production: {
    // requestUrl: 'http://106.15.227.133:8001',
    requestUrl: 'http://47.94.144.216:8000',
    // centerHost: 'http://47.244.25.145:7009',
  },
  address: 'DFy6P2sN1KLDNtppnqLBPWcnH8GTJRouGj', // 这个字段用户和后端验证是否统一，没有其他的作用
};
