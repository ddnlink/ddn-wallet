// 运行时配置
import { history } from '@umijs/max';
import { requestConfig } from './utils/request';
import logo from "./assets/logo.svg";
import { getKeyStore } from './utils/authority';
import Footer from './components/Footer';
import RightRender from './components/RightRender';
import { APP_NAME } from './constants';

// 导入全局样式
import './global.less';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async (): Promise<API.CurrentUser | undefined> => {
    try {
      const keyStore = getKeyStore();
      if (keyStore && keyStore.address) {
        return {
          name: 'DDN User',
          address: keyStore.address,
          publicKey: keyStore.publicKey,
          access: 'user',
          // 初始时可能没有余额信息，后续会更新
          balance: 0,
          lock_height: 0
        };
      }
      return undefined;
    } catch (error) {
      console.error('获取用户信息失败', error);
      return undefined;
    }
  };

  const currentUser = await fetchUserInfo();

  return {
    name: APP_NAME,
    currentUser,
    fetchUserInfo,
  };
}

// 其他属性见：https://procomponents.ant.design/components/layout#prolayout
export const layout = ({ initialState, setInitialState }: { initialState: API.InitialState, setInitialState: (state: API.InitialState) => void }) => {
  return {
    title: APP_NAME,
    logo: logo,
    menu: {
      locale: true,
    },
    layout: 'top', // sidemenu
    contentStyle: { padding: '24px', minHeight: 'calc(100vh - 48px)' },
    contentWidth: 'Fluid',
    menuHeaderRender: undefined,
    rightRender: () => <RightRender initialState={initialState} setInitialState={setInitialState} />,

    footerRender: () => <Footer />,
    // 放在 rightRender 组件了
    // logout: () => {
    //   localStorage.removeItem(STORAGE_KEYS.KEY_STORE);
    //   setInitialState({ ...initialState, currentUser: undefined });
    //   message.success('退出登录成功');
    //   history.push('/user/login');
    // },
    // 水印设置
    waterMarkProps: {
      content: initialState?.currentUser?.address,
    },
    // 路由变化时重新渲染
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login' && location.pathname !== '/user/register') {
        history.push('/user/login');
      }
    },
  };
};


// 导出请求配置
export const request = requestConfig;
