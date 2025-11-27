// https://umijs.org/config/
import { join } from 'path';
import { defineConfig } from '@umijs/max';
import routes from './routes';
import proxy from './proxy';

export default defineConfig({
  antd: {
    // Ant Design 配置
    import: false,
    style: 'less',
    theme: {
      'primary-color': '#4865FE',
      'component-background': '#ffffff', // 不起作用？
    },
  },
  access: {},
  model: {},
  initialState: {},
  // https://umijs.org/docs/max/request
  request: {
    // 在消费数据时拿到后端的原始数据, 比如：{ success, data, code }
    dataField: ''
  },
  // 布局配置已移至 app.ts
  layout: {},
  // 代理配置
  proxy,
  // 路由配置
  routes,
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
    antd: true,
    title: true,
    baseNavigator: true,
    useLocalStorage: true,
  },

  // from ddn-explorer
  favicons: [
    // 完整地址
    // 'https://domain.com/favicon.ico',
    // 此时将指向 `/favicon.png` ，确保你的项目含有 `public/favicon.png`
    '/favicon.png'
  ],
  theme: { 
    'primary-color': '#1DA57A', 
    'logo-bg-color': '#013A6A',
    'light-primary-color': '#5bc5f4',
    'transparent-primary-color': '#5bc5f4',
    'dark-primary-color': '#013A6A',
    'card-actions-background': '#f5f8fa',
    'font-size-base': '16px',
    'font-size-secondary': '14px',
    'text-color': 'rgba(0, 0, 0, 0.65)',
    'text-color-secondary': 'rgba(0, 0, 0, .45)',
  },
  plugins: ['@umijs/max-plugin-openapi'],
  openAPI: {
    requestLibPath: "import { request } from 'umi'",
    // 或者使用在线的版本
    // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json",
    schemaPath: join(__dirname, 'oneapi.json'),
    mock: false,
  }
});
