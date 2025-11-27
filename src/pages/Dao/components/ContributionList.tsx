import React, { useState } from 'react';
import { Table, Input, Button, Space, Tooltip, message } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useIntl, useRequest } from '@umijs/max';
import { queryContributions } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import styles from '../index.less';

const { Search } = Input;

interface ContributionListProps {
  onCreateContribution: () => void;
  onViewContribution: (contributionId: string) => void;
  onConfirmContribution: (contributionId: string) => void;
}

const ContributionList: React.FC<ContributionListProps> = ({ 
  onCreateContribution, 
  onViewContribution, 
  onConfirmContribution 
}) => {
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch contributions
  const { data, loading, run } = useRequest(
    async (params: { current: number; pageSize: number }) => {
      try {
        const response = await queryContributions();
        
        if (response.success) {
          // Pagination would normally be handled by the API
          // Here we're simulating it client-side
          const list = response.result?.rows || [];
          const startIndex = (params.current - 1) * params.pageSize;
          const endIndex = startIndex + params.pageSize;
          
          return {
            list: list.slice(startIndex, endIndex),
            total: list.length,
          };
        }
        return { list: [], total: 0 };
      } catch (error) {
        console.error('Failed to fetch contributions:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { list: [], total: 0 };
      }
    },
    {
      defaultParams: [{ current: 1, pageSize: 10 }],
      refreshDeps: [],
    }
  );

  // Handle table pagination change
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    run({ current: pagination.current, pageSize: pagination.pageSize });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
    // In a real implementation, we would pass the search text to the API
    run({ current: 1, pageSize: pagination.pageSize });
  };

  // Table columns
  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.id' }),
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <a onClick={() => onViewContribution(text)}>{formatAddress(text, 8, 8)}</a>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.title.field' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.sender' }),
      dataIndex: 'sender_address',
      key: 'sender_address',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{formatAddress(text, 8, 8)}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.receiver' }),
      dataIndex: 'received_address',
      key: 'received_address',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{formatAddress(text, 8, 8)}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.url' }),
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text.length > 30 ? text.substring(0, 30) + '...' : text}
          </a>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.price' }),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => (
        <span>{price === '0' ? '-' : (parseInt(price) / 100000000).toFixed(8) + ' DDN'}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTime(timestamp),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.contribution.operation' }),
      key: 'operation',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.contribution.view' })}>
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => onViewContribution(record.transaction_id)}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.contribution.confirm' })}>
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />} 
              onClick={() => onConfirmContribution(record.transaction_id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.searchBar}>
        <Search
          placeholder={intl.formatMessage({ id: 'pages.dao.contribution.search.placeholder' })}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onCreateContribution}
        >
          {intl.formatMessage({ id: 'pages.dao.contribution.create' })}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.list || []}
        rowKey="transaction_id"
        loading={loading}
        pagination={{
          ...pagination,
          total: data?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `${intl.formatMessage({ id: 'pages.common.total' })} ${total} ${intl.formatMessage({ id: 'pages.common.items' })}`,
        }}
        onChange={handleTableChange}
        className={styles.tableContainer}
      />
    </div>
  );
};

export default ContributionList;
