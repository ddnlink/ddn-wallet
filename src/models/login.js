import { routerRedux } from 'dva/router';
import { getFakeCaptcha, login, queryAccountBalance } from '@/services/api';
import { setAuthority, setKeyStore } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { DdnJS } from '@/utils/ddn-js';
export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield call(login, { publicKey: payload.keyStore.publicKey });
      const keyPair = DdnJS.crypto.getKeys(payload.keyStore.phaseKey);
      const curAddress = DdnJS.crypto.getAddress(keyPair.publicKey); // 主网的ddn-js有这个方法
      // const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey);// 测试网的ddn-js有这个方法
      // console.log(curAddress)
      // return
      let data = yield call(queryAccountBalance, { address: curAddress });
      data = data ? data : {};
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
        if (data.success && data.data.account.balance > 0) {
          yield put(routerRedux.replace('/upgrade/fill'));
        } else {
          yield put(routerRedux.replace(redirect || '/'));
        }
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
      setKeyStore(payload.keyStore);
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        state: payload.state,
        type: payload.type,
      };
    },
  },
};
