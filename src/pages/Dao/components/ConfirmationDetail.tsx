import React from 'react';
import { Card, Descriptions, Tag, Button, Spin, message, Typography } from 'antd';
import { useIntl, useRequest } from '@umijs/max';
import { getConfirmationByTransactionId } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Title } = Typography;

interface ConfirmationDetailProps {
  confirmationId: string;
  onBack: () => void;
}

const ConfirmationDetail: React.FC<ConfirmationDetailProps> = ({ confirmationId, onBack }) => {
  const intl = useIntl();

  // 获取确认详情
  const { data, loading } = useRequest(
    async () => {
      try {
        const response = await getConfirmationByTransactionId(confirmationId);
        
        if (response.success) {
          return response.result;
        }
        return null;
      } catch (error) {
        console.error('获取确认详情失败:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [confirmationId],
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
            <Title level={4}>{intl.formatMessage({ id: 'pages.dao.confirmation.detail' })}</Title>
            <Tag color={data.state === 0 ? 'green' : 'red'}>
              {data.state === 0 
                ? intl.formatMessage({ id: 'pages.dao.confirmation.state.0' }) 
                : intl.formatMessage({ id: 'pages.dao.confirmation.state.1' })}
            </Tag>
          </div>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.confirmation.id' })}>
            {data.transaction_id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.confirmation.contribution_id' })}>
            {data.contribution_id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.confirmation.sender' })}>
            {data.sender_address}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.confirmation.url' })}>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              {data.url}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.confirmation.state' })}>
            <Tag color={data.state === 0 ? 'green' : 'red'}>
              {data.state === 0 
                ? intl.formatMessage({ id: 'pages.dao.confirmation.state.0' }) 
                : intl.formatMessage({ id: 'pages.dao.confirmation.state.1' })}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.confirmation.timestamp' })}>
            {formatTime(data.timestamp)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ConfirmationDetail;
