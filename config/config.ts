// https://umijs.org/config/
import { defineConfig } from 'umi';

import routes from './router.config';
// import webpackplugin from './plugin.config';
// import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV, DDN_UI_SERVER_HOST } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },

  // umi routes: https://umijs.org/docs/routing
  routes,

  // chainWebpack: webpackplugin,
  fastRefresh: {},

  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },

  // 直接通过script脚本加载
  // headScripts: [
  //   // polyfill
  //   {
  //     src: '/xterm.js',
  //     type: 'text/javascript',
  //     crossOrigin: 'anonymous',
  //   },
  //   {
  //     src: '/socket.io.js',
  //     type: 'text/javascript',
  //     crossOrigin: 'anonymous',
  //   },
  // ],
  externals: {
    // react: 'window.React',
    // 'react-dom': 'window.ReactDOM',
    // antd: 'window.antd',
    // xterm: 'window.Terminal',
    // socket: 'window.socket',
    // io: 'window.io',
    // moment: 'moment',
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // theme: {
  //   'primary-color': defaultSettings.primaryColor,
  // },
  title: false,
  metas:[
    {
      name: 'keywords',
      content: 'DDN, DDN Blockchain, DDN Wallet, blockchain, DDN区块链, DDN社区, DDN钱包'
    },
    {
      name: 'description',
      content: '🍙 DDN区块链钱包。'
    },
  ],
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // esbuild: {},
  // https://github.com/zthxxx/react-dev-inspector
  // plugins: ['react-dev-inspector/plugins/umi/react-inspector'],
  // inspectorConfig: {
  //   // loader options type and docs see below
  //   exclude: [],
  //   babelPlugins: [],
  //   babelOptions: {},
  // },

  /**
   * 自定义环境变量
   * 这里是 DDN_UI_SERVER_HOST，可以定义更多个。
   * 这里最好使用，umi内置的环境变量（在代码里也能用） SOCKET_SERVER
   * 添加自定义全局变量，需要使用 define 透传，并在编译打包时被替换 参考：https://umijs.org/config#define
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    ApiHost: DDN_UI_SERVER_HOST || "http://localhost:7001",
  }
});



// // https://umijs.org/config/
// import os from 'os';
// import pageRoutes from './router.config';
// import webpackplugin from './plugin.config';
// import defaultSettings from '../src/defaultSettings';

// export default {
//   // add for transfer to umi
//   hash: true,
//   history: {
//     type: 'browser',
//   },
//   // base:''
//   publicPath: './',
//   antd: {},
//   dva: {
//     hmr: true,
//   },
//   locale: {
//     default: 'zh-CN', // default zh-CN
//     antd: true,
//     baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
//   },
//   // dynamicImport: {
//   //   loadingComponent: './components/PageLoading/index',
//   // },
//   // ...(!process.env.TEST && os.platform() === 'darwin'
//   //   ? {
//   //       dll: {
//   //         include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
//   //         exclude: ['@babel/runtime'],
//   //       },
//   //     }
//   //   : {}),

//   // 已经删除
//   // disableDynamicImport: true,
//   // plugins: [
//   //   [
//   //     'umi-plugin-react',
//   //     {

//   //       targets: {
//   //         ie: 9,
//   //       },

//   //     },
//   //   ],
//   //   // [
//   //   //   'umi-plugin-ga',
//   //   //   {
//   //   //     code: 'UA-72788897-6',
//   //   //   },
//   //   // ],
//   // ],
//   targets: {
//     ie: 11,
//   },
//   define: {
//     APP_TYPE: process.env.APP_TYPE || '',
//   },
//   // 路由配置
//   routes: pageRoutes,
//   // Theme for antd
//   // https://ant.design/docs/react/customize-theme-cn
//   theme: {
//     'primary-color': defaultSettings.primaryColor,
//   },
//   externals: {
//     '@antv/data-set': 'DataSet',
//   },
//   ignoreMomentLocale: true,
//   // lessLoaderOptions: {
//   //   javascriptEnabled: true,
//   // },
//   // cssLoaderOptions: {
//   //   modules: true,
//   //   getLocalIdent: (context, localIdentName, localName) => {
//   //     if (
//   //       context.resourcePath.includes('node_modules') ||
//   //       context.resourcePath.includes('ant.design.pro.less') ||
//   //       context.resourcePath.includes('global.less')
//   //     ) {
//   //       return localName;
//   //     }
//   //     const match = context.resourcePath.match(/src(.*)/);
//   //     if (match && match[1]) {
//   //       const antdProPath = match[1].replace('.less', '');
//   //       const arr = antdProPath
//   //         .split('/')
//   //         .map(a => a.replace(/([A-Z])/g, '-$1'))
//   //         .map(a => a.toLowerCase());
//   //       return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
//   //     }
//   //     return localName;
//   //   },
//   // },
//   manifest: {
//     basePath: '/',
//   },
//   proxy: proxy[REACT_APP_ENV || 'dev'],
//   chainWebpack: webpackplugin,
//   cssnano: {
//     mergeRules: false,
//   },
// };
