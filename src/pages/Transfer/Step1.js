import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import styles from './style.less';
// import logo from '../../assets/hbllogo_light.jpg';
import logo from '../../assets/logo.svg';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@connect(({ transfer, user }) => ({
  data: transfer.step,
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
  }

  validateBalance = (rule, value, callback) => {
    const { account } = this.props;
    // console.log('account', account);
    if (value && value > account.balance / 100000000) {
      callback(formatMessage({ id: 'app.transfer.insufficient-balance' }));
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'transfer/saveStepFormData',
            payload: values,
          });
          router.push('/transfer/confirm');
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'app.transfer.receive-address' })}
          >
            {getFieldDecorator('receiverAccount', {
              initialValue: data.receiverAccount,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'app.transfer.address-empty-error' }),
                },
                {
                  validator: this.validateAddress,
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'app.transfer.address-placeholder' })} />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'app.transfer.transfer-amount' })}
          >
            <Input.Group compact>
              {getFieldDecorator('amount', {
                initialValue: data.amount,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.transfer.amount-empty-error' }),
                  },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: formatMessage({ id: 'app.transfer.amount-format-error' }),
                  },
                  {
                    validator: this.validateBalance,
                  },
                ],
              })(
                <Input
                  style={{ width: 'calc(100% - 100px)' }}
                  placeholder={formatMessage({ id: 'app.transfer.amount-placeholder' })}
                />
              )}
              <Select defaultValue={DdnJS.constants.tokenName} style={{ width: 100 }}>
                <Option value={DdnJS.constants.tokenName}>
                  <img src={logo} alt={DdnJS.constants.tokenName} className={styles.logo} /> {DdnJS.constants.tokenName}
                </Option>
              </Select>
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.transfer.fees' })}>
            <span>0.1 {DdnJS.constants.tokenName}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.transfer.message' })}>
            {getFieldDecorator('remark', {
              initialValue: data.remark,
              rules: [
                { required: false, message: formatMessage({ id: 'app.transfer.input-message' }) },
              ],
            })(<Input placeholder={formatMessage({ id: 'app.transfer.input-message' })} />)}
          </Form.Item>
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
              {formatMessage({ id: 'app.transfer.next' })}
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>{formatMessage({ id: 'app.transfer.introction' })}</h3>
          <p>{formatMessage({ id: 'app.transfer.info' })}</p>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
