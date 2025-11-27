import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, InputNumber, Space, message, Select, Divider, Steps } from 'antd';
import { history, useIntl, useModel, useRequest } from '@umijs/max';
import { UserOutlined, DollarOutlined, MessageOutlined, SwapOutlined } from '@ant-design/icons';
import { queryAccount } from '@/services/api';
import styles from './index.less';
import logo from '@/assets/logo.svg';

const { Option } = Select;
const { Step } = Steps;

const Step1: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  // 添加获取账户信息的请求
  const { run: fetchAccountData } = useRequest(
    () => queryAccount({ address: initialState?.currentUser?.address || '' }),
    {
      manual: true,
      formatResult: (res) => {
        if (res.success && res.account && setInitialState) {
          // 更新 initialState 中的余额信息
          setInitialState({
            ...initialState,
            currentUser: {
              ...initialState?.currentUser,
              balance: res.account.balance,
              lock_height: res.account.lock_height
            }
          });
        }
        return res;
      }
    }
  );

  // 组件挂载时获取最新账户信息
  useEffect(() => {
    if (initialState?.currentUser?.address) {
      fetchAccountData();
    }
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 验证地址格式
      // if (!validateAddress(values.recipient)) {
      //   message.error(intl.formatMessage({ id: 'pages.transfer.invalid-address' }));
      //   setLoading(false);
      //   return;
      // }

      // 验证余额是否足够
      // 确保 balance 是数字类型
      const balance = Number(initialState?.currentUser?.balance || 0);
      const totalAmount = Number(values.amount) + Number(values.fee || 0.1);

      if (totalAmount > balance) {
        message.error(intl.formatMessage({ id: 'pages.transfer.insufficient-balance' }));
        setLoading(false);
        return;
      }

      // 保存表单数据到 sessionStorage，以便在下一步使用
      sessionStorage.setItem('transferData', JSON.stringify({
        recipient: values.recipient,
        amount: values.amount,
        fee: values.fee || 0.1,
        remark: values.remark || '',
        sender: initialState?.currentUser?.address,
        token: values.token || 'DDN',
      }));

      // 跳转到下一步
      history.push('/transfer/step2');

      setLoading(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.transfer.failure' }));
      setLoading(false);
    }
  };

  const handleBack = () => {
    history.push('/transfer');
  };

  return (
    <div className={styles.transferPage}>
      {/* 添加装饰头部 */}
      <div className={styles.headerDecoration}>
        <div className={styles.decorationContent}>
          <div className={styles.decorationTitle}>
            {intl.formatMessage({ id: 'pages.transfer.title' })}
          </div>
          <SwapOutlined className={styles.decorationIcon} />
        </div>
      </div>

      <Card variant="borderless">
        <div className={styles.title}>
          {/* {intl.formatMessage({ id: 'pages.transfer.title' })} */}
        </div>
        <div className={styles.stepsContainer}>
          <Steps current={0} progressDot>
            <Step title={intl.formatMessage({ id: 'pages.transfer.recipient' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.confirm' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.success' })} />
          </Steps>
        </div>
        <div className={styles.stepsContainer}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ fee: 0.1, token: 'DDN' }}
          >
            <Form.Item
              name="recipient"
              label={intl.formatMessage({ id: 'pages.transfer.recipient' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'pages.transfer.recipient-required' }),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={intl.formatMessage({ id: 'pages.transfer.recipient-placeholder' })}
              />
            </Form.Item>

            <Form.Item
              name="amount"
              label={intl.formatMessage({ id: 'pages.transfer.amount' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'pages.transfer.amount-required' }),
                },
                {
                  type: 'number',
                  min: 0.00000001,
                  message: intl.formatMessage({ id: 'pages.transfer.amount-min' }),
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                prefix={<DollarOutlined />}
                placeholder={intl.formatMessage({ id: 'pages.transfer.amount-placeholder' })}
                step={0.00000001}
                precision={8}
                addonAfter={
                  <Form.Item name="token" noStyle>
                    <Select style={{ width: 80 }}>
                      <Option value="DDN">
                        <Space>
                          <img src={logo} alt="DDN" className={styles.tokenLogo} />
                          DDN
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>

            <Form.Item
              name="fee"
              label={intl.formatMessage({ id: 'pages.transfer.fee' })}
            >
              <div>0.1 DDN</div>
            </Form.Item>

            <Form.Item
              name="remark"
              label={intl.formatMessage({ id: 'pages.transfer.remark' })}
            >
              <Input.TextArea
                prefix={<MessageOutlined />}
                placeholder={intl.formatMessage({ id: 'pages.transfer.remark-placeholder' })}
                rows={4}
                maxLength={100}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <div className={styles.buttonContainer}>
                <Space size="middle">
                  <Button onClick={handleBack}>
                    {intl.formatMessage({ id: 'pages.transfer.back' })}
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {intl.formatMessage({ id: 'pages.transfer.next' })}
                  </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </div>

        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>{intl.formatMessage({ id: 'pages.transfer.introduction' })}</h3>
          <p>{intl.formatMessage({ id: 'pages.transfer.info' })}</p>
        </div>
      </Card>
    </div>
  );
};

export default Step1;
