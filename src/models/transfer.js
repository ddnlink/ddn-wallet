import { routerRedux } from 'dva/router';
import { postTransaction, queryAccountBalance } from '@/services/api';

const initialState = {
  step: {
    payAccount: '',
    receiverAccount: '',
    amount: '',
    remark: '',
    transId: '',
  },
};

export default {
  namespace: 'transfer',

  state: { ...initialState },

  effects: {
    *submitTransfer({ payload, callback }, { call, put }) {
      const response = yield call(postTransaction, { transaction: payload.transaction });
      if (response.success) {
        const newdata = { ...payload };
        delete newdata.transaction;
        newdata.transId = response.transactionId;
        yield put({
          type: 'saveStepFormData',
          payload: newdata,
        });
        yield put(routerRedux.push('/transfer/result'));
      } else {
        callback(response);
      }
    },
    *getBalance({ payload, callback }, { call, put }) {
      const response = yield call(queryAccountBalance, { address: payload });
      callback(response);
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
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
