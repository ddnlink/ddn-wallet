// https://umijs.org/config/
export default {
  manifest: {
    name: 'hbl-wallet',
    background_color: '#FFF',
    description: 'HBL wallet.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
  proxy: {
    '/api': {
      target: 'http://120.221.161.37:8001/api',
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  }
};
