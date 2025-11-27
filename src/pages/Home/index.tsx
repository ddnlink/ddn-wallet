import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Radio, Space, Tooltip, message, Statistic, Progress } from 'antd';
import { PieChartFilled, BarChartOutlined, RadarChartOutlined, ClockCircleOutlined, CopyOutlined, BlockOutlined } from '@ant-design/icons';
import { useIntl, useModel, useRequest } from '@umijs/max';
import { ChartCard } from '@/components/Charts';
import { queryAccount, queryPeerInfo, queryTrans } from '@/services/api';
import { getKeyStore } from '@/utils/authority';
import { formatAmount, formatAddress, copyToClipboard, getTransactionTypeName, formatBlockTime, getTimeElapsed } from '@/utils/utils';
import { NETWORKS, TokenName } from '@/constants';
import styles from './index.less';

const HomePage: React.FC = () => {
  const [role, setRole] = useState<string>('all');
  const [address, setAddress] = useState<string>('');
  const [latestBlock, setLatestBlock] = useState<any>({});
  const [blockInfo, setBlockInfo] = useState({
    height: 0,
    timestamp: 0,
  });
  const [accountData, setAccountData] = useState<any>({});
  const [transData, setTransData] = useState<API.TransactionList>({
    list: [],
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1,
    },
  });

  const intl = useIntl();
  const timeElapsed = getTimeElapsed();

  const { initialState } = useModel('@@initialState');


  // 获取账户信息
  const { data: fetchAccount, loading: accountLoading, run: fetchAccountData } = useRequest(
    () => queryAccount({ address: initialState?.currentUser?.address || '' }),
    {
      manual: true, // 设置为手动触发
      formatResult: (res) => {
        if (res.success) {
          setAccountData(res.account)
          setLatestBlock(res.latestBlock)

          // 将账户余额信息写入 initialState
          if (initialState?.setInitialState && res.account) {
            initialState.setInitialState({
              ...initialState,
              currentUser: {
                ...initialState.currentUser,
                balance: res.account.balance,
                lock_height: res.account.lock_height
              }
            });
          }
        }
        return res
      }
    }
  );

  // 在组件挂载和地址变化时获取账户数据
  useEffect(() => {
    if (initialState?.currentUser?.address) {
      fetchAccountData();
    }
  }, [initialState?.currentUser?.address]);

  // 模拟区块信息更新
  useEffect(() => {
    // 初始化区块信息
    if (latestBlock?.height) {
      setBlockInfo({
        height: parseInt(latestBlock.height) || 0,
        timestamp: Date.now(),
      });
    }

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
  }, [latestBlock?.height]);

  // 设置定时刷新账户数据
  useEffect(() => {
    const timer = setInterval(() => {
      if (initialState?.currentUser?.address) {
        fetchAccountData();
      }
    }, 10000); // 每10秒刷新一次

    return () => clearInterval(timer);
  }, [initialState?.currentUser?.address]);

  // 获取节点信息
  const { data: peer, loading: peerLoading } = useRequest(queryPeerInfo, {
    formatResult: (res) => res.success ? res.version : { version: '0.0.0', build: '', net: NETWORKS.TESTNET },
  });

  // 获取交易记录
  const { run: fetchTrans, loading: transLoading } = useRequest(
    (params: any) => {
      // 保存当前请求参数到一个闭包变量中
      const currentParams = { ...params };

      return queryTrans(params).then(res => {
        if (res.success) {
          setTransData({
            list: res.transactions || [],
            pagination: {
              total: res.count || 0,
              pageSize: currentParams?.limit || 10,
              current: Math.floor((currentParams?.offset || 0) / (currentParams?.limit || 10)) + 1,
            },
          });
        }

        return res;
      });
    },
    {
      manual: true,
      onError: (error) => {
        console.error('Transaction request error:', error);
        message.error('获取交易记录失败');
      }
    }
  );

  // 初始化数据
  useEffect(() => {
    const keyStore = getKeyStore();
    if (keyStore) {
      setAddress(keyStore.address);
    } else {
      console.warn('No KeyStore found');
    }
  }, []);

  // 当地址变化时获取交易数据
  useEffect(() => {
    if (address) {
      console.log('Address changed, fetching transaction data:', address);
      try {
        getTransData();

      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    }
  }, [address]);

  // 获取交易数据
  const getTransData = (pagination?: any) => {
    try {
      if (!address) {
        console.warn('No address available for fetching transaction data');
        return;
      }

      const params: any = {
        orderBy: 't_timestamp:desc',
        offset: ((pagination?.current || 1) - 1) * (pagination?.pageSize || 10),
        limit: pagination?.pageSize || 10,
      };

      if (role === 'sender') {
        params.senderId = address;
      } else if (role === 'recipient') {
        params.recipientId = address;
      } else {
        // 在 umi2 中，'all' 模式下同时查询 senderId 和 recipientId
        // 这里需要根据实际 API 调整，可能需要两次查询或者 API 支持 OR 条件
        params.senderId = address;
        params.recipientId = address;
        params.or = true; // 假设 API 支持 OR 条件，实际情况可能需要调整
      }

      fetchTrans(params);
    } catch (error) {
      console.error('Error in getTransData:', error);
    }
  };

  // 处理角色切换
  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
    getTransData();
  };

  // 处理表格分页变化
  const handleTableChange = (pagination: any) => {
    getTransData(pagination);
  };

  // 表格列定义
  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.home.trans.id' }),
      dataIndex: 'id',
      width: '15%',
      render: (text: string) => {
        if (!text) return '-';
        return (
          <Tooltip title={text}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              {formatAddress(text)}
              <CopyOutlined
                style={{ marginLeft: 4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // 阻止事件冒泡，防止触发链接点击
                  e.preventDefault();
                  // 使用导入的 copyToClipboard 函数
                  if (copyToClipboard(text)) {
                    message.success('复制成功');
                  } else {
                    message.error('复制失败');
                  }
                }}
              />
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.type' }),
      dataIndex: 'type',
      width: '10%',
      render: (text: number) => <span>{getTransactionTypeName(text)}</span>,
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.senderId' }),
      dataIndex: 'senderId',
      width: '20%',
      render: (text: string) => {
        if (!text) return '-';
        return (
          <Tooltip title={text}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              {formatAddress(text)}
              <CopyOutlined
                style={{ marginLeft: 4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (copyToClipboard(text)) {
                    message.success('复制成功');
                  } else {
                    message.error('复制失败');
                  }
                }}
              />
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.recipientId' }),
      dataIndex: 'recipientId',
      width: '20%',
      render: (text: string) => {
        if (!text) return '-';
        return (
          <Tooltip title={text}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              {formatAddress(text)}
              <CopyOutlined
                style={{ marginLeft: 4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (copyToClipboard(text)) {
                    message.success('复制成功');
                  } else {
                    message.error('复制失败');
                  }
                }}
              />
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.amount' }),
      dataIndex: 'amount',
      width: '8%',
      render: (text: number) => formatAmount(text),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.fee' }),
      dataIndex: 'fee',
      width: '7%',
      render: (text: number) => formatAmount(text),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.height' }),
      dataIndex: 'height',
      width: '6%',
      render: (text: number) => (
        <a href="#" target="_blank" onClick={(e) => e.preventDefault()}>
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.timestamp' }),
      dataIndex: 'timestamp',
      width: '12%',
      render: (text: number) => {
        // 检查是否需要使用 DdnJS.utils.slots.getRealTime 转换时间戳
        // 在 umi2 中使用了这个方法，但在 umi4 中可能直接使用了正确的时间戳
        // const realTime = DdnJS.utils.slots.getRealTime(Number(text));
        return (
          <span>
            {formatBlockTime(text)}
          </span>
        );
      },
    },
  ];

  // 响应式布局属性
  const topColResponsiveProps = {
    xs: 24,
    sm: 8,
    md: 8,
    lg: 8,
    xl: 8,
  };

  // 交易类型过滤器
  const extraContent = (
    <div className={styles.extraContent}>
      <Radio.Group value={role} onChange={handleRoleChange}>
        <Radio.Button value="all">
          {intl.formatMessage({ id: 'pages.home.trans.all' })}
        </Radio.Button>
        <Radio.Button value="sender">
          {intl.formatMessage({ id: 'pages.home.trans.send' })}
        </Radio.Button>
        <Radio.Button value="recipient">
          {intl.formatMessage({ id: 'pages.home.trans.receipt' })}
        </Radio.Button>
      </Radio.Group>
    </div>
  );

  return (
    <div className={styles.home}>
      <Row gutter={24}>
        <Col {...topColResponsiveProps}>
          <ChartCard
            title={
              <div style={{ fontSize: '20px' }}>
                <PieChartFilled />
                <span style={{ marginLeft: '10px' }}>
                  {intl.formatMessage({ id: 'pages.home.balance' })}
                </span>
              </div>
            }
            action={
              <span>
                <span>{intl.formatMessage({ id: 'pages.home.unit' })}: </span>
                <span>{TokenName}</span>
              </span>
            }
            loading={accountLoading}
            total={() => <div style={{ marginTop: '5px' }}>{formatAmount(accountData?.balance || 0)}</div>}
            footer={
              <div>
                {intl.formatMessage({ id: 'pages.home.lock-height' })}: {accountData?.lock_height || 0}
              </div>
            }
          />
        </Col>
        <Col {...topColResponsiveProps}>
            <ChartCard
              title={
                <div style={{ fontSize: '20px' }}>
                  <BarChartOutlined />
                  <span style={{ marginLeft: '10px' }}>
                    {intl.formatMessage({ id: 'pages.home.block-height' })}
                  </span>
                </div>
              }
              loading={accountLoading}
              total={() => <div style={{ marginTop: '5px' }}>{blockInfo.height.toLocaleString() || 0}</div>}
              footer={
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
              }
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title={
                <div style={{ fontSize: '20px' }}>
                  <RadarChartOutlined />
                  <span style={{ marginLeft: '10px' }}>
                    {intl.formatMessage({ id: `pages.home.${peer?.net || NETWORKS.TESTNET}` })}
                  </span>
                </div>
              }
              action={
                <span>
                  <span>{intl.formatMessage({ id: 'pages.home.peer' })}: </span>
                  <span>Peer0</span>
                </span>
              }
              loading={peerLoading}
              total={() => <div style={{ marginTop: '5px' }}>v{peer?.version || '0.0.0'}</div>}
              footer={
                <div>
                  {intl.formatMessage({ id: 'blockchain.runtime' }, { time: timeElapsed })}
                </div>
              }
            />
          </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card
            className={styles.listCard}
            title={
              <div style={{ fontSize: 20 }}>
                <ClockCircleOutlined />
                <span style={{ marginLeft: 10 }}>
                  {intl.formatMessage({ id: 'pages.home.translist' })}
                </span>
              </div>
            }
            style={{ marginTop: 24, padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <div className={styles.tableList}>
              <Table
                loading={transLoading}
                rowKey={record => record.id}
                dataSource={transData.list}
                pagination={transData.pagination}
                columns={columns}
                onChange={handleTableChange}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
