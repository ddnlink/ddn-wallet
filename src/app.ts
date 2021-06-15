import { history } from 'umi';
import { CurrentUser } from './models/data';
import { getUser } from './utils/authority';
// import defaultSettings, { DefaultSettings } from '../config/defaultSettings';

/*
 * 插件：https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 该配置是一个 async 的 function。会在整个应用最开始执行，返回值会作为全局共享的数据。
 * Layout 插件、Access 插件以及用户都可以通过 useModel('@@initialState') 直接获取到这份数据。
 */
// export async function getInitialState() {
//   // const user = await queryCurrent();
//   const user = getUser();

//   return user;
// }

export async function getInitialState(): Promise<{
  currentUser?: CurrentUser;
  // settings?: DefaultSettings;
}> {
  // 如果是登录页面，不执行

  // console.log('登录页面: ', history.location.pathname);
  if (history.location.pathname !== '/user/login' && history.location.pathname !=='/' && history.location.pathname !=='/home') {
    try {
      const currentUser = getUser();
      return {
        currentUser,
        // settings: defaultSettings,
      };
    } catch (error) {
      // console.log('这里.................. error: ', error);
      history.push('/user/login');
    }
  }
  return {
    // settings: defaultSettings,
  };
}
