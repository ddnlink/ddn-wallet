import { queryPeerInfo, queryTrans } from '@/services/api';

const initialState = {
  peer: {},
  transData: {
    list: [],
    pagination: {},
  },
};

export default {
  namespace: 'home',

  state: { ...initialState },

  effects: {
    *fetchPeer(action, { call, put }) {
      const res = yield call(queryPeerInfo);
      console.log("fetchPeer res", res)
      yield put({
        type: 'peerState',
        payload: res.version,
      });
    },

    *fetchTrans({ payload }, { call, put }) {
      const { params } = payload;
      params.offset = (payload.pagination.current - 1) * payload.pagination.pageSize;
      params.limit = payload.pagination.pageSize;
      // console.log('payload', payload, 'params', params);
      const response = yield call(queryTrans, params);
      const result = {
        list: response.transactions,
        pagination: {
          total: response.count,
          pageSize: payload.pagination.pageSize,
          current: payload.pagination.current,
        },
      };
      yield put({
        type: 'saveTrans',
        payload: result,
      });
    },
  },

  reducers: {
    saveTrans(state, { payload }) {
      // console.log('payload4', payload);
      return {
        ...state,
        transData: payload,
      };
    },
    reset() {
      return initialState;
    },
    peerState(state, { payload }) {
      return {
        ...state,
        peer: payload,
      };
    },
  },
};
