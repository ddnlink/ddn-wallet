import React from 'react';
import { Icon } from 'antd';
import bip39 from 'bip39';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

function validatorPhasekey(rule, value, callback) {
  if (!value) {
    callback(formatMessage({ id: 'app.login.phasekey-placeholder' }));
  } else {
    const isphaseKey = bip39.validateMnemonic(value.trim());
    if (!isphaseKey) {
      callback(formatMessage({ id: 'app.login.phasekey-error' }));
    }
  }
  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  callback();
}

export default {
  UserName: {
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Wallet: {
    props: {
      placeholder: 'PhassKey',
      rows: '3',
      cols: '20',
    },
    rules: [
      {
        validator: validatorPhasekey,
      },
    ],
  },
};
