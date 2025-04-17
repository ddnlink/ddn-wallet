import React, { useState, useEffect } from 'react';
import { Table, Card, Empty, Spin, Modal, Descriptions, Typography, Divider, Tag, Space, Button } from 'antd';
import { useIntl, history } from 'umi';
import moment from 'moment';
import { getAobTransaction, getAobTransfers } from '@/services/api';
import { getKeyStore } from '@/utils/authority';

const { Title, Text } = Typography;

interface TransactionsResponse {
  success: boolean;
  result?: {
    rows: any[];
    total: number;
  };
  error?: string;
}

interface AssetTransactionHistoryProps {
  asset?: API.AssetInfo | API.AssetBalance | null;
  address?: string;
  onAssetChange?: (asset: string | null) => void;
}

const AssetTransactionHistory: React.FC<AssetTransactionHistoryProps> = ({ asset, address: propAddress, onAssetChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(asset ? (asset.currency || (asset as any).name) : null);

  const intl = useIntl();
  const keyStore = getKeyStore();
  const userAddress = propAddress || keyStore?.address;

  const fetchTransactions = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 尝试两种方式获取交易历史
      let response;

      if (selectedAsset && userAddress) {
        // 获取指定资产的交易记录
        response = await getAobTransaction({
          address: userAddress,
          currency: selectedAsset,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }) as TransactionsResponse;

        // console.log(' 001 response', response);
        
        // fixme: 这里的AoB资产接口有点乱，请使用新版 v3.8.0 以上
        // 如果没有数据，尝试获取所有该资产的交易记录
        if (!response?.success || !response?.result?.rows?.length) {
          response = await getAobTransfers(selectedAsset, {
            limit: pageSize,
            offset: (page - 1) * pageSize,
          }) as TransactionsResponse;
          // console.log(' 002 response', response);

          // 过滤出与当前用户相关的交易（发送方或接收方）
          if (response?.success && response?.result?.rows?.length) {
            response.result.rows = response.result.rows.filter(tx =>
              tx.senderId === userAddress || tx.recipientId === userAddress
            );
            response.result.total = response.result.rows.length;
          }
        }
      } else if (userAddress) {
        // 获取用户的所有资产交易记录
        // 尝试获取用户的所有资产交易
        try {
          // 先尝试获取用户的所有资产交易
          response = await getAobTransaction({
            address: userAddress,
            currency: '',  // 空字符串表示获取所有资产
            limit: pageSize,
            offset: (page - 1) * pageSize,
          }) as TransactionsResponse;

          // 如果没有数据，尝试获取用户的所有交易记录
          if (!response?.success || !response?.result?.rows?.length) {
            // 模拟数据，在实际环境中应该使用真实的API
            // 创建一些模拟交易，确保其中至少有一个与当前用户相关
            
            const mockTransactions = response?.result?.rows || [];

            // 过滤出与当前用户相关的交易
            const filteredTransactions = mockTransactions.filter(tx =>
              tx.senderId === userAddress || tx.recipientId === userAddress
            );

            response = {
              success: true,
              result: {
                rows: filteredTransactions,
                total: filteredTransactions.length
              }
            };
          }
        } catch (error) {
          console.error('Error fetching all transactions:', error);
        }
      }

      if (response?.success) {
        setTransactions(response.result?.rows || []);
        setPagination({
          ...pagination,
          current: page,
          total: response.result?.total || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch asset transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理资产选择
  const handleAssetSelect = (currency: string) => {
    setSelectedAsset(currency);
    // 通知父组件资产变化
    if (onAssetChange) {
      onAssetChange(currency);
    }
  };

  // 当asset参数变化时，更新selectedAsset
  useEffect(() => {
    if (asset) {
      const assetName = asset.currency || (asset as any).name;
      if (assetName) {
        setSelectedAsset(assetName);
      }
    }
  }, [asset]);

  // 当selectedAsset或userAddress变化时，获取交易历史
  useEffect(() => {
    if (userAddress) {
      fetchTransactions();
    }
  }, [selectedAsset, userAddress]);

  const handleTableChange = (pagination: any) => {
    fetchTransactions(pagination.current || 1, pagination.pageSize || 10);
  };

  // 处理查看交易详情
  const handleViewDetail = (id: string) => {
    const transaction = transactions.find(tx => tx.id === id);
    if (transaction) {
      setCurrentTransaction(transaction);
      setDetailVisible(true);
    }
  };

  // 关闭详情模态框
  const handleCloseDetail = () => {
    setDetailVisible(false);
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.home.trans.id' }),
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      width: 220,
      render: (text: string) => (
        <a onClick={() => handleViewDetail(text)}>{text}</a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.type' }),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => {
        // 资产转账类型为65
        if (type === 65) {
          return intl.formatMessage({ id: 'pages.assets.transaction.type.transfer' });
        }
        return type;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.name' }),
      key: 'currency',
      width: 150,
      render: (_: any, record: any) => {
        if (record.asset?.aobTransfer) {
          return (
            <a onClick={() => handleAssetSelect(record.asset.aobTransfer.currency)}>
              {record.asset.aobTransfer.currency}
            </a>
          );
        }
        return '-';
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.senderId' }),
      dataIndex: 'senderId',
      key: 'senderId',
      ellipsis: true,
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.recipientId' }),
      dataIndex: 'recipientId',
      key: 'recipientId',
      ellipsis: true,
      width: 180,
      render: (text: string) => text || '-',
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.amount' }),
      key: 'amount',
      width: 120,
      render: (_: any, record: any) => {
        if (record.asset?.aobTransfer) {
          return record.asset.aobTransfer.amount || '-';
        }
        return '-';
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.transfer.message' }),
      key: 'message',
      width: 150,
      render: (_: any, record: any) => {
        if (record.asset?.aobTransfer) {
          return record.asset.aobTransfer.content || '-';
        }
        return '-';
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.fee' }),
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
      render: (fee: string) => (Number(fee) / 100000000).toFixed(8),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      render: (timestamp: number) =>
        moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 如果没有用户地址，显示提示
  if (!userAddress) {
    return <Empty description={intl.formatMessage({ id: 'pages.assets.no.user.address' })} />;
  }

  return (
    <>
      <Card
        title={
          selectedAsset
            ? intl.formatMessage({ id: 'pages.assets.transaction.history.for' }, { name: selectedAsset })
            : intl.formatMessage({ id: 'pages.assets.transaction.history.all' })
        }
        extra={
          selectedAsset && (
            <Button type="link" onClick={() => {
              setSelectedAsset(null);
              // 通知父组件资产变化
              if (onAssetChange) {
                onAssetChange(null);
              }
            }}>
              {intl.formatMessage({ id: 'pages.assets.transaction.view.all' })}
            </Button>
          )
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) =>
                intl.formatMessage({ id: 'pages.assets.transaction.total' }, { total }),
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Spin>
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'pages.assets.transaction.detail' })}
        open={detailVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={800}
      >
        {currentTransaction && (
          <>
            <Typography>
              <Title level={4}>{intl.formatMessage({ id: 'pages.assets.transaction.info' })}</Title>
            </Typography>

            <Descriptions bordered column={1}>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.id' })}>
                <Text copyable>{currentTransaction.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.type' })}>
                {currentTransaction.type === 65 ? (
                  <Tag color="blue">{intl.formatMessage({ id: 'pages.assets.transaction.type.transfer' })}</Tag>
                ) : (
                  <Tag>{currentTransaction.type}</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.timestamp' })}>
                {moment(currentTransaction.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.senderId' })}>
                <Text copyable>{currentTransaction.senderId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.recipientId' })}>
                <Text copyable>{currentTransaction.recipientId || '-'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.fee' })}>
                {(Number(currentTransaction.fee) / 100000000).toFixed(8)}
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.confirmations' })}>
                {currentTransaction.confirmations}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Typography>
              <Title level={4}>{intl.formatMessage({ id: 'pages.assets.transaction.asset.info' })}</Title>
            </Typography>

            {currentTransaction.asset?.aobTransfer && (
              <Descriptions bordered column={1}>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.assets.name' })}>
                  {currentTransaction.asset.aobTransfer.currency}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.assets.transfer.amount' })}>
                  {currentTransaction.asset.aobTransfer.amount}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'pages.assets.transfer.message' })}>
                  {currentTransaction.asset.aobTransfer.content || '-'}
                </Descriptions.Item>
              </Descriptions>
            )}

            <Divider />

            <Typography>
              <Title level={4}>{intl.formatMessage({ id: 'pages.assets.transaction.block.info' })}</Title>
            </Typography>

            <Descriptions bordered column={1}>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.assets.transaction.block.id' })}>
                <Text copyable>{currentTransaction.block_id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.assets.transaction.block.height' })}>
                {currentTransaction.block_height}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
};

export default AssetTransactionHistory;
