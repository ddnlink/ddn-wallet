import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Typography, Space, Result, Descriptions, Spin, Divider } from 'antd';
import { 
  ArrowLeftOutlined, 
  SafetyCertificateOutlined, 
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useIntl, history, useLocation } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { getEvidenceByTransactionId, getEvidenceByHash, getEvidenceByShortHash } from '@/services/evidence';
import { formatTime } from '@/utils/utils';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const EvidenceVerify: React.FC = () => {
  const intl = useIntl();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [evidence, setEvidence] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  // 从URL参数中获取ID
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    if (id) {
      setSearchValue(id);
      handleVerify(id);
    }
  }, [location]);

  // 验证存证
  const handleVerify = async (value: string) => {
    if (!value) {
      message.warning(intl.formatMessage({ id: 'pages.evidence.verify.input.placeholder' }));
      return;
    }

    try {
      setLoading(true);
      setVerified(null);
      setEvidence(null);

      let response;

      // 根据输入长度判断是交易ID、完整哈希还是短哈希
      if (value.length > 64) {
        // 可能是交易ID
        response = await getEvidenceByTransactionId(value);
      } else if (value.length > 32) {
        // 可能是完整哈希
        response = await getEvidenceByHash(value);
      } else {
        // 可能是短哈希
        response = await getEvidenceByShortHash(value);
      }

      if (response.success && response.result) {
        setVerified(true);
        setEvidence(response.result);
        message.success(intl.formatMessage({ id: 'pages.evidence.verify.success' }));
      } else {
        setVerified(false);
        message.error(intl.formatMessage({ id: 'pages.evidence.verify.failure' }));
      }
    } catch (error) {
      console.error('Failed to verify evidence:', error);
      setVerified(false);
      message.error(intl.formatMessage({ id: 'pages.evidence.verify.failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 返回列表页
  const handleBack = () => {
    history.push('/evidence/list');
  };

  // 查看存证详情
  const handleViewEvidence = () => {
    if (evidence && evidence.transaction_id) {
      history.push(`/evidence/detail/${evidence.transaction_id}`);
    }
  };

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
      }}
      className={styles.container}
    >
      <div className={styles.decorativeBg}>
        <div className={styles.decorativeContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{intl.formatMessage({ id: 'pages.evidence.verify.title' })}</h1>
            <p className={styles.pageSubtitle}>{intl.formatMessage({ id: 'pages.evidence.verify.subtitle' })}</p>
          </div>
        </div>
      </div>

      <Card className={styles.verifyCard}>
        <div className={styles.searchSection}>
          <Title level={4}>{intl.formatMessage({ id: 'pages.evidence.verify.input' })}</Title>
          <Paragraph>
            {intl.formatMessage({ id: 'pages.evidence.verify.subtitle' })}
          </Paragraph>
          <Search
            placeholder={intl.formatMessage({ id: 'pages.evidence.verify.input.placeholder' })}
            enterButton={intl.formatMessage({ id: 'pages.evidence.verify.submit' })}
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleVerify}
            loading={loading}
            className={styles.searchInput}
          />
        </div>

        <Divider />

        <Spin spinning={loading}>
          {verified === true && evidence && (
            <div className={styles.resultSection}>
              <Result
                status="success"
                title={intl.formatMessage({ id: 'pages.evidence.verify.success' })}
                icon={<CheckCircleOutlined className={styles.successIcon} />}
                extra={[
                  <Button key="back" onClick={handleBack}>
                    {intl.formatMessage({ id: 'pages.evidence.back' })}
                  </Button>,
                  <Button key="view" type="primary" onClick={handleViewEvidence}>
                    {intl.formatMessage({ id: 'pages.evidence.view' })}
                  </Button>,
                ]}
              />

              <Descriptions 
                title={intl.formatMessage({ id: 'pages.evidence.detail' })} 
                bordered 
                column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                className={styles.descriptions}
              >
                <Descriptions.Item 
                  label={intl.formatMessage({ id: 'pages.evidence.transaction_id' })}
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
                  label={intl.formatMessage({ id: 'pages.evidence.timestamp' })}
                >
                  {formatTime(evidence.timestamp)}
                </Descriptions.Item>

                <Descriptions.Item 
                  label={intl.formatMessage({ id: 'pages.evidence.hash' })}
                  span={3}
                >
                  <Text copyable={{ text: evidence.hash }} ellipsis>
                    {evidence.hash}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item 
                  label={intl.formatMessage({ id: 'pages.evidence.shortHash' })}
                >
                  <Text copyable={{ text: evidence.shortHash }}>
                    {evidence.shortHash}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item 
                  label={intl.formatMessage({ id: 'pages.evidence.type' })}
                >
                  {evidence.type}
                </Descriptions.Item>

                <Descriptions.Item 
                  label={intl.formatMessage({ id: 'pages.evidence.size' })}
                >
                  {evidence.size}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {verified === false && (
            <div className={styles.resultSection}>
              <Result
                status="error"
                title={intl.formatMessage({ id: 'pages.evidence.verify.failure' })}
                icon={<CloseCircleOutlined className={styles.errorIcon} />}
                subTitle={intl.formatMessage({ id: 'pages.evidence.no.data' })}
                extra={[
                  <Button key="back" onClick={handleBack}>
                    {intl.formatMessage({ id: 'pages.evidence.back' })}
                  </Button>,
                  <Button key="retry" type="primary" onClick={() => handleVerify(searchValue)}>
                    {intl.formatMessage({ id: 'pages.evidence.verify.submit' })}
                  </Button>,
                ]}
              />
            </div>
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default EvidenceVerify;
