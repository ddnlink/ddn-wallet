import {
  queryDappAll,
  queryDappInstalledAll,
  queryDappDetail,
  queryCatagories,
  postTransaction,
  runDappApi,
  postInstall,
  postUninstall,
  postLaunched,
} from '@/services/api';

const initialState = {
  catagories: {},
  dapps: {
    list: [],
    pagination: {},
  },
  dappsInstalled: {
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
      const response = yield call(queryCatagories, payload);
      if (response.success === true) {
        yield put({
          type: 'saveCatagories',
          payload: response.categories,
        });
      }
    },
    *fetchDapps({ payload }, { call, put }) {
      const response = yield call(queryDappAll, payload);
      // const res = {
      //   list: DappData.dapplist,
      // };
      if (response.success === true) {
        yield put({
          type: 'saveDapps',
          payload: response.result.rows,
        });
      }
      // yield put({
      //   type: 'saveDapps',
      //   payload: res,
      // });
    },
    *fetchDappsInstalled({ payload }, { call, put }) {
      const response = yield call(queryDappInstalledAll, payload);
      // const res = {
      //   list: DappData.dapplist,
      // };
      console.log(';;;', response);
      if (response.success === true) {
        yield put({
          type: 'saveDappsInstalled',
          payload: response.result.rows,
        });
      }
      // yield put({
      //   type: 'saveDapps',
      //   payload: res,
      // });
    },
    *fetchDappDetail({ payload }, { call, put }) {
      const response = yield call(queryDappDetail, payload);
      if (response.success === true) {
        yield put({
          type: 'saveDappDetail',
          payload: response.dapp,
        });
      }
    },
    *postReigster({ payload, callback }, { call }) {
      console.log('register starting. ', payload);
      const response = yield call(postTransaction, payload);
      console.log('response= ', response);
      callback(response);
    },
    *runDapp({ payload }, { call }) {
      console.log('register starting. ', payload);
      const response = yield call(runDappApi, payload);
      console.log(response);
      if (response) {
        window.open(response);
      }
    },
    *install({ payload, callback }, { call }) {
      console.log('register starting. ', payload);
      const response = yield call(postInstall, payload);
      console.log(response);
      if (response) {
        callback(response);
      }
    },
    *uninstall({ payload, callback }, { call }) {
      console.log('register starting. ', payload);
      const response = yield call(postUninstall, payload);
      console.log(response);
      if (response) {
        // window.open(response)
        callback(response);
      }
    },
    *launched({ payload, callback }, { call }) {
      console.log('register starting. ', payload);
      const response = yield call(postLaunched, payload);
      console.log(response);
      if (response) {
        callback(response);
      }
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
    saveDappsInstalled(state, action) {
      console.log('saveDappsInstalled', action);
      return {
        ...state,
        dappsInstalled: action.payload,
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
