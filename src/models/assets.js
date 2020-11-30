import { message } from 'antd';
import {
  getIssuerByAddress,
  // getAobList,
  getAobBalances,
  getAssetsByIssuer,
  postTransaction,
  getAobTransaction,
} from '@/services/api';

const initialState = {
  issuer: {},
  myAob: {
    list: [],
    count: 0,
  },
  myIssueAob: {
    list: [],
    count: 0,
  },
  transactions: [],
};

export default {
  namespace: 'assets',

  state: { ...initialState },

  effects: {
    *fetchIssuer({ payload }, { call, put }) {
      const response = yield call(getIssuerByAddress, payload);

      yield put({
        type: 'saveIssuer',
        payload: response,
      });

      return response.result;
    },
    *fetchMyAssets({ payload }, { call, put }) {
      const response = yield call(getAssetsByIssuer, payload);
      yield put({
        type: 'saveAssetsByIssuer',
        payload: response,
      });
    },
    *getAobList({ payload }, { call, put }) {
      const response = yield call(getAobBalances, payload.address);
      // console.log('getAobList response', response);

      if (response.success) {
        yield put({
          type: 'saveAssetsByAddress',
          payload: response.result,
        });
      }
    },
    *getAobTransfers({ payload }, { call, put }) {
      const response = yield call(getAobTransaction, payload);

      yield put({
        type: 'saveAoBTransfers',
        payload: response,
      });
    },
    *postTrans({ payload, callback }, { call }) {
      const res = yield call(postTransaction, payload);
      if (!res.success) {
        message.error(res.error);
      } else {
        message.info('successfull');
      }
      callback(res);
    },
  },

  reducers: {
    saveIssuer(state, { payload }) {
      return {
        ...state,
        issuer: payload.result || {},
      };
    },
    saveAssetsByIssuer(state, { payload }) {
      // console.log('saveAssetsByIssuer payload', payload);

      return {
        ...state,
        myIssueAob: {
          list: payload.result.rows,
          count: payload.result.total,
        },
      };
    },
    saveAoBTransfers(state, { payload }) {
      console.log('trans payload', payload);
      return {
        ...state,
        transactions: payload.result.rows,
      };
    },
    saveAssetsByAddress(state, { payload }) {
      // console.log('payload', payload);

      return {
        ...state,
        myAob: {
          list: payload,
          count: payload.length,
        },
      };
    },
    reset() {
      return initialState;
    },
  },
};
