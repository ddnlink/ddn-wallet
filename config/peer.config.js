/**
 * FIXME: 这里无法通过 NODE_ENV=production yarn start 来切换开发环境，好像被 umi 劫持，umi dev 仅工作在 dev 环境下
 * 如果使用类似 DDN_ENV 变量替换，仍然无法使用，可能是 umi dev 首先使用 webpack 打包所致？
 */
export default {
  development: {
    requestUrl: 'http://peer.ddn.link:8000',
    // requestUrl: 'http://localhost:4096',
  },
  test: {
    requestUrl: 'http://116.62.219.11:8000',
  },
  production: {
    requestUrl: 'http://peer.ddn.link:8000',
  },
};
