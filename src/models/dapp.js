import {
  queryDelegates,
  queryVoters,
  queryDelegateInfo,
  queryVotedDelegates,
  postTransaction,
} from '@/services/api';
import DappData from '@/DappsData';

console.log('DappData', DappData);
const initialState = {
  catagories: {},
  dapps: {
    list: [],
    pagination: {},
  },
  dappDetail: {},
  installedDapp: [],
  installedDappIds: [],
};

export default {
  namespace: 'dapp',

  state: { ...initialState },

  effects: {
    *fetchCatagories({ payload }, { call, put }) {
      //   const response = yield call(queryDelegates, payload);
      yield put({
        type: 'saveCatagories',
        payload: DappData.catagories,
      });
    },
    *fetchDapps({ payload }, { call, put }) {
      //   const response = yield call(queryDelegates, payload);
      const res = {
        list: DappData.dapplist,
      };
      yield put({
        type: 'saveDapps',
        payload: res,
      });
    },
    *fetchDappDetail({ payload }, { call, put }) {
      //   const response = yield call(queryDelegates, payload);
      yield put({
        type: 'saveDappDetail',
        payload: DappData.dappDetail,
      });
    },
    *postReigster({ payload, callback }, { call }) {
      console.log('register starting. ', payload);
      const response = yield call(postTransaction, payload);
      console.log('response= ', response);
      callback(response);
    },
  },

  reducers: {
    saveCatagories(state, action) {
      console.log('saveCatagories action', action);
      return {
        ...state,
        catagories: action.payload,
      };
    },
    saveDapps(state, action) {
      console.log('saveDapps action', action);
      return {
        ...state,
        dapps: action.payload,
      };
    },
    saveDappDetail(state, action) {
      console.log('saveDappDetail action', action);
      return {
        ...state,
        dappDetail: action.payload,
      };
    },
    saveMyDapps(state, action) {
      return {
        ...state,
        standbyDelegates: action.payload,
      };
    },
    reset() {
      return initialState;
    },
  },
};
