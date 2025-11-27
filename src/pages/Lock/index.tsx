import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Spin, message } from 'antd';
import { useModel, useIntl, useRequest } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import DdnJS from '@ddn/js-sdk';
import LockForm from './components/LockForm';
import LockResult from './components/LockResult';
import { queryLatestBlock, postTransaction } from '@/services/api';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const LockPage: React.FC = () => {
  const [currentHeight, setCurrentHeight] = useState<number>(0);
  const [lockHeight, setLockHeight] = useState<number | null>(null);
  const [lockResponse, setLockResponse] = useState<API.Response<any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();

  // 获取最新区块高度
  const { data: blockData, loading: blockLoading, refresh: refreshBlock } = useRequest(
    queryLatestBlock,
    {
      onSuccess: (result) => {
        if (result && result.success) {
          setCurrentHeight(result.height);
        }
      },
    }
  );

  // 处理锁仓操作
  const handleLock = async (height: number) => {
    if (!initialState?.currentUser?.address) {
      message.error(intl.formatMessage({ id: 'pages.lock.no-account' }));
      return;
    }

    if (!height || height <= currentHeight) {
      message.error(intl.formatMessage({ id: 'pages.lock.invalid-height' }));
      return;
    }

    setLoading(true);
    try {
      // 获取密钥
      const keyStore = localStorage.getItem('ddn-keyStore');
      if (!keyStore) {
        message.error(intl.formatMessage({ id: 'pages.lock.no-keystore' }));
        setLoading(false);
        return;
      }

      const keyStoreObj = JSON.parse(keyStore);
      const transaction = DdnJS.transaction.createLock(height, keyStoreObj.phaseKey, undefined);
      
      // 提交交易
      const response = await postTransaction({ transaction });
      
      setLockResponse(response);
      setLockHeight(height);
      
      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.lock.success' }));
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.lock.failed' }));
      }
    } catch (error) {
      console.error('Lock error:', error);
      message.error(intl.formatMessage({ id: 'pages.lock.error' }));
    } finally {
      setLoading(false);
    }
  };

  // 重置锁仓状态
  const handleReset = () => {
    setLockResponse(null);
    setLockHeight(null);
    refreshBlock();
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.lock.title' }),
        subTitle: intl.formatMessage({ id: 'pages.lock.subtitle' }),
      }}
    >
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerBackground} />
            <div className={styles.headerContent}>
              <Title level={2}>{intl.formatMessage({ id: 'pages.lock.card-title' })}</Title>
              <Paragraph>
                {intl.formatMessage({ id: 'pages.lock.description' })}
              </Paragraph>
            </div>
          </div>
          
          <div className={styles.content}>
            <Spin spinning={loading || blockLoading}>
              {lockResponse && lockResponse.success ? (
                <LockResult 
                  height={lockHeight || 0} 
                  currentHeight={currentHeight}
                  onReset={handleReset}
                />
              ) : (
                <LockForm 
                  currentHeight={currentHeight} 
                  onSubmit={handleLock}
                  loading={loading}
                />
              )}
            </Spin>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default LockPage;
