import {
  getIssuerByAddress,
  // getAobList,
  getDaos,
  getMyOrgs,
  createOrUpdateOrg,
  getAobTransaction,
} from '@/services/api';

const initialState = {
  issuer: {},
  dao: {
    list: [],
    count: 0,
  },
  myOrgs: {
    list: [],
    count: 0,
  },
  transactions: [],
};

export default {
  namespace: 'dao',

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
    *getMyOrg({ payload }, { call, put }) {
      const response = yield call(getMyOrgs, payload);
      console.log('myorgs', response, payload);
      yield put({
        type: 'saveMyOrgs',
        payload: response.result,
      });
    },
    *getDaoList({ payload }, { call, put }) {
      const response = yield call(getDaos, payload.address);
      console.log('getAobList response', response);

      if (response.success) {
        yield put({
          type: 'saveDaoList',
          payload: response.result,
        });
      }
    },
    *getAobTransfers({ payload }, { call, put }) {
      const response = yield call(getAobTransaction, payload);
      console.log('getAobTransfers payload', payload);

      yield put({
        type: 'saveAoBTransfers',
        payload: response,
      });
    },
    *putOrg({ payload, callback }, { call }) {
      const res = yield call(createOrUpdateOrg, payload);
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
    saveMyOrgs(state, { payload }) {
      // console.log('saveAssetsByIssuer payload', payload);

      return {
        ...state,
        myOrgs: {
          list: payload.rows,
          count: payload.total,
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
    saveDaoList(state, { payload }) {
      // console.log('payload', payload);

      return {
        ...state,
        dao: {
          list: payload.rows,
          count: payload.total,
        },
      };
    },
    reset() {
      return initialState;
    },
  },
};
