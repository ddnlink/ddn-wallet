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
  }
});
