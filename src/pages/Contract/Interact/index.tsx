import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography, Alert, Space, Select, Divider, Spin, Result, Tabs, Checkbox, InputNumber } from 'antd';
import { ArrowLeftOutlined, ApiOutlined, SendOutlined, ReloadOutlined, DollarOutlined, CodeOutlined } from '@ant-design/icons';
import { useIntl, history, useParams, useRequest, useModel } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { getContract, getContractMeta, callContractMethod, sendContractMethod, transferToContract } from '@/services/contract';
import { getKeyStore } from '@/utils/authority';
// 使用 Prism 替代 SyntaxHighlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const ContractInteract: React.FC = () => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [callResult, setCallResult] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('transfer');
  const [gasLimit, setGasLimit] = useState<number>(5000);
  const [enablePayGasInDDN, setEnablePayGasInDDN] = useState<boolean>(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 获取合约基本信息
  const { data: contractInfo, loading: infoLoading } = useRequest(
    async () => {
      try {
        const response = await getContract({ id });
        if (response.success) {
          return response.contract;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch contract info:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [id],
    }
  );

  // 获取合约元数据
  const { data: contractMeta, loading: metaLoading } = useRequest(
    async () => {
      try {
        const response = await getContractMeta({ id });
        if (response.success) {
          return response.meta;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch contract meta:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [id],
    }
  );

  // 返回合约详情
  const handleBack = () => {
    history.push(`/contract/detail/${id}`);
  };

  // 处理方法选择变化
  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    setCallResult(null);

    // 重置表单参数字段
    const method = contractMeta?.methods?.find(m => m.name === value);
    if (method && method.params) {
      const initialValues: any = {};
      method.params.forEach(param => {
        initialValues[`param_${param.name}`] = undefined;
      });
      form.setFieldsValue(initialValues);
    }
  };

  // 查询合约方法（不修改状态）
  const handleCallMethod = async (values: any) => {
    if (!currentUser) {
      message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
      return;
    }

    if (!selectedMethod) {
      message.error(intl.formatMessage({ id: 'pages.contract.interact.method.required' }));
      return;
    }

    try {
      setLoading(true);
      setCallResult(null);

      // 获取选中的方法
      const method = contractMeta?.methods?.find(m => m.name === selectedMethod);
      if (!method) {
        message.error(intl.formatMessage({ id: 'pages.contract.interact.method.not.found' }));
        return;
      }

      // 构建参数数组
      const args: string[] = [];
      if (method.params) {
        method.params.forEach(param => {
          const paramValue = values[`param_${param.name}`];
          args.push(paramValue);
        });
      }

      // 调用合约查询方法
      const response = await callContractMethod({
        id,
        method: selectedMethod,
        args,
      });

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.contract.interact.success' }));
        setCallResult(response.result);
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.contract.interact.failure' }));
      }
    } catch (error) {
      console.error('Failed to call contract method:', error);
      message.error(intl.formatMessage({ id: 'pages.contract.interact.failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 调用合约方法（修改状态） 13 - 缺少？
  const handleSendMethod = async (values: any) => {
    if (!currentUser) {
      message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
      return;
    }

    if (!selectedMethod) {
      message.error(intl.formatMessage({ id: 'pages.contract.interact.method.required' }));
      return;
    }

    try {
      setLoading(true);
      setCallResult(null);

      // 获取选中的方法
      const method = contractMeta?.methods?.find(m => m.name === selectedMethod);
      if (!method) {
        message.error(intl.formatMessage({ id: 'pages.contract.interact.method.not.found' }));
        return;
      }

      // 获取密钥
      const keyStore = getKeyStore();
      if (!keyStore) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        return;
      }

      // 构建参数数组
      const methodArgs: any[] = [];
      if (method.params) {
        method.params.forEach(param => {
          const paramValue = values[`param_${param.name}`];
          methodArgs.push(paramValue);
        });
      }

      // 构建交易
      // 调用合约方法
      // type: 13
      // args: [gasLimit, enablePayGasInDDN, contractName, method, methodArgs]
      const type = 13;
      const args = [
        gasLimit,
        enablePayGasInDDN,
        id, // 合约ID或名称
        selectedMethod,
        methodArgs
      ];

      // 创建交易
      const trs = {
        type,
        fee: 0, // 手续费由系统计算
        args,
        secret: keyStore.phaseKey
      };

      // 提交交易
      const response = await sendContractMethod(trs);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.contract.interact.success' }));
        setCallResult({ transactionId: response.data?.transactionId || '交易已提交' });
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.contract.interact.failure' }));
      }
    } catch (error) {
      console.error('Failed to send contract method:', error);
      message.error(intl.formatMessage({ id: 'pages.contract.interact.failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 转账到合约 12
  const handleTransferToContract = async (values: any) => {
    if (!currentUser) {
      message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
      return;
    }

    try {
      setLoading(true);
      setCallResult(null);

      // 获取密钥
      const keyStore = getKeyStore();
      if (!keyStore) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        return;
      }

      // 构建交易
      // 根据接口文档 4.2.1 转账到合约
      // type: 12
      // args: [gasLimit, enablePayGasInDDN, receiverPath, amount, currency]
      const type = 12;
      const args = [
        values.gasLimit || 5000,
        values.enablePayGasInDDN !== false,
        values.receiverPath,
        values.amount,
        values.currency || 'DDN'
      ];

      // 创建交易
      const trs = {
        type,
        fee: 0, // 手续费由系统计算
        args,
        secret: keyStore.phaseKey
      };

      // 提交交易
      const response = await transferToContract(trs);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.contract.interact.transfer.success' }));
        setCallResult({ transactionId: response.data?.transactionId || '交易已提交' });
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.contract.interact.transfer.failure' }));
      }
    } catch (error) {
      console.error('Failed to transfer to contract:', error);
      message.error(intl.formatMessage({ id: 'pages.contract.interact.transfer.failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 重置结果
  const handleResetResult = () => {
    setCallResult(null);
  };

  // 渲染方法参数表单项
  const renderMethodParams = () => {
    if (!selectedMethod || !contractMeta?.methods) return null;

    const method = contractMeta.methods.find((m: API.ContractMethod) => m.name === selectedMethod);
    if (!method || !method.params || method.params.length === 0) {
      return (
        <Alert
          message={intl.formatMessage({ id: 'pages.contract.interact.no.params' })}
          type="info"
          showIcon
        />
      );
    }

    return method.params.map((param: API.ContractMethodParam) => (
      <Form.Item
        key={param.name}
        label={`${param.name} (${param.type})`}
        name={`param_${param.name}`}
        tooltip={param.description}
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'pages.common.required' },
              { field: param.name }
            ),
          },
        ]}
      >
        <Input placeholder={`${param.type}`} />
      </Form.Item>
    ));
  };

  // 渲染调用结果
  const renderCallResult = () => {
    if (callResult === null) return null;

    return (
      <div className={styles.resultContainer}>
        <Divider>{intl.formatMessage({ id: 'pages.contract.interact.result' })}</Divider>
        <div className={styles.resultContent}>
          <SyntaxHighlighter language="json" style={docco}>
            {JSON.stringify(callResult, null, 2)}
          </SyntaxHighlighter>
        </div>
        <div className={styles.resultActions}>
          <Button icon={<ReloadOutlined />} onClick={handleResetResult}>
            {intl.formatMessage({ id: 'pages.common.reset' })}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.contract.interact.title' }),
        subTitle: contractInfo?.name,
        onBack: handleBack,
      }}
      loading={infoLoading || metaLoading}
    >
      <div className={styles.container}>
        <Card className={styles.interactCard}>
          <>
              <Alert
                message={intl.formatMessage({ id: 'pages.contract.interact.subtitle' })}
                type="info"
                showIcon
                className={styles.interactAlert}
              />

              <div className={styles.tabsContainer}>
                <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
                  <TabPane
                    tab={
                      <span>
                        <CodeOutlined />
                        {intl.formatMessage({ id: 'pages.contract.interact.tabs.call' })}
                      </span>
                    }
                    key="call"
                  />
                  <TabPane
                    tab={
                      <span>
                        <SendOutlined />
                        {intl.formatMessage({ id: 'pages.contract.interact.tabs.send' })}
                      </span>
                    }
                    key="send"
                  />
                  <TabPane
                    tab={
                      <span>
                        <DollarOutlined />
                        {intl.formatMessage({ id: 'pages.contract.interact.tabs.transfer' })}
                      </span>
                    }
                    key="transfer"
                  />
                </Tabs>
              </div>

              {activeTab === 'transfer' ? (
                <Form
                  form={transferForm}
                  layout="vertical"
                  onFinish={handleTransferToContract}
                  className={styles.transferForm}
                  initialValues={{
                    gasLimit: 5000,
                    enablePayGasInDDN: true,
                    currency: 'DDN',
                  }}
                >
                  <div className={styles.gasOptions}>
                    <Form.Item
                      label={intl.formatMessage({ id: 'pages.contract.interact.gas_limit' })}
                      name="gasLimit"
                      tooltip={intl.formatMessage({ id: 'pages.contract.interact.gas_limit.tooltip' })}
                      className={styles.gasLimitInput}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.interact.gas_limit' }) }),
                        },
                        {
                          type: 'number',
                          min: 100,
                          max: 10000000,
                          message: intl.formatMessage({ id: 'pages.contract.interact.gas_limit.tooltip' }),
                        },
                      ]}
                    >
                      <InputNumber
                        min={100}
                        max={10000000}
                        style={{ width: '100%' }}
                        placeholder={intl.formatMessage({ id: 'pages.contract.interact.gas_limit.placeholder' })}
                      />
                    </Form.Item>

                    <Form.Item
                      name="enablePayGasInDDN"
                      valuePropName="checked"
                      tooltip={intl.formatMessage({ id: 'pages.contract.interact.enable_pay_gas.tooltip' })}
                      className={styles.enableGasCheckbox}
                    >
                      <Checkbox>
                        {intl.formatMessage({ id: 'pages.contract.interact.enable_pay_gas' })}
                      </Checkbox>
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={intl.formatMessage({ id: 'pages.contract.interact.transfer.receiver_path' })}
                    name="receiverPath"
                    tooltip={intl.formatMessage({ id: 'pages.contract.interact.transfer.receiver_path.tooltip' })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.interact.transfer.receiver_path' }) }),
                      },
                    ]}
                    extra={contractInfo?.name ? `示例: ${contractInfo.name}` : '示例: CCTimeContract'}
                  >
                    <Input placeholder={intl.formatMessage({ id: 'pages.contract.interact.transfer.receiver_path.placeholder' })} />
                  </Form.Item>

                  <Form.Item
                    label={intl.formatMessage({ id: 'pages.contract.interact.transfer.amount' })}
                    name="amount"
                    tooltip={intl.formatMessage({ id: 'pages.contract.interact.transfer.amount.tooltip' })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.interact.transfer.amount' }) }),
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder={intl.formatMessage({ id: 'pages.contract.interact.transfer.amount.placeholder' })}
                    />
                  </Form.Item>

                  <Form.Item
                    label={intl.formatMessage({ id: 'pages.contract.interact.transfer.currency' })}
                    name="currency"
                    tooltip={intl.formatMessage({ id: 'pages.contract.interact.transfer.currency.tooltip' })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.interact.transfer.currency' }) }),
                      },
                    ]}
                  >
                    <Input placeholder={intl.formatMessage({ id: 'pages.contract.interact.transfer.currency.placeholder' })} />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<DollarOutlined />}
                      >
                        {intl.formatMessage({ id: 'pages.contract.interact.submit' })}
                      </Button>
                      <Button onClick={handleBack}>
                        {intl.formatMessage({ id: 'pages.common.cancel' })}
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (!contractMeta?.methods || contractMeta.methods.length === 0) ? (
                <Result
                  status="warning"
                  title={intl.formatMessage({ id: 'pages.contract.interact.no.methods' })}
                  subTitle={intl.formatMessage({ id: 'pages.contract.interact.no.methods.desc' })}
                  extra={
                    <Space>
                      <Button type="primary" onClick={() => setActiveTab('transfer')}>
                        {intl.formatMessage({ id: 'pages.contract.interact.tabs.transfer' })}
                      </Button>
                      <Button onClick={handleBack}>
                        {intl.formatMessage({ id: 'pages.contract.back' })}
                      </Button>
                    </Space>
                  }
                />
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={activeTab === 'call' ? handleCallMethod : handleSendMethod}
                  className={styles.interactForm}
                >
                  <Form.Item
                    label={intl.formatMessage({ id: 'pages.contract.interact.method' })}
                    name="method"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'pages.contract.interact.method.required' }),
                      },
                    ]}
                  >
                    <Select
                      placeholder={intl.formatMessage({ id: 'pages.contract.interact.method.placeholder' })}
                      onChange={handleMethodChange}
                      value={selectedMethod}
                    >
                      {contractMeta?.methods?.map((method: API.ContractMethod) => (
                        <Option key={method.name} value={method.name}>
                          {method.name}
                          {method.description && ` - ${method.description}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {activeTab === 'send' && (
                    <div className={styles.gasOptions}>
                      <Form.Item
                        label={intl.formatMessage({ id: 'pages.contract.interact.gas_limit' })}
                        tooltip={intl.formatMessage({ id: 'pages.contract.interact.gas_limit.tooltip' })}
                        className={styles.gasLimitInput}
                      >
                        <InputNumber
                          min={100}
                          max={10000000}
                          value={gasLimit}
                          onChange={(value) => setGasLimit(value as number)}
                          style={{ width: '100%' }}
                          placeholder={intl.formatMessage({ id: 'pages.contract.interact.gas_limit.placeholder' })}
                        />
                      </Form.Item>

                      <Form.Item
                        tooltip={intl.formatMessage({ id: 'pages.contract.interact.enable_pay_gas.tooltip' })}
                        className={styles.enableGasCheckbox}
                      >
                        <Checkbox
                          checked={enablePayGasInDDN}
                          onChange={(e) => setEnablePayGasInDDN(e.target.checked)}
                        >
                          {intl.formatMessage({ id: 'pages.contract.interact.enable_pay_gas' })}
                        </Checkbox>
                      </Form.Item>
                    </div>
                  )}

                  {selectedMethod && (
                    <>
                      <Divider>{intl.formatMessage({ id: 'pages.contract.interact.params' })}</Divider>
                      {renderMethodParams()}
                    </>
                  )}

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SendOutlined />}
                        disabled={!selectedMethod}
                      >
                        {intl.formatMessage({ id: 'pages.contract.interact.submit' })}
                      </Button>
                      <Button onClick={handleBack}>
                        {intl.formatMessage({ id: 'pages.common.cancel' })}
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              )}

              {renderCallResult()}
            </>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ContractInteract;
