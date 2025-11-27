import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Tag, Tooltip, message, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, ApiOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useIntl, history, useRequest } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { queryContracts } from '@/services/contract';
import { formatAddress, formatTime } from '@/utils/utils';
import ContractGuide from '../components/ContractGuide';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const ContractList: React.FC = () => {
  const intl = useIntl();
  const [searchText, setSearchText] = useState<string>('');
  const [guideVisible, setGuideVisible] = useState<boolean>(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 获取合约列表
  const { data, loading, run } = useRequest(
    async (params: { current: number; pageSize: number }) => {
      try {
        const response = await queryContracts({
          limit: params.pageSize,
          offset: (params.current - 1) * params.pageSize,
        });
        
        console.log('response: ', response);
        
        if (response.success) {
          return {
            list: response.rows || [],
            total: response.totalCount || 0,
          };
        }
        return { list: [], total: 0 };
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { list: [], total: 0 };
      }
    },
    {
      defaultParams: [{ current: 1, pageSize: 10 }],
      refreshDeps: [],
    }
  );

  // 处理表格分页变化
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    run({ current: pagination.current, pageSize: pagination.pageSize });
  };

  // 处理搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    run({ current: 1, pageSize: pagination.pageSize });
  };

  // 查看合约详情
  const handleViewContract = (id: string) => {
    history.push(`/contract/detail/${id}`);
  };

  // 调用合约
  const handleCallContract = (id: string) => {
    history.push(`/contract/interact/${id}`);
  };

  // 部署新合约
  const handleDeployContract = () => {
    history.push('/contract/deploy');
  };

  // 表格列定义
  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.contract.id' }),
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{formatAddress(text, 8, 8)}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.contract.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'pages.contract.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'pages.contract.creator' }),
      dataIndex: 'creatorId',
      key: 'creatorId',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{formatAddress(text, 8, 8)}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.contract.version' }),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: intl.formatMessage({ id: 'pages.contract.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: number) => formatTime(text),
    },
    {
      title: intl.formatMessage({ id: 'pages.contract.operation' }),
      key: 'operation',
      render: (_: any, record: API.ContractInfo) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewContract(record.id)}
          >
            {intl.formatMessage({ id: 'pages.contract.view' })}
          </Button>
          <Button
            type="link"
            icon={<ApiOutlined />}
            onClick={() => handleCallContract(record.id)}
          >
            {intl.formatMessage({ id: 'pages.contract.call' })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.contract.title' }),
        subTitle: intl.formatMessage({ id: 'pages.contract.subtitle' }),
        extra: [
          <Button
            key="deploy"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleDeployContract}
          >
            {intl.formatMessage({ id: 'pages.contract.deploy' })}
          </Button>,
        ],
      }}
    >
      <div className={styles.container}>
        {guideVisible && (
          <ContractGuide onClose={() => setGuideVisible(false)} />
        )}

        <Card className={styles.listCard}>
          <div className={styles.tableHeader}>
            <Space>
              <Input
                placeholder={intl.formatMessage({ id: 'pages.contract.search.placeholder' })}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
              <Button type="primary" onClick={handleSearch}>
                {intl.formatMessage({ id: 'pages.contract.search' })}
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={data?.list || []}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              total: data?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `${intl.formatMessage({ id: 'pages.common.total' })} ${total} ${intl.formatMessage({ id: 'pages.common.items' })}`,
            }}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default ContractList;
