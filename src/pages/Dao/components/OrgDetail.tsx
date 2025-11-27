import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Button, Spin, message, Divider, Typography, Space } from 'antd';
import { useIntl, useRequest } from '@umijs/max';
import { getOrgById } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import { SwapOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Title, Paragraph } = Typography;

interface OrgDetailProps {
  orgId: string;
  onBack: () => void;
  onExchange: (orgId: string) => void;
  onContribute: (orgId: string) => void;
}

const OrgDetail: React.FC<OrgDetailProps> = ({ orgId, onBack, onExchange, onContribute }) => {
  const intl = useIntl();

  // 获取组织详情
  const { data, loading } = useRequest(
    async () => {
      try {
        const response = await getOrgById(orgId);
        
        if (response.success) {
          return response.result;
        }
        return null;
      } catch (error) {
        console.error('获取组织详情失败:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [orgId],
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
            <Title level={4}>{data.name}</Title>
            <Tag color={data.state === 0 ? 'green' : 'red'}>
              {data.state === 0 
                ? intl.formatMessage({ id: 'pages.dao.org.state.0' }) 
                : intl.formatMessage({ id: 'pages.dao.org.state.1' })}
            </Tag>
          </div>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<SwapOutlined />} 
              onClick={() => onExchange(orgId)}
              disabled={data.state !== 0}
            >
              {intl.formatMessage({ id: 'pages.dao.org.exchange' })}
            </Button>
            <Button 
              type="primary" 
              icon={<FileTextOutlined />} 
              onClick={() => onContribute(orgId)}
              disabled={data.state !== 0}
            >
              {intl.formatMessage({ id: 'pages.dao.org.contribute' })}
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.id' })}>
            {data.org_id}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.name' })}>
            {data.name}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.address' })}>
            {data.address}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.tags' })}>
            {data.tags.split(',').map((tag: string) => (
              <Tag color="blue" key={tag}>
                {tag.trim()}
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.url' })}>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              {data.url}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.state' })}>
            <Tag color={data.state === 0 ? 'green' : 'red'}>
              {data.state === 0 
                ? intl.formatMessage({ id: 'pages.dao.org.state.0' }) 
                : intl.formatMessage({ id: 'pages.dao.org.state.1' })}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.dao.org.timestamp' })}>
            {formatTime(data.timestamp)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div className={styles.detailActions}>
          <Button 
            type="primary" 
            icon={<SwapOutlined />} 
            onClick={() => onExchange(orgId)}
            disabled={data.state !== 0}
          >
            {intl.formatMessage({ id: 'pages.dao.org.exchange' })}
          </Button>
          <Button 
            type="primary" 
            icon={<FileTextOutlined />} 
            onClick={() => onContribute(orgId)}
            disabled={data.state !== 0}
          >
            {intl.formatMessage({ id: 'pages.dao.org.contribute' })}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrgDetail;
