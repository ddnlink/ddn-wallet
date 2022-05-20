import React from 'react';
import { connect } from 'dva';
import { Form, Button, Alert, Divider, message, Spin, Modal } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import styles from './style.less';
import peerConfig from '../../../config/peer.config';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ upgrade, loading }) => ({
  submitting: loading.effects['upgrade/submitStepForm'],
  data: upgrade.step,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    loading: false,
    time: 0,
  };

  onValidateForm = async e => {
    e.preventDefault();
    const { data, dispatch } = this.props;
    const { amount, secret } = data;
    const pureAmount = parseInt(amount * 100000000, 10);
    const transaction = await DdnJS.transaction.createTransaction(
      peerConfig.address,
      pureAmount,
      '升级账户token转移',
      secret
    );
    dispatch({
      type: 'upgrade/submitTransfer',
      payload: {
        ...data,
        transaction: JSON.stringify(transaction),
      },
      callback: response => {
        if (!response.success) {
          message.error(response.error);
        } else {
          this.setState({
            loading: true,
          });
          this.setTimeer();
        }
      },
    });
  };

  setTimeer = () => {
    this.interval = setInterval(() => {
      this.setState({
        time: this.state.time + 1,
      });
      if (this.state.time === 1 || this.state.time === 120) {
        this.queryTransaction();
      }
    }, 1000);
  };

  cancelTimeer = () => {
    this.interval && clearInterval(this.interval);
  };

  queryTransaction = () => {
    const { data, dispatch } = this.props;
    dispatch({
      type: 'upgrade/getTransaction',
      payload: data.senderAddress,
      callback: res => {
        if (res.success) {
          router.push('/upgrade/result');
          this.cancelTimeer();
        } else {
          this.errorModal(data);
          this.cancelTimeer();
        }
      },
    });
  };

  errorModal = data => {
    Modal.error({
      title: '升级错误',
      content: (
        <div>
          <p>请稍后重试或者发送邮件给工作人员说明情况</p>
          <p>邮箱地址：1056941326@qq.com</p>
          <p>发送邮件时请附带以下您的钱包地址</p>
          <p>
            发送地址：
            {data.senderAddress}
          </p>
          <p>
            接收地址：
            {data.receiverAddress}
          </p>
        </div>
      ),
    });
  };

  render() {
    const { data, submitting } = this.props;
    const { loading, time } = this.state;
    const onPrev = () => {
      router.push('/upgrade/fill');
    };
    return (
      <Spin
        tip={`${formatMessage({ id: 'app.transfer.transfer-loading-info' })}${time} s`}
        spinning={loading}
      >
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
            label={formatMessage({ id: 'app.transfer.sender-address' })}
          >
            {data.senderAddress}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            className={styles.stepFormText}
            label={formatMessage({ id: 'app.transfer.receiver-address' })}
          >
            {data.receiverAddress}
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
          {/* <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.transfer.fees' })}>
          <span>0.1 DDN</span>
        </Form.Item> */}
          <div className={styles.desc}>
            <h3>{formatMessage({ id: 'app.transfer.introction' })}</h3>
            <p>{formatMessage({ id: 'app.upgrade.tip' })}</p>
          </div>
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
      </Spin>
    );
  }
}

export default Step2;
