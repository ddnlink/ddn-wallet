import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Table, Tabs, Space, message, Typography, Tooltip, Tag, Spin, Row, Col, Statistic, Divider, Empty } from 'antd';
import { UserOutlined, CopyOutlined, QrcodeOutlined, TransactionOutlined, HistoryOutlined, ArrowLeftOutlined, BankOutlined, LockOutlined } from '@ant-design/icons';
import { useIntl, useRequest, useParams, history } from '@umijs/max';
import { getAccountDetail } from '@/services/ddn-wallet/account';
import { queryTrans } from '@/services/api';
import { formatAmount, formatAddress, copyToClipboard, getTransactionTypeName, formatBlockTime } from '@/utils/utils';
import { TokenName } from '@/constants';
import QRCode from 'qrcode';
import styles from './index.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AccountDetailPage: React.FC = () => {
  const intl = useIntl();
  const { address } = useParams<{ address: string }>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [transData, setTransData] = useState<{
    list: API.TransactionItem[];
    pagination: {
      current: number;
      pageSize: number;
      total: number;
    };
  }>({
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  // 获取账户详情
  const { data: accountData, loading: accountLoading } = useRequest(
    () => getAccountDetail({ address }),
    {
      onSuccess: (result) => {
        if (result && result.success) {
          console.log('账户详情:', result.account);
          // 生成二维码
          generateQRCode(address);
        }
      },
    }
  );

  // 获取交易记录
  const { loading: transLoading, run: fetchTrans } = useRequest(
    (params: any) => {
      const currentParams = { ...params };
      return queryTrans({
        ...params,
        address, // 添加地址参数，获取与该地址相关的交易
      }).then((res) => {
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
      },
    }
  );

  // 生成二维码
  const generateQRCode = async (address: string) => {
    try {
      const url = await QRCode.toDataURL(address);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('生成二维码失败:', error);
    }
  };

  // 复制地址
  const copyAddress = () => {
    copyToClipboard(address);
    message.success(intl.formatMessage({ id: 'pages.account.copy.success' }));
  };

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    fetchTrans({
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
    });
  };

  // 返回账户列表
  const goBack = () => {
    history.push('/account');
  };

  // 定义交易记录表格列
  const transColumns = [
    {
      title: intl.formatMessage({ id: 'pages.home.trans.id' }),
      dataIndex: 'id',
      key: 'id',
      width: 220,
      render: (id: string) => (
        <Tooltip title={id}>
          <a href={`/transaction/${id}`} target="_blank" rel="noopener noreferrer">
            {`${id.substring(0, 10)}...${id.substring(id.length - 10)}`}
          </a>
        </Tooltip>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.type' }),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: number) => {
        const typeName = getTransactionTypeName(type);
        return <Tag color="blue">{typeName}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.senderId' }),
      dataIndex: 'senderId',
      key: 'senderId',
      width: 180,
      render: (senderId: string) => (
        <Space>
          {senderId === address ? (
            <Tag color="green">{intl.formatMessage({ id: 'pages.account.this.account' })}</Tag>
          ) : (
            <a href={`/account/detail/${senderId}`}>{formatAddress(senderId)}</a>
          )}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.recipientId' }),
      dataIndex: 'recipientId',
      key: 'recipientId',
      width: 180,
      render: (recipientId: string) => (
        <Space>
          {!recipientId ? (
            '-'
          ) : recipientId === address ? (
            <Tag color="green">{intl.formatMessage({ id: 'pages.account.this.account' })}</Tag>
          ) : (
            <a href={`/account/detail/${recipientId}`}>{formatAddress(recipientId)}</a>
          )}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.amount' }),
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number, record: API.TransactionItem) => {
        const isIncoming = record.recipientId === address;
        const isOutgoing = record.senderId === address;

        if (amount === 0) return <span>-</span>;

        return (
          <span style={{ color: isIncoming ? '#52c41a' : isOutgoing ? '#f5222d' : 'inherit' }}>
            {isIncoming ? '+' : isOutgoing ? '-' : ''}
            {formatAmount(amount)} {TokenName}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.fee' }),
      dataIndex: 'fee',
      key: 'fee',
      width: 120,
      render: (fee: number) => (
        <span>{formatAmount(fee)} {TokenName}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: number) => formatBlockTime(timestamp),
    },
  ];

  // 初始化加载数据
  useEffect(() => {
    if (address) {
      fetchTrans({
        limit: transData.pagination.pageSize,
        offset: (transData.pagination.current - 1) * transData.pagination.pageSize,
      });
    }
  }, [address]);

  // 渲染账户信息卡片
  const renderAccountInfo = () => {
    const account = accountData?.account;

    if (!account) {
      return (
        <Card bordered={false}>
          <Empty description={intl.formatMessage({ id: 'pages.account.not.found' })} />
        </Card>
      );
    }

    return (
      <Card
        bordered={false}
        className={styles.accountInfoCard}
        loading={accountLoading}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Descriptions
              title={
                <Space>
                  <UserOutlined />
                  <span>{intl.formatMessage({ id: 'pages.account.info' })}</span>
                </Space>
              }
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.address' })}>
                <Space>
                  <Text copyable={{ text: address }}>{formatAddress(address)}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.balance' })}>
                <Text strong>{formatAmount(account.balance)} {TokenName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.unconfirmed.balance' })}>
                {formatAmount(account.unconfirmedBalance || account.balance || '0')} {TokenName}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.lock.height' })}>
                {account.lock_height && parseInt(account.lock_height) > 0 ? (
                  <Space>
                    <LockOutlined />
                    <span>{account.lock_height}</span>
                  </Space>
                ) : (
                  intl.formatMessage({ id: 'pages.account.no.lock' })
                )}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.publicKey' })} span={2}>
                {account.publicKey ? (
                  <Text copyable={{ text: account.publicKey }}>{account.publicKey}</Text>
                ) : (
                  <Text type="secondary">{intl.formatMessage({ id: 'pages.account.no.publicKey' })}</Text>
                )}
              </Descriptions.Item>
              {account.secondPublicKey && (
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.second.publicKey' })} span={2}>
                  <Text copyable={{ text: account.secondPublicKey }}>{account.secondPublicKey}</Text>
                </Descriptions.Item>
              )}
              {account.username && (
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.account.username' })}>
                  {account.username}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
          <Col xs={24} md={8}>
            <div className={styles.qrCodeContainer}>
              {qrCodeUrl ? (
                <>
                  <img src={qrCodeUrl} alt="Account QR Code" className={styles.qrCode} />
                  <div className={styles.qrCodeActions}>
                    <Button
                      type="primary"
                      icon={<CopyOutlined />}
                      onClick={copyAddress}
                    >
                      {intl.formatMessage({ id: 'pages.account.copy' })}
                    </Button>
                  </div>
                </>
              ) : (
                <Spin tip={`${intl.formatMessage({ id: 'pages.account.qrcode' })}...`} />
              )}
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染交易记录
  const renderTransactions = () => (
    <Card
      title={
        <Space>
          <TransactionOutlined />
          <span>{intl.formatMessage({ id: 'pages.account.transactions' })}</span>
        </Space>
      }
      bordered={false}
      className={styles.transactionsCard}
    >
      <Table
        columns={transColumns}
        dataSource={transData.list}
        rowKey="id"
        pagination={{
          ...transData.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => intl.formatMessage({ id: 'pages.account.trans.total' }, { total }),
        }}
        loading={transLoading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </Card>
  );

  return (
    <div className={styles.accountDetailPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerActions}>
            <Title level={2}>
              <BankOutlined /> {intl.formatMessage({ id: 'pages.account.detail' })}
            </Title>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={goBack}
              className={styles.backButton}
            >
              {intl.formatMessage({ id: 'pages.account.back' })}
            </Button>
          </div>
          <Text type="secondary">
            {intl.formatMessage({ id: 'pages.account.subtitle' })}
          </Text>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {renderAccountInfo()}

        <Divider />

        {renderTransactions()}
      </div>
    </div>
  );
};

export default AccountDetailPage;
