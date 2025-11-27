import React, { useState } from 'react';
import { Table, Input, Tag, Space, Tooltip, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl, useRequest } from '@umijs/max';
import { getConfirmationsByOrgId } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import styles from '../index.less';

const { Search } = Input;

interface ConfirmationListProps {
  orgId?: string;
  onViewConfirmation: (confirmationId: string) => void;
}

const ConfirmationList: React.FC<ConfirmationListProps> = ({ orgId, onViewConfirmation }) => {
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch confirmations
  const { data, loading, run } = useRequest(
    async (params: { current: number; pageSize: number }) => {
      try {
        if (!orgId) {
          return { list: [], total: 0 };
        }
        
        const response = await getConfirmationsByOrgId(orgId);
        
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
        console.error('Failed to fetch confirmations:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { list: [], total: 0 };
      }
    },
    {
      defaultParams: [{ current: 1, pageSize: 10 }],
      refreshDeps: [orgId],
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
      title: intl.formatMessage({ id: 'pages.dao.confirmation.id' }),
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <a onClick={() => onViewConfirmation(text)}>{formatAddress(text, 8, 8)}</a>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.confirmation.contribution_id' }),
      dataIndex: 'contribution_id',
      key: 'contribution_id',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{formatAddress(text, 8, 8)}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.confirmation.sender' }),
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
      title: intl.formatMessage({ id: 'pages.dao.confirmation.url' }),
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
      title: intl.formatMessage({ id: 'pages.dao.confirmation.state' }),
      dataIndex: 'state',
      key: 'state',
      render: (state: number) => (
        <Tag color={state === 0 ? 'green' : 'red'}>
          {state === 0 
            ? intl.formatMessage({ id: 'pages.dao.confirmation.state.0' }) 
            : intl.formatMessage({ id: 'pages.dao.confirmation.state.1' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.confirmation.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTime(timestamp),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.confirmation.operation' }),
      key: 'operation',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.confirmation.view' })}>
            <a onClick={() => onViewConfirmation(record.transaction_id)}>
              <EyeOutlined />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.searchBar}>
        <Search
          placeholder={intl.formatMessage({ id: 'pages.dao.confirmation.search.placeholder' })}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
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

export default ConfirmationList;
