import { routerRedux } from 'dva/router';
import { getFakeCaptcha, login } from '@/services/api';
import { setAuthority, setKeyStore } from '@/utils/authority';
import { clearUser, setUser } from '@/utils/cookies';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield call(login, { publicKey: payload.keyStore.publicKey });
      // callback(response);
      yield put({
        type: 'changeLoginStatus',
        payload,
      });
      // Login successfully and redirect
      // console.log('payload', payload);
      if (payload.status === 'ok') {
        reloadAuthorized();
        // const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        const { redirect } = params;
        // console.log('redirect', redirect);
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: '',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // console.log('changeLoginStatus payload:', payload);
      setKeyStore(payload.keyStore);
      setAuthority(payload.currentAuthority);
      setUser(payload.data.user);

      return {
        ...state,
        state: payload.state,
        type: payload.type,
      };
    },
  },
};
