import React from 'react';
import { Card, Descriptions, Button, Spin, message, Divider, Typography, Space } from 'antd';
import { useIntl, useRequest } from '@umijs/max';
import { getContributionByTransactionId } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import { CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Title } = Typography;

interface ContributionDetailProps {
  contributionId: string;
  onBack: () => void;
  onConfirm: (contributionId: string) => void;
}

const ContributionDetail: React.FC<ContributionDetailProps> = ({ contributionId, onBack, onConfirm }) => {
  const intl = useIntl();

  // 获取贡献详情
  const { data, loading } = useRequest(
    async () => {
      try {
        const response = await getContributionByTransactionId(contributionId);
        
        if (response.success) {
          return response.result;
        }
        return null;
      } catch (error) {
        console.error('获取贡献详情失败:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [contributionId],
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
            <Title level={4}>{data.title}</Title>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => onConfirm(contributionId)}
          >
            {intl.formatMessage({ id: 'pages.dao.contribution.confirm' })}
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.id' })}>
            {data.transaction_id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.title.field' })}>
            {data.title}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.sender' })}>
            {data.sender_address}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.receiver' })}>
            {data.received_address || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.url' })}>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              {data.url}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.price' })}>
            {data.price === '0' ? '-' : (parseInt(data.price) / 100000000).toFixed(8) + ' DDN'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.contribution.timestamp' })}>
            {formatTime(data.timestamp)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div className={styles.detailActions}>
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => onConfirm(contributionId)}
          >
            {intl.formatMessage({ id: 'pages.dao.contribution.confirm' })}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ContributionDetail;
