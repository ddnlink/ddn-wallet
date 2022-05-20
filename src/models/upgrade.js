import { routerRedux } from 'dva/router';
import { queryTransaction, queryAccountBalance, postTrs } from '@/services/api';

const initialState = {
  step: {
    amount: '',
    receiverAddress: '',
    senderAddress: '',
  },
};

export default {
  namespace: 'upgrade',

  state: { ...initialState },

  effects: {
    *submitTransfer({ payload, callback }, { call, put }) {
      const response = yield call(postTrs, { ...payload });
      callback(response);
      // if (response.success) {
      //   yield put(routerRedux.push('/upgrade/result'));
      // } else {
      //   callback(response);
      // }
      yield put({
        type: 'saveStepFormData',
        payload,
      });
    },
    *getBalance({ payload, callback }, { call }) {
      const response = yield call(queryAccountBalance, { address: payload });
      callback(response);
    },
    *getTransaction({ payload, callback }, { call }) {
      const response = yield call(queryTransaction, { address: payload });
      callback(response);
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    reset() {
      return initialState;
    },
  },
};
