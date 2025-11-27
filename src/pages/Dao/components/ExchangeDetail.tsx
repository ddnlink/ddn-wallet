import React from 'react';
import { Card, Descriptions, Tag, Button, Spin, message, Divider, Typography, Space } from 'antd';
import { useIntl, useRequest } from '@umijs/max';
import { getExchangeByTransactionId } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import { CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Title } = Typography;

interface ExchangeDetailProps {
  exchangeId: string;
  onBack: () => void;
  onConfirm: (exchangeId: string) => void;
}

const ExchangeDetail: React.FC<ExchangeDetailProps> = ({ exchangeId, onBack, onConfirm }) => {
  const intl = useIntl();

  // 获取交易详情
  const { data, loading } = useRequest(
    async () => {
      try {
        const response = await getExchangeByTransactionId(exchangeId);
        
        if (response.success) {
          return response.result;
        }
        return null;
      } catch (error) {
        console.error('获取交易详情失败:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [exchangeId],
    }
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={4}>{intl.formatMessage({ id: 'pages.common.not-found' })}</Title>
        <Button type="primary" onClick={onBack}>
          {intl.formatMessage({ id: 'pages.common.back' })}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={onBack}
        style={{ marginBottom: 16, padding: 0 }}
      >
        {intl.formatMessage({ id: 'pages.common.back' })}
      </Button>

      <Card 
        className={styles.detailCard}
        title={
          <div className={styles.detailCardTitle}>
            <Title level={4}>{intl.formatMessage({ id: 'pages.dao.exchange.detail' })}</Title>
            <Tag color={data.state === 0 ? 'orange' : 'green'}>
              {data.state === 0 
                ? intl.formatMessage({ id: 'pages.dao.exchange.state.0' }) 
                : intl.formatMessage({ id: 'pages.dao.exchange.state.1' })}
            </Tag>
          </div>
        }
        extra={
          data.state === 0 && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => onConfirm(exchangeId)}
            >
              {intl.formatMessage({ id: 'pages.dao.exchange.confirm' })}
            </Button>
          )
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.id' })}>
            {data.transaction_id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.org_id' })}>
            {data.org_id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.sender' })}>
            {data.sender_address}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.receiver' })}>
            {data.received_address}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.price' })}>
            {(parseInt(data.price) / 100000000).toFixed(8)} DDN
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.state' })}>
            <Tag color={data.state === 0 ? 'orange' : 'green'}>
              {data.state === 0 
                ? intl.formatMessage({ id: 'pages.dao.exchange.state.0' }) 
                : intl.formatMessage({ id: 'pages.dao.exchange.state.1' })}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.exchange.timestamp' })}>
            {formatTime(data.timestamp)}
          </Descriptions.Item>
        </Descriptions>

        {data.state === 0 && (
          <>
            <Divider />
            <div className={styles.detailActions}>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                onClick={() => onConfirm(exchangeId)}
              >
                {intl.formatMessage({ id: 'pages.dao.exchange.confirm' })}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ExchangeDetail;
