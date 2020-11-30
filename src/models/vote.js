import {
  queryDelegates,
  queryVoters,
  queryDelegateInfo,
  queryVotedDelegates,
  postTransaction,
} from '@/services/api';

const initialState = {
  delegates: {
    list: [],
    pagination: {},
  },
  standbyDelegates: {
    list: [],
    pagination: {},
  },
  votedDelegates: {
    list: [],
    pagination: {},
  },
  voters: {
    list: [],
    pagination: {},
  },
  delegateInfo: {},
};

export default {
  namespace: 'vote',

  state: { ...initialState },

  effects: {
    *fetchDelegates({ payload }, { call, put }) {
      const response = yield call(queryDelegates, payload);
      const res = {
        list: response.delegates,
      };

      yield put({
        type: 'saveDelegates',
        payload: res,
      });
    },
    *fetchStandbyDelegates({ payload }, { call, put }) {
      const response = yield call(queryDelegates, payload);
      const res = {
        list: response.delegates,
        pagination: {
          total: response.totalCount - 101,
        },
      };

      yield put({
        type: 'saveStandbyDelegates',
        payload: res,
      });
    },
    *fetchVotedDelegates({ payload }, { call, put }) {
      const response = yield call(queryVotedDelegates, payload);
      const res = {
        list: response.delegates,
      };

      yield put({
        type: 'saveVotedDelegates',
        payload: res,
      });
    },
    *fetchVoters({ payload }, { call, put }) {
      const response = yield call(queryVoters, payload);
      const res = {
        list: response.accounts,
      };

      yield put({
        type: 'saveVoters',
        payload: res,
      });
    },
    *fetchDelegateInfo({ payload }, { call, put }) {
      const response = yield call(queryDelegateInfo, payload);
      yield put({
        type: 'saveDelegateInfo',
        payload: response,
      });
    },
    *voting({ payload, callback }, { call }) {
      const response = yield call(postTransaction, payload);
      if (!res.success) {
        message.error(res.error);
      } else {
        message.error('successfull');
      }
      callback(response);
    },
    *postReigster({ payload, callback }, { call }) {
      const response = yield call(postTransaction, payload);
      if (!res.success) {
        message.error(res.error);
      } else {
        message.error('successfull');
      }
      callback(response);
    },
  },

  reducers: {
    saveDelegates(state, action) {
      return {
        ...state,
        delegates: action.payload,
      };
    },
    saveStandbyDelegates(state, action) {
      return {
        ...state,
        standbyDelegates: action.payload,
      };
    },
    saveVotedDelegates(state, action) {
      return {
        ...state,
        votedDelegates: action.payload,
      };
    },
    saveVoters(state, action) {
      return {
        ...state,
        voters: action.payload,
      };
    },
    saveDelegateInfo(state, action) {
      return {
        ...state,
        delegateInfo: action.payload.delegate || {},
      };
    },
    reset() {
      return initialState;
    },
  },
};
