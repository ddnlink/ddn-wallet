import React, { useState, useEffect } from 'react';
import { Card, Result, Button, Descriptions, Typography, Space, message, Steps } from 'antd';
import { history, useIntl } from '@umijs/max';
import { formatAmount, formatDateTime } from '@/utils/utils';
import { CopyOutlined, SwapOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Paragraph, Text } = Typography;
const { Step } = Steps;

const Step3: React.FC = () => {
  const [transferResult, setTransferResult] = useState<any>(null);
  const intl = useIntl();

  useEffect(() => {
    // 从 sessionStorage 获取转账结果
    const result = sessionStorage.getItem('transferResult');
    if (result) {
      setTransferResult(JSON.parse(result));
    } else {
      // 如果没有数据，返回第一步
      history.push('/transfer/step1');
    }
  }, []);

  const handleDone = () => {
    // 清除 sessionStorage 中的数据
    sessionStorage.removeItem('transferData');
    sessionStorage.removeItem('transferResult');

    // 返回首页
    history.push('/');
  };

  const handleAgain = () => {
    // 清除 sessionStorage 中的数据
    sessionStorage.removeItem('transferData');
    sessionStorage.removeItem('transferResult');

    // 返回第一步
    history.push('/transfer/step1');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success(intl.formatMessage({ id: 'pages.common.copy-success' }));
      },
      () => {
        message.error(intl.formatMessage({ id: 'pages.common.copy-failed' }));
      }
    );
  };

  if (!transferResult) {
    return null;
  }

  return (
    <div className={styles.transferPage}>
      {/* 添加装饰头部 */}
      <div className={styles.headerDecoration}>
        <div className={styles.decorationContent}>
          <div className={styles.decorationTitle}>
            {intl.formatMessage({ id: 'pages.transfer.success' })}
          </div>
          <CheckCircleOutlined className={styles.decorationIcon} />
        </div>
      </div>

      <Card variant='borderless'>
        <div className={styles.title}>
          {/* {intl.formatMessage({ id: 'pages.transfer.success' })} */}
        </div>
        <div className={styles.stepsContainer}>
          <Steps current={2} progressDot>
            <Step title={intl.formatMessage({ id: 'pages.transfer.recipient' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.confirm' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.success' })} />
          </Steps>
        </div>
        <Result
          status="success"
          title={intl.formatMessage({ id: 'pages.transfer.success' })}
          subTitle={
            <Paragraph>
              <Text>{intl.formatMessage({ id: 'pages.home.trans.id' })}: </Text>
              <Text copyable>{transferResult.transactionId}</Text>
            </Paragraph>
          }
          extra={[
            <Button type="primary" key="done" onClick={handleDone}>
              {intl.formatMessage({ id: 'pages.transfer.done' })}
            </Button>,
            <Button key="again" onClick={handleAgain}>
              {intl.formatMessage({ id: 'pages.transfer.again' })}
            </Button>,
          ]}
        >
          <div className={styles.resultContainer}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.id' })}>
                <Space>
                  {transferResult.transactionId}
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(transferResult.transactionId)}
                  />
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.recipient' })}>
                {transferResult.recipient}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.amount' })}>
                {transferResult.amount} {transferResult.token || 'DDN'}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.fee' })}>
                {transferResult.fee} {transferResult.token || 'DDN'}
              </Descriptions.Item>
              {transferResult.message && (
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.remark' })}>
                  {transferResult.message}
                </Descriptions.Item>
              )}
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.timestamp' })}>
                {formatDateTime(Date.now())}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Result>
      </Card>
    </div>
  );
};

export default Step3;
