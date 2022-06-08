import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, message } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import newDdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@connect(({ upgrade, user }) => ({
  data: upgrade.step,
  account: user.currentAccount,
}))
@Form.create()
class Step1 extends React.PureComponent {
  validateAddress = (rule, address, callback) => {
    if (typeof address !== 'string') {
      callback(formatMessage({ id: 'app.transfer.address-format-error' }));
    }
    if ([DdnJS.constants.tokenPrefix].indexOf(address[0]) === -1) {
      callback(formatMessage({ id: 'app.transfer.address-format-error' }));
    }
    callback();
  };

  validateBalance = (rule, value, callback) => {
    const { account } = this.props;
    // console.log('account', account);
    if (value && value > account.balance / 100000000) {
      callback(formatMessage({ id: 'app.transfer.insufficient-balance' }));
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  generateAddress = (rule, value, callback) => {
    try {
      const keyPair = DdnJS.crypto.getKeys(value);
      const curAddress = DdnJS.crypto.getAddress(keyPair.publicKey);
      const { dispatch } = this.props;
      dispatch({
        type: 'upgrade/getBalance',
        payload: curAddress,
        callback: res => {
          //  if(res.data.account.balance<=0){
          //    callback('余额不足')
          //  }else{
          callback();
          //  }
        },
      });
    } catch (error) {
      callback();
    }
  };

  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        const keystore = getKeyStore();
        const { phaseKey } = keystore;
        if (!err) {
          try {
            const keyPair = DdnJS.crypto.getKeys(phaseKey);
            // const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey);
            const curAddress = DdnJS.crypto.getAddress(keyPair.publicKey);
            const newKeyPair = newDdnJS.crypto.getKeys(phaseKey);
            const newCurAddress = newDdnJS.crypto.generateAddress(newKeyPair.publicKey, 'D');
            dispatch({
              type: 'upgrade/getBalance',
              payload: curAddress,
              callback: res => {
                if (res.success) {
                  values.amount = String(res.data.account.balance); //String(1);
                  values.senderAddress = curAddress;
                  values.receiverAddress = newCurAddress;
                  values.secret = phaseKey;
                  dispatch({
                    type: 'upgrade/saveStepFormData',
                    payload: values,
                  });
                  router.push('/upgrade/confirm');
                }
              },
            });
          } catch (error) {
            console.log(error);
            message.error(error);
          }
        } else {
          message.error(err);
        }
      });
    };
    return (
      <Fragment>
        <div className={styles.desc}>
          <h1>{formatMessage({ id: 'app.upgrade.introction' })}</h1>
          <p>{formatMessage({ id: 'app.upgrade.info' })}</p>
          <p>{formatMessage({ id: 'app.upgrade.function1' })}</p>
          <p>{formatMessage({ id: 'app.upgrade.function2' })}</p>
          <p>{formatMessage({ id: 'app.upgrade.function3' })}</p>
          <p>{formatMessage({ id: 'app.upgrade.time' })}</p>
        </div>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          {/* <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'app.transfer.secret' })}
          >
            {getFieldDecorator('secret', {
              initialValue: data.secret,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.transfer.address-empty-error' }),
                },
                {
                  validator: this.generateAddress,
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'app.transfer.address-placeholder' })} />)}
          </Form.Item> */}
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            {/* <Button onClick={reset}>
              重置
            </Button> */}
            <Button type="primary" onClick={onValidateForm}>
              {/* {formatMessage({ id: 'app.transfer.next' })} */}
              {formatMessage({ id: 'app.upgrade.begin' })}
            </Button>
          </Form.Item>
        </Form>
        {/* <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>{formatMessage({ id: 'app.transfer.introction' })}</h3>
          <p>{formatMessage({ id: 'app.transfer.confirm' })}</p>
        </div> */}
      </Fragment>
    );
  }
}

export default Step1;
