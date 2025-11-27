// 代理配置
export default {
  '/api': {
    target: 'http://127.0.0.1:8001',
    changeOrigin: true,
    // pathRewrite: { '^/api': '' },
  },
};
