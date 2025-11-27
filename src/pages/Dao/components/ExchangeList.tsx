import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, message } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useIntl, useRequest } from '@umijs/max';
import { queryExchanges } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import styles from '../index.less';

const { Search } = Input;

interface ExchangeListProps {
  onCreateExchange: () => void;
  onViewExchange: (exchangeId: string) => void;
  onConfirmExchange: (exchangeId: string) => void;
}

const ExchangeList: React.FC<ExchangeListProps> = ({ onCreateExchange, onViewExchange, onConfirmExchange }) => {
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch exchanges
  const { data, loading, run } = useRequest(
    async (params: { current: number; pageSize: number }) => {
      try {
        const response = await queryExchanges({
          limit: params.pageSize,
          offset: (params.current - 1) * params.pageSize,
        });
        
        if (response.success) {
          return {
            list: response.result?.rows || [],
            total: response.result?.total || 0,
          };
        }
        return { list: [], total: 0 };
      } catch (error) {
        console.error('Failed to fetch exchanges:', error);
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
      title: intl.formatMessage({ id: 'pages.dao.exchange.id' }),
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <a onClick={() => onViewExchange(text)}>{formatAddress(text, 8, 8)}</a>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.exchange.org_id' }),
      dataIndex: 'org_id',
      key: 'org_id',
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.exchange.sender' }),
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
      title: intl.formatMessage({ id: 'pages.dao.exchange.receiver' }),
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
      title: intl.formatMessage({ id: 'pages.dao.exchange.price' }),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => (
        <span>{(parseInt(price) / 100000000).toFixed(8)} DDN</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.exchange.state' }),
      dataIndex: 'state',
      key: 'state',
      render: (state: number) => (
        <Tag color={state === 0 ? 'orange' : 'green'}>
          {state === 0 
            ? intl.formatMessage({ id: 'pages.dao.exchange.state.0' }) 
            : intl.formatMessage({ id: 'pages.dao.exchange.state.1' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.exchange.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTime(timestamp),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.exchange.operation' }),
      key: 'operation',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.exchange.view' })}>
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => onViewExchange(record.transaction_id)}
            />
          </Tooltip>
          {record.state === 0 && (
            <Tooltip title={intl.formatMessage({ id: 'pages.dao.exchange.confirm' })}>
              <Button 
                type="link" 
                icon={<CheckCircleOutlined />} 
                onClick={() => onConfirmExchange(record.transaction_id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.searchBar}>
        <Search
          placeholder={intl.formatMessage({ id: 'pages.dao.exchange.search.placeholder' })}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onCreateExchange}
        >
          {intl.formatMessage({ id: 'pages.dao.exchange.create' })}
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

export default ExchangeList;
