
import {
  queryMultiAccounts,
  queryMultiTansactions,
  postTransaction,
  queryPublickey,
  multiSign
} from '@/services/api';

const initialState = {
  accounts: [],
  transactions: []
}

export default {
  namespace: 'multi',

  state: {...initialState},

  effects: {
    *fetchAccounts({ payload }, { call, put }) {
      // console.log('payload', payload);
      const response = yield call(queryMultiAccounts, payload);
      yield put({
        type: 'saveAccounts',
        payload: response,
      });
    },
    *fetchTransactions({ payload }, { call, put }) {
      const response = yield call(queryMultiTansactions, payload);
      yield put({
        type: 'saveTransactions',
        payload: response,
      });
    },
    *fetchPublickey({ payload, callback }, { call }) {
      const response = yield call(queryPublickey, payload);
      callback(response)
    },
    *createMultiTansactions({ payload, callback }, { call }) {
      const response = yield call(postTransaction, payload);
      callback(response)
    },
    *createMultiSign({ payload, callback }, { call }) {
      const response = yield call(multiSign, payload);
      callback(response)
    },
  },

  reducers: {
    saveAccounts(state, { payload }) {
      return {
        ...state,
        accounts: payload.accounts,
      };
    },
    saveTransactions(state, { payload }) {
      return {
        ...state,
        transactions: payload.transactions,
      };
    },
    reset() {
      return initialState;
    },
  },
};
