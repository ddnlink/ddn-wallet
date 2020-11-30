import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { postTransaction } from '@/services/api';

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
        if (!response.success) {
          message.error(response.error);
        } else {
          message.info('successfull');
        }
        yield put({
          type: 'saveStepFormData',
          payload: newdata,
        });
        yield put(routerRedux.push('/transfer/result'));
      } else {
        callback(response);
      }
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
