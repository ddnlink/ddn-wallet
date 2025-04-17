import React from 'react';
import { Card, Steps, Button } from 'antd';
import { history, useIntl } from '@umijs/max';
import { SwapOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Step } = Steps;

const TransferPage: React.FC = () => {
  const intl = useIntl();

  // 组件加载时直接跳转到 step1
  React.useEffect(() => {
    history.push('/transfer/step1');
  }, []);

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
          {intl.formatMessage({ id: 'pages.transfer.title' })}
        </div>
        <div className={styles.stepsContainer}>
          <Steps current={-1} progressDot>
            <Step title={intl.formatMessage({ id: 'pages.transfer.recipient' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.confirm' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.success' })} />
          </Steps>
        </div>
      </Card>
    </div>
  );
};

export default TransferPage;
