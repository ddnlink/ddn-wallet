import React from 'react';
import { Card, Descriptions, Button, Spin, message, Divider, Typography, Space, Tag, Tooltip } from 'antd';
import { ArrowLeftOutlined, SafetyCertificateOutlined, LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { useIntl, history, useParams, useRequest } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { getEvidenceByTransactionId } from '@/services/evidence';
import { formatTime } from '@/utils/utils';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

const EvidenceDetail: React.FC = () => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>();

  // 获取存证详情
  const { data: evidence, loading } = useRequest(
    async () => {
      try {
        const response = await getEvidenceByTransactionId(id);
        if (response.success) {
          return response.result;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch evidence details:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [id],
    }
  );

  // 返回列表页
  const handleBack = () => {
    history.push('/evidence/list');
  };

  // 复制内容到剪贴板
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success(`${fieldName}已复制到剪贴板`);
      },
      (err) => {
        message.error(`复制失败: ${err}`);
      }
    );
  };

  // 验证存证
  const handleVerify = () => {
    history.push(`/evidence/verify?id=${id}`);
  };

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
        onBack: handleBack,
      }}
      className={styles.container}
    >
      <Spin spinning={loading}>
        {evidence ? (
          <Card className={styles.detailCard}>
            <div className={styles.header}>
              <div className={styles.headerBackground} />
              <div className={styles.headerContent}>
                <div className={styles.titleSection}>
                  <SafetyCertificateOutlined className={styles.titleIcon} />
                  <Title level={3}>{evidence.title}</Title>
                </div>
                <div className={styles.subtitleSection}>
                  <Tag color="blue">{evidence.type}</Tag>
                  <Text type="secondary">
                    {intl.formatMessage({ id: 'pages.evidence.timestamp' })}: {formatTime(evidence.timestamp)}
                  </Text>
                </div>
              </div>
            </div>

            <Divider />

            <Descriptions 
              title={intl.formatMessage({ id: 'pages.evidence.detail' })} 
              bordered 
              column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
              className={styles.descriptions}
            >
              <Descriptions.Item 
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.transaction_id' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.common.copy' })}>
                      <CopyOutlined 
                        onClick={() => handleCopy(evidence.transaction_id, intl.formatMessage({ id: 'pages.evidence.transaction_id' }))} 
                        className={styles.copyIcon} 
                      />
                    </Tooltip>
                  </Space>
                }
                span={3}
              >
                <Text copyable={{ text: evidence.transaction_id }} ellipsis>
                  {evidence.transaction_id}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.evidence_title' })}
              >
                {evidence.title}
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.author' })}
              >
                {evidence.author}
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.type' })}
              >
                <Tag color="blue">{evidence.type}</Tag>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.hash' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.common.copy' })}>
                      <CopyOutlined 
                        onClick={() => handleCopy(evidence.hash, intl.formatMessage({ id: 'pages.evidence.hash' }))} 
                        className={styles.copyIcon} 
                      />
                    </Tooltip>
                  </Space>
                }
                span={3}
              >
                <Text copyable={{ text: evidence.hash }} ellipsis>
                  {evidence.hash}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.shortHash' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.common.copy' })}>
                      <CopyOutlined 
                        onClick={() => handleCopy(evidence.shortHash, intl.formatMessage({ id: 'pages.evidence.shortHash' }))} 
                        className={styles.copyIcon} 
                      />
                    </Tooltip>
                  </Space>
                }
              >
                <Text copyable={{ text: evidence.shortHash }}>
                  {evidence.shortHash}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.size' })}
              >
                {evidence.size}
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.timestamp' })}
              >
                {formatTime(evidence.timestamp)}
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.sourceAddress' })}
                span={3}
              >
                {evidence.sourceAddress ? (
                  <Space>
                    <Text ellipsis style={{ maxWidth: '80%' }}>{evidence.sourceAddress}</Text>
                    {evidence.sourceAddress.startsWith('http') && (
                      <Button 
                        type="link" 
                        icon={<LinkOutlined />} 
                        href={evidence.sourceAddress} 
                        target="_blank"
                        size="small"
                      >
                        访问
                      </Button>
                    )}
                  </Space>
                ) : '无'}
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.tags' })}
                span={3}
              >
                {evidence.tags ? evidence.tags.split(',').map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                )) : '无'}
              </Descriptions.Item>

              <Descriptions.Item 
                label={intl.formatMessage({ id: 'pages.evidence.description' })}
                span={3}
              >
                {evidence.description || '无'}
              </Descriptions.Item>

              {evidence.metadata && (
                <Descriptions.Item 
                  label={intl.formatMessage({ id: 'pages.evidence.metadata' })}
                  span={3}
                >
                  <pre className={styles.metadataContent}>
                    {evidence.metadata}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className={styles.actions}>
              <Space>
                <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                  {intl.formatMessage({ id: 'pages.evidence.back' })}
                </Button>
                <Button type="primary" icon={<SafetyCertificateOutlined />} onClick={handleVerify}>
                  {intl.formatMessage({ id: 'pages.evidence.verify' })}
                </Button>
              </Space>
            </div>
          </Card>
        ) : !loading ? (
          <Card className={styles.emptyCard}>
            <div className={styles.emptyContent}>
              <Title level={4}>{intl.formatMessage({ id: 'pages.evidence.no.data' })}</Title>
              <Paragraph>
                {intl.formatMessage({ id: 'pages.evidence.verify.failure' })}
              </Paragraph>
              <Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleBack}>
                {intl.formatMessage({ id: 'pages.evidence.back' })}
              </Button>
            </div>
          </Card>
        ) : null}
      </Spin>
    </PageContainer>
  );
};

export default EvidenceDetail;
