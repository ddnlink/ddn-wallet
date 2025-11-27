import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Alert, Space, Tooltip, Divider, Row, Col } from 'antd';
import { ArrowLeftOutlined, CodeOutlined, RocketOutlined, QuestionCircleOutlined, InfoCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useIntl, history, useModel } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { deployContract } from '@/services/contract';
import { getKeyStore } from '@/utils/authority';
import DdnJS from '@ddn/js-sdk';
import ContractTemplates from '../components/ContractTemplates';
import ContractSpecDrawer from '../components/ContractSpecDrawer';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContractDeploy: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [specDrawerVisible, setSpecDrawerVisible] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 返回合约列表
  const handleBack = () => {
    history.push('/contract/list');
  };

  // 部署合约
  const handleDeploy = async (values: any) => {
    if (!currentUser) {
      message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
      return;
    }

    try {
      setLoading(true);

      // 获取密钥库 phaseKey
      const keyStore = getKeyStore();
      if (!keyStore || !keyStore.phaseKey) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        return;
      }

      // 构建合约部署交易
      const transaction = {
        name: values.name,
        desc: values.description,
        code: values.code,
        version: values.version || '1.0.0'
      };

      // 签名交易
      const trs = await DdnJS.contract.createContract(transaction, keyStore.phaseKey);

      console.log('Contract deployment transaction:', trs);

      // 提交交易
      const response = await deployContract(trs);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.contract.deploy.success' }));
        // 部署成功后跳转到合约列表
        setTimeout(() => {
          history.push('/contract/list');
        }, 1500);
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.contract.deploy.failure' }));
      }
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      message.error(intl.formatMessage({ id: 'pages.contract.deploy.failure' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.contract.deploy.title' }),
        subTitle: intl.formatMessage({ id: 'pages.contract.deploy.subtitle' }),
        onBack: handleBack,
      }}
    >
      <div className={styles.container}>
        <Card className={styles.deployCard}>
          <Alert
            message={
              <>
                {intl.formatMessage({ id: 'pages.contract.guide.note' })}
                <a onClick={() => setSpecDrawerVisible(true)} style={{ marginLeft: 8, cursor: 'pointer' }}>
                  <BookOutlined style={{ marginRight: 4 }} />
                  查看智能合约规范文档
                </a>
              </>
            }
            type="info"
            showIcon
            className={styles.deployAlert}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleDeploy}
            className={styles.deployForm}
            style={{ width: '100%' }}
          >
            <Form.Item
              label={
                <span>
                  {intl.formatMessage({ id: 'pages.contract.deploy.name' })}
                  <Tooltip title="合约名称用于在区块链上标识您的合约，建议使用有意义的名称，如 'TokenContract'">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.deploy.name' }) }),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({ id: 'pages.contract.deploy.name.placeholder' })}
                maxLength={50}
                suffix={
                  <Tooltip title="示例: TokenContract, VotingSystem, AssetTracker">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  {intl.formatMessage({ id: 'pages.contract.deploy.description' })}
                  <Tooltip title="合约描述用于说明合约的用途和功能，帮助其他用户理解您的合约">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="description"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.deploy.description' }) }),
                },
              ]}
            >
              <TextArea
                placeholder={intl.formatMessage({ id: 'pages.contract.deploy.description.placeholder' })}
                rows={3}
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  {intl.formatMessage({ id: 'pages.contract.deploy.version' }) || '版本'}
                  <Tooltip title="合约版本号，使用语义化版本格式 (主版本.次版本.修订版本)">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="version"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.deploy.version' }) || '版本' }),
                },
                {
                  pattern: /^\d+\.\d+\.\d+$/,
                  message: intl.formatMessage({ id: 'pages.contract.deploy.version.format' }) || '请输入有效的版本号（例如：1.0.0）',
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({ id: 'pages.contract.deploy.version.placeholder' }) || '请输入版本号，例如：1.0.0'}
                maxLength={20}
                defaultValue="1.0.0"
                suffix={
                  <Tooltip title="示例: 1.0.0, 2.1.3, 0.5.2">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={15}>
                <Form.Item
                  label={
                    <span>
                      {intl.formatMessage({ id: 'pages.contract.deploy.code' })}
                      <Tooltip title="合约代码必须使用TypeScript编写，并遵循DDN智能合约规范">
                        <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                      </Tooltip>
                    </span>
                  }
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.contract.deploy.code' }) }),
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder={intl.formatMessage({ id: 'pages.contract.deploy.code.placeholder' })}
                    rows={25}
                    className={styles.codeTextarea}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={9}>
                <ContractTemplates form={form} />
              </Col>
            </Row>

            <Divider>
              <InfoCircleOutlined /> 部署说明
            </Divider>

            <Alert
              message="部署合约需要消耗DDN代币作为手续费"
              description={
                <ul className={styles.deployNotes}>
                  <li>合约一旦部署到区块链上，代码将无法修改</li>
                  <li>部署前请确保您的代码已经过充分测试</li>
                  <li>合约部署成功后，您可以通过合约ID调用合约方法</li>
                  <li>合约执行也需要消耗一定的Gas费用</li>
                </ul>
              }
              type="warning"
              showIcon
              className={styles.deployWarning}
            />

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading} icon={<RocketOutlined />}>
                  {intl.formatMessage({ id: 'pages.contract.deploy.submit' })}
                </Button>
                <Button onClick={handleBack}>
                  {intl.formatMessage({ id: 'pages.common.cancel' })}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* 智能合约规范文档抽屉 */}
      <ContractSpecDrawer
        visible={specDrawerVisible}
        onClose={() => setSpecDrawerVisible(false)}
      />
    </PageContainer>
  );
};

export default ContractDeploy;
