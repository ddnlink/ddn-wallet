const { DDN_UI_SERVER_HOST } = process.env;

/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: DDN_UI_SERVER_HOST || "http://localhost:8001",
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/peer/': {
      target: DDN_UI_SERVER_HOST || "http://localhost:8001",
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: DDN_UI_SERVER_HOST || "http://localhost:8001",
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://106.15.227.133:8001',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
