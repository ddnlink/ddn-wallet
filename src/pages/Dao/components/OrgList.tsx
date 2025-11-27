import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tag, Space, Tooltip, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, SwapOutlined, FileTextOutlined } from '@ant-design/icons';
import { useIntl, useRequest } from '@umijs/max';
import { queryOrgs } from '@/services/dao';
import { formatTime, formatAddress } from '@/utils/utils';
import styles from '../index.less';

const { Search } = Input;

interface OrgListProps {
  onCreateOrg: () => void;
  onViewOrg: (orgId: string) => void;
  onExchangeOrg: (orgId: string) => void;
  onContributeOrg: (orgId: string) => void;
  refreshKey?: number; // 用于触发列表刷新的key
}

const OrgList: React.FC<OrgListProps> = ({ onCreateOrg, onViewOrg, onExchangeOrg, onContributeOrg, refreshKey = 0 }) => {
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch organizations
  const { data, loading, run } = useRequest(
    async (params: { current: number; pageSize: number }) => {
      try {
        const response = await queryOrgs({
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
        console.error('Failed to fetch organizations:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { list: [], total: 0 };
      }
    },
    {
      defaultParams: [{ current: 1, pageSize: 10 }],
      refreshDeps: [refreshKey], // 当refreshKey变化时刷新列表
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
      title: intl.formatMessage({ id: 'pages.dao.org.id' }),
      dataIndex: 'org_id',
      key: 'org_id',
      render: (text: string) => <a onClick={() => onViewOrg(text)}>{text}</a>,
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.org.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.org.address' }),
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{formatAddress(text, 8, 8)}</span>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.org.tags' }),
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string) => (
        <>
          {tags.split(',').map((tag) => (
            <Tag color="blue" key={tag}>
              {tag.trim()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.org.state' }),
      dataIndex: 'state',
      key: 'state',
      render: (state: number) => (
        <Tag color={state === 0 ? 'green' : 'red'}>
          {state === 0
            ? intl.formatMessage({ id: 'pages.dao.org.state.0' })
            : intl.formatMessage({ id: 'pages.dao.org.state.1' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.org.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTime(timestamp),
    },
    {
      title: intl.formatMessage({ id: 'pages.dao.org.operation' }),
      key: 'operation',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.view' })}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewOrg(record.org_id)}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.exchange' })}>
            <Button
              type="link"
              icon={<SwapOutlined />}
              onClick={() => onExchangeOrg(record.org_id)}
              disabled={record.state !== 0}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.contribute' })}>
            <Button
              type="link"
              icon={<FileTextOutlined />}
              onClick={() => onContributeOrg(record.org_id)}
              disabled={record.state !== 0}
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
          placeholder={intl.formatMessage({ id: 'pages.dao.org.search.placeholder' })}
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateOrg}
        >
          {intl.formatMessage({ id: 'pages.dao.org.create' })}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.list || []}
        rowKey="org_id"
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

export default OrgList;
