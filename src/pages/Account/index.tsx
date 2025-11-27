import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Row, Col, Statistic, Tag, Space, Tooltip, message, Avatar, Typography, Progress } from 'antd';
import { SearchOutlined, UserOutlined, CopyOutlined, QrcodeOutlined, BankOutlined, TeamOutlined, SortAscendingOutlined, SortDescendingOutlined, BlockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useIntl, useRequest, history } from '@umijs/max';
import { getAccountList, getAccountSum } from '@/services/ddn-wallet/account';
import { formatAmount, formatAddress, copyToClipboard, formatBlockTime } from '@/utils/utils';
import { TokenName } from '@/constants';
import styles from './index.less';

const { Title, Text } = Typography;

const AccountPage: React.FC = () => {
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [accountData, setAccountData] = useState<API.Account[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取账户总数
  const { data: accountSum, loading: sumLoading } = useRequest(getAccountSum, {
    onSuccess: (result) => {
      if (result && result.success) {
        console.log('账户总数:', result.count);
      }
    },
  });

  // 获取最新区块信息
  const [blockInfo, setBlockInfo] = useState({
    height: 0,
    timestamp: 0,
  });

  // 模拟获取区块信息
  useEffect(() => {
    // 初始化区块信息
    setBlockInfo({
      height: Math.floor(Math.random() * 1000000) + 5000000,
      timestamp: Date.now(),
    });

    // 每10秒更新一次区块高度，模拟出块
    const blockTimer = setInterval(() => {
      setBlockInfo(prevInfo => ({
        height: prevInfo.height + 1,
        timestamp: Date.now(),
      }));
    }, 10000);

    // 每秒更新一次进度条，强制重新渲染
    const progressTimer = setInterval(() => {
      setBlockInfo(prevInfo => ({
        ...prevInfo,
        timestamp: prevInfo.timestamp,
      }));
    }, 1000);

    return () => {
      clearInterval(blockTimer);
      clearInterval(progressTimer);
    };
  }, []);

  // 获取账户列表
  const { loading: listLoading, run: fetchAccountList } = useRequest(
    (params) => {
      return getAccountList({
        ...params,
        orderBy: `balance:${sortOrder === 'descend' ? 'desc' : 'asc'}`,
      }).then((res) => {
        if (res.success && res.accounts) {
          setAccountData(res.accounts);
          setPagination({
            ...pagination,
            total: res.count || 0,
          });
        }
        return res;
      });
    },
    {
      manual: true,
      onError: (error) => {
        console.error('获取账户列表失败:', error);
        message.error('获取账户列表失败');
      },
    }
  );

  // 处理表格变化
  const handleTableChange = (newPagination: any) => {
    const params = {
      limit: newPagination.pageSize,
      offset: (newPagination.current - 1) * newPagination.pageSize,
    };
    fetchAccountList(params);
    setPagination(newPagination);
  };

  // 处理排序变化
  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'descend' ? 'ascend' : 'descend';
    setSortOrder(newSortOrder);
    fetchAccountList({
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
    });
  };

  // 处理搜索
  const handleSearch = () => {
    if (searchText.trim()) {
      // 如果是有效的 DDN 地址格式，直接跳转到详情页
      if (/^D[0-9A-Za-z]{33}$/.test(searchText.trim())) {
        history.push(`/account/detail/${searchText.trim()}`);
      } else {
        message.info('请输入有效的 DDN 地址');
      }
    } else {
      // 重置搜索，显示所有账户
      setPagination({
        ...pagination,
        current: 1,
      });
      fetchAccountList({
        limit: pagination.pageSize,
        offset: 0,
      });
    }
  };

  // 查看账户详情
  const viewAccountDetail = (address: string) => {
    history.push(`/account/detail/${address}`);
  };

  // 复制地址
  const copyAddress = (address: string) => {
    copyToClipboard(address);
    message.success(intl.formatMessage({ id: 'pages.account.copy.success' }));
  };

  // 定义表格列
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.account.address' }),
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <a onClick={() => viewAccountDetail(address)}>{formatAddress(address)}</a>
          <Tooltip title={intl.formatMessage({ id: 'pages.account.copy' })}>
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                copyAddress(address);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.account.balance' }),
      dataIndex: 'balance',
      key: 'balance',
      sorter: true,
      sortOrder,
      render: (balance: string) => (
        <span>{formatAmount(balance)} {TokenName}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.account.publicKey' }),
      dataIndex: 'publicKey',
      key: 'publicKey',
      responsive: ['lg'],
      render: (publicKey: string) => (
        publicKey ? (
          <Tooltip title={publicKey}>
            <span>{publicKey ? `${publicKey.substring(0, 10)}...` : '-'}</span>
          </Tooltip>
        ) : '-'
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.account.operation' }),
      key: 'action',
      width: 120,
      render: (_: any, record: API.Account) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => viewAccountDetail(record.address || '')}
          >
            {intl.formatMessage({ id: 'pages.account.view' })}
          </Button>
        </Space>
      ),
    },
  ];

  // 初始化加载数据
  useEffect(() => {
    fetchAccountList({
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
    });
  }, []);

  // 渲染页面头部统计信息
  const renderStatistics = () => (
    <Row gutter={16} className={styles.statisticsRow}>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Card bordered={false} className={styles.statisticCard}>
          <Statistic
            title={intl.formatMessage({ id: 'pages.account.total' })}
            value={accountSum?.count || 0}
            prefix={<TeamOutlined />}
            loading={sumLoading}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={8}>
        <Card bordered={false} className={styles.statisticCard}>
          <Statistic
            title={intl.formatMessage({ id: 'pages.account.sort' })}
            value={intl.formatMessage({ id: sortOrder === 'descend' ? 'pages.account.sort.desc' : 'pages.account.sort.asc' })}
            prefix={sortOrder === 'descend' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
            valueStyle={{ color: sortOrder === 'descend' ? '#3f8600' : '#cf1322' }}
          />
          <Button
            type="link"
            onClick={handleSortChange}
            className={styles.sortButton}
          >
            {intl.formatMessage({ id: 'pages.account.sort.toggle' })}
          </Button>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8}>
        <Card bordered={false} className={styles.statisticCard}>
          <div className={styles.blockInfoCard}>
            <div className={styles.blockInfoHeader}>
              <BlockOutlined className={styles.blockIcon} />
              <span>{intl.formatMessage({ id: 'pages.home.block-height' })}</span>
            </div>
            <div className={styles.blockHeight}>
              {blockInfo.height.toLocaleString()}
            </div>
            <div className={styles.blockTime}>
              <ClockCircleOutlined /> {formatBlockTime(blockInfo.timestamp)}
            </div>
            <div className={styles.blockProgress}>
              <Progress
                percent={((Date.now() / 1000) % 10) * 10}
                size="small"
                showInfo={false}
                strokeColor="#4865FE"
                trailColor="rgba(0,0,0,0.05)"
              />
              <div className={styles.blockProgressText}>
                {intl.formatMessage({ id: 'pages.home.next-block' })}: {Math.floor(10 - ((Date.now() / 1000) % 10))}s
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className={styles.accountPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <Title level={2}>
            <BankOutlined /> {intl.formatMessage({ id: 'pages.account.title' })}
          </Title>
          <Text type="secondary">
            {intl.formatMessage({ id: 'pages.account.subtitle' })}
          </Text>

          <div className={styles.searchContainer}>
            <Input.Search
              placeholder={intl.formatMessage({ id: 'pages.account.search.placeholder' })}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
              size="large"
            />
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {renderStatistics()}

        <Card
        title={intl.formatMessage({ id: 'pages.account.rank' })}
        className={styles.accountListCard}
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={accountData}
          rowKey="address"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => intl.formatMessage({ id: 'pages.account.total.count' }, { total }),
          }}
          loading={listLoading}
          onChange={handleTableChange}
        />
      </Card>
      </div>
    </div>
  );
};

export default AccountPage;
