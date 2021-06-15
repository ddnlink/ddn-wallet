import React from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Alert, Divider, message } from 'antd';
import { history } from 'umi';
// import { digitUppercase } from '@/utils/utils';
import { formatMessage } from 'umi';
import DdnJS from '@ddn/js-sdk';
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

@connect(({ transfer, loading }) => ({
  submitting: loading.effects['transfer/submitStepForm'],
  data: transfer.step,
}))
@Form.create()
class Step2 extends React.PureComponent {
  onValidateForm = async e => {
    e.preventDefault();
    const { data, dispatch } = this.props;
    const keystore = getKeyStore();
    const { receiverAccount, amount, remark } = data;
    const pureAmount = parseInt(amount, 10);
    const { phaseKey } = keystore;

    const transaction = await DdnJS.transaction.createTransaction(
      receiverAccount,
      pureAmount,
      remark,
      phaseKey
    );

    console.log('trs', transaction);

    dispatch({
      type: 'transfer/submitTransfer',
      payload: {
        ...data,
        transaction,
      },
      callback: response => {
        if (!response.success) {
          message.error(response.error);
        }
      },
    });
  };

  render() {
    const { data, submitting } = this.props;
    const onPrev = () => {
      history.push('/transfer/fill');
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message={formatMessage({ id: 'app.transfer.validate-info' })}
          style={{ marginBottom: 24 }}
        />
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label={formatMessage({ id: 'app.transfer.receive-address' })}
        >
          {data.receiverAccount}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label={formatMessage({ id: 'app.transfer.transfer-amount' })}
        >
          <span className={styles.money}>{data.amount}</span>
          <span> (DDN) </span>
          {/* <span className={styles.uppercase}>（{digitUppercase(data.amount)}）</span> */}
        </Form.Item>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.transfer.fees' })}>
          <span>0.1 DDN</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label={formatMessage({ id: 'app.transfer.message' })}
        >
          {data.remark}
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        {/* <Form.Item {...formItemLayout} label="交易密码" required={false}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '需要交易密码才能进行支付',
              },
            ],
          })(<Input type="password" autoComplete="off" style={{ width: '80%' }} />)}
        </Form.Item> */}
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button onClick={onPrev} style={{ marginRight: 8 }}>
            {formatMessage({ id: 'app.transfer.previous' })}
          </Button>
          <Button type="primary" onClick={this.onValidateForm} loading={submitting}>
            {formatMessage({ id: 'app.transfer.sure-to-transfer' })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step2;
