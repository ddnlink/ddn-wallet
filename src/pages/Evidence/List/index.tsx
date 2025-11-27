import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Typography, Tabs, message, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  SafetyCertificateOutlined, 
  CheckCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useIntl, history, useRequest } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { getAllEvidences, getEvidencesByType } from '@/services/evidence';
import { formatTime } from '@/utils/utils';
import EvidenceGuide from '../components/EvidenceGuide';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const EvidenceList: React.FC = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // 获取所有存证列表
  const { data: evidenceData, loading, run: fetchEvidences } = useRequest(
    async (params: { pagesize?: number; pageindex?: number; type?: string }) => {
      try {
        const { pagesize, pageindex, type } = params;
        let response;
        
        if (type && type !== 'all') {
          response = await getEvidencesByType(type, { pagesize, pageindex });
        } else {
          response = await getAllEvidences({ pagesize, pageindex });
        }

        if (response.success) {
          return {
            list: response.result.rows || [],
            total: response.result.total || 0,
          };
        }
        return { list: [], total: 0 };
      } catch (error) {
        console.error('Failed to fetch evidences:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { list: [], total: 0 };
      }
    },
    {
      defaultParams: [{ pagesize: pageSize, pageindex: currentPage, type: activeTab }],
    }
  );

  // 当页码、每页条数或标签页变化时重新获取数据
  useEffect(() => {
    fetchEvidences({ pagesize: pageSize, pageindex: currentPage, type: activeTab });
  }, [pageSize, currentPage, activeTab]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value);
    // 这里应该根据搜索值过滤数据，但API可能不支持，所以可能需要前端过滤
    // 或者跳转到详情页
    if (value) {
      // 如果输入的是交易ID或哈希，直接跳转到详情页
      if (value.length > 30) {
        history.push(`/evidence/detail/${value}`);
      } else {
        message.info(intl.formatMessage({ id: 'pages.evidence.search.placeholder' }));
      }
    }
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1); // 切换标签页时重置为第一页
  };

  // 跳转到创建存证页面
  const handleCreateEvidence = () => {
    history.push('/evidence/create');
  };

  // 跳转到存证详情页面
  const handleViewEvidence = (record: any) => {
    history.push(`/evidence/detail/${record.transaction_id}`);
  };

  // 跳转到验证存证页面
  const handleVerifyEvidence = () => {
    history.push('/evidence/verify');
  };

  // 表格列定义
  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.evidence.transaction_id' }),
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text copyable={{ text }} style={{ width: 100 }} ellipsis>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.evidence.evidence_title' }),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: intl.formatMessage({ id: 'pages.evidence.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color="blue">
          {text}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.evidence.author' }),
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: intl.formatMessage({ id: 'pages.evidence.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: number) => formatTime(text),
    },
    {
      title: intl.formatMessage({ id: 'pages.evidence.operation' }),
      key: 'operation',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleViewEvidence(record)}
            icon={<SearchOutlined />}
          >
            {intl.formatMessage({ id: 'pages.evidence.view' })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
      }}
      className={styles.evidencePage}
    >
      <div className={styles.decorativeBg}>
        <div className={styles.decorativeContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{intl.formatMessage({ id: 'pages.evidence.title' })}</h1>
            <p className={styles.pageSubtitle}>{intl.formatMessage({ id: 'pages.evidence.subtitle' })}</p>
          </div>
        </div>
      </div>

      {showGuide && <EvidenceGuide onClose={() => setShowGuide(false)} />}

      <Card className={styles.actionCard}>
        <div className={styles.actionBar}>
          <Space size="large">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateEvidence}
            >
              {intl.formatMessage({ id: 'pages.evidence.create' })}
            </Button>
            <Button 
              icon={<CheckCircleOutlined />} 
              onClick={handleVerifyEvidence}
            >
              {intl.formatMessage({ id: 'pages.evidence.verify' })}
            </Button>
          </Space>
          <Search
            placeholder={intl.formatMessage({ id: 'pages.evidence.search.placeholder' })}
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
      </Card>

      <Card className={styles.evidenceCard}>
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          tabPosition="top"
          size="large"
        >
          <TabPane
            tab={
              <span>
                <SafetyCertificateOutlined />
                {intl.formatMessage({ id: 'pages.evidence.filter.all' })}
              </span>
            }
            key="all"
          />
          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                {intl.formatMessage({ id: 'pages.evidence.filter.type' })}
              </span>
            }
            key="text"
          />
          <TabPane
            tab={
              <span>
                <UserOutlined />
                {intl.formatMessage({ id: 'pages.evidence.filter.author' })}
              </span>
            }
            key="image"
          />
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                {intl.formatMessage({ id: 'pages.evidence.filter.time' })}
              </span>
            }
            key="video"
          />
        </Tabs>

        <Table
          columns={columns}
          dataSource={evidenceData?.list || []}
          rowKey="transaction_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: evidenceData?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => intl.formatMessage({ id: 'pages.evidence.total' }, { total }),
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default EvidenceList;
