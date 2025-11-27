import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, message, Table, Badge, Space } from 'antd';
import { PlusOutlined, DollarOutlined, SwapOutlined, HistoryOutlined } from '@ant-design/icons';
import { useIntl, useRequest } from 'umi';
import { getKeyStore } from '@/utils/authority';
import {
  getIssuerByAddress,
  getAssetsByIssuer,
  getAobBalances,
  postTransaction
} from '@/services/api';
import RegisterIssuerForm from './components/RegisterIssuerForm';
import RegisterAssetForm from './components/RegisterAssetForm';
import IssueAssetForm from './components/IssueAssetForm';
import TransferAssetForm from './components/TransferAssetForm';
import AssetTransactionHistory from './components/AssetTransactionHistory';
import styles from './index.less';

const { TabPane } = Tabs;

interface IssuerResponse {
  success: boolean;
  result?: {
    name: string;
    desc: string;
    issuerId: string;
  };
  error?: string;
}

interface AssetsResponse {
  success: boolean;
  result?: {
    rows: API.AssetInfo[];
  };
  error?: string;
}

interface BalancesResponse {
  success: boolean;
  result?: API.AssetBalance[];
  error?: string;
}

interface TransactionResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

const AssetsPage: React.FC = () => {
  const intl = useIntl();
  const [issuer, setIssuer] = useState<API.IssuerInfo | null>(null);
  const [myAssets, setMyAssets] = useState<API.AssetBalance[]>([]);
  const [myIssuedAssets, setMyIssuedAssets] = useState<API.AssetInfo[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<API.AssetInfo | API.AssetBalance | null>(null);
  const [issuerModalVisible, setIssuerModalVisible] = useState<boolean>(false);
  const [assetModalVisible, setAssetModalVisible] = useState<boolean>(false);
  const [issueModalVisible, setIssueModalVisible] = useState<boolean>(false);
  const [transferModalVisible, setTransferModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('1');

  const keyStore = getKeyStore();
  const address = keyStore?.address;

  // 获取发行商信息
  const { loading: issuerLoading, run: fetchIssuer } = useRequest<IssuerResponse, []>(
    () => getIssuerByAddress(address || ''),
    {
      manual: true,
      onSuccess: (result) => {
        if (result && result.success && result.result) {
          setIssuer(result.result);
          fetchMyIssuedAssets(result.result.name);
        }
      },
    }
  );

  // 获取我的资产
  const { loading: assetsLoading, run: fetchMyAssets } = useRequest<BalancesResponse, []>(
    () => getAobBalances(address || ''),
    {
      manual: true,
      onSuccess: (result) => {
        if (result && result.success) {
          setMyAssets(result.result || []);
        }
      },
    }
  );

  // 获取我发行的资产
  const { loading: issuedAssetsLoading, run: fetchMyIssuedAssets } = useRequest<AssetsResponse, [string]>(
    (issuerName: string) => getAssetsByIssuer(issuerName),
    {
      manual: true,
      onSuccess: (result) => {
        if (result && result.success && result.result) {
          setMyIssuedAssets(result.result.rows || []);
        }
      },
    }
  );

  // 提交交易
  const { loading: submitting, run: submitTransaction } = useRequest<TransactionResponse, [any]>(
    (transaction: any) => postTransaction({ transaction }),
    {
      manual: true,
      onSuccess: (result) => {
        console.log('result', result);

        if (result && result.success) {
          message.success(intl.formatMessage({ id: 'pages.assets.transaction.success' }));
          // 刷新数据
          fetchIssuer();
          fetchMyAssets();
          if (issuer) {
            fetchMyIssuedAssets(issuer.name);
          }
          // 关闭所有模态框
          setIssuerModalVisible(false);
          setAssetModalVisible(false);
          setIssueModalVisible(false);
          setTransferModalVisible(false);
        }
      },
      onError: (error: Error) => {
        message.error(error.message || intl.formatMessage({ id: 'pages.assets.transaction.failed' }));
      }
    }
  );

  useEffect(() => {
    if (address) {
      fetchIssuer();
      fetchMyAssets();
    }
  }, [address]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);

    // 如果切换到“我的资产”或“我发行的资产”tab，清除选定的资产
    if (key === '1' || key === '2') {
      setSelectedAsset(null);
    }
  };

  // 我的资产列表列定义
  const myAssetsColumns = [
    {
      title: intl.formatMessage({ id: 'pages.assets.name' }),
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.balance' }),
      dataIndex: 'balance',
      key: 'balance',
      render: (text: string, record: API.AssetBalance) => {
        const precision = record.precision || 0;
        const balanceNum = Number(text) / Math.pow(10, precision);
        return balanceNum.toFixed(precision);
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.maximum' }),
      dataIndex: 'maximum',
      key: 'maximum',
      render: (text: string, record: API.AssetBalance) => {
        if (!text) return '-';
        const precision = record.precision || 0;
        const maxNum = Number(text) / Math.pow(10, precision);
        return isNaN(maxNum) ? '-' : maxNum.toFixed(precision);
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.precision' }),
      dataIndex: 'precision',
      key: 'precision',
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.operation' }),
      key: 'operation',
      render: (_: any, record: API.AssetBalance) => (
        <Space>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={() => {
              setSelectedAsset(record);
              setTransferModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'pages.assets.transfer' })}
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => {
              setSelectedAsset(record);
              setActiveTab('3');
            }}
          >
            {intl.formatMessage({ id: 'pages.assets.history' })}
          </Button>
        </Space>
      ),
    },
  ];

  // 我发行的资产列表列定义
  const myIssuedAssetsColumns = [
    {
      title: intl.formatMessage({ id: 'pages.assets.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.description' }),
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.maximum' }),
      dataIndex: 'maximum',
      key: 'maximum',
      render: (text: string, record: API.AssetInfo) => {
        if (!text) return '-';
        const precision = record.precision || 0;
        const maxNum = Number(text) / Math.pow(10, precision);
        return isNaN(maxNum) ? '-' : maxNum.toFixed(precision);
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.precision' }),
      dataIndex: 'precision',
      key: 'precision',
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.quantity' }),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: string, record: API.AssetInfo) => {
        if (!text) return '-';
        const precision = record.precision || 0;
        const quantityNum = Number(text) / Math.pow(10, precision);
        return isNaN(quantityNum) ? '-' : quantityNum.toFixed(precision);
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.assets.operation' }),
      key: 'operation',
      render: (_: any, record: API.AssetInfo) => (
        <Space>
          <Button
            type="primary"
            icon={<DollarOutlined />}
            onClick={() => {
              setSelectedAsset(record);
              setIssueModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'pages.assets.issue' })}
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => {
              setSelectedAsset(record);
              setActiveTab('3');
            }}
          >
            {intl.formatMessage({ id: 'pages.assets.history' })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.assetsPage}>
      <div className={styles.issuerCard}>
        <div className={styles.issuerBackground}></div>
        <div className={styles.issuerCardContent}>
          <h2 className={styles.issuerTitle}>{intl.formatMessage({ id: 'pages.assets.issuer.info' })}</h2>

          {issuer ? (
            <div className={styles.issuerInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>{intl.formatMessage({ id: 'pages.assets.issuer.name' })}:</span>
                <span className={styles.value}>{issuer.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>{intl.formatMessage({ id: 'pages.assets.issuer.description' })}:</span>
                <span className={styles.value}>{issuer.desc}</span>
              </div>
              <div className={styles.statusBadge}>
                <Badge status="success" text={intl.formatMessage({ id: 'pages.assets.issuer.registered' })} />
              </div>
            </div>
          ) : (
            <div className={styles.issuerInfo}>
              <div className={styles.infoItem}>
                <span className={styles.value}>{intl.formatMessage({ id: 'pages.assets.issuer.not.registered' })}</span>
              </div>
              <Button
                className={styles.registerButton}
                icon={<PlusOutlined />}
                onClick={() => setIssuerModalVisible(true)}
              >
                {intl.formatMessage({ id: 'pages.assets.issuer.register' })}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.assetsTabs}>
        <TabPane
          tab={intl.formatMessage({ id: 'pages.assets.my.assets' })}
          key="1"
        >
          <Card
            title={intl.formatMessage({ id: 'pages.assets.my.assets' })}
            loading={assetsLoading}
          >
            <Table
              dataSource={myAssets}
              columns={myAssetsColumns}
              rowKey="currency"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={intl.formatMessage({ id: 'pages.assets.my.issued.assets' })}
          key="2"
          disabled={!issuer}
        >
          <Card
            title={intl.formatMessage({ id: 'pages.assets.my.issued.assets' })}
            loading={issuedAssetsLoading}
            extra={
              issuer && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAssetModalVisible(true)}
                >
                  {intl.formatMessage({ id: 'pages.assets.register' })}
                </Button>
              )
            }
          >
            <Table
              dataSource={myIssuedAssets}
              columns={myIssuedAssetsColumns}
              rowKey="name"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            selectedAsset
              ? intl.formatMessage({ id: 'pages.assets.transaction.history.for' }, { name: selectedAsset.currency || (selectedAsset as any).name || '' })
              : intl.formatMessage({ id: 'pages.assets.transaction.history.all' })
          }
          key="3"
        >
          <AssetTransactionHistory
            address={address}
            asset={selectedAsset}
            onAssetChange={(assetName) => {
              // 如果是字符串，需要创建一个新的资产对象
              if (assetName) {
                // 尝试在我的资产中查找
                const myAsset = myAssets.find(a => a.currency === assetName);
                if (myAsset) {
                  setSelectedAsset(myAsset);
                  return;
                }

                // 尝试在我发行的资产中查找
                const issuedAsset = myIssuedAssets.find(a => a.name === assetName);
                if (issuedAsset) {
                  setSelectedAsset(issuedAsset);
                  return;
                }

                // 如果都没找到，创建一个简单的资产对象
                setSelectedAsset({ currency: assetName } as any);
              } else {
                // 如果是null，直接清除选定的资产
                setSelectedAsset(null);
              }
            }}
          />
        </TabPane>
      </Tabs>

      {/* 注册资产发行商表单 */}
      <RegisterIssuerForm
        visible={issuerModalVisible}
        onCancel={() => setIssuerModalVisible(false)}
        onSubmit={submitTransaction}
        submitting={submitting}
      />

      {/* 注册资产表单 */}
      <RegisterAssetForm
        visible={assetModalVisible}
        onCancel={() => setAssetModalVisible(false)}
        onSubmit={submitTransaction}
        submitting={submitting}
        issuer={issuer}
      />

      {/* 发行资产表单 */}
      <IssueAssetForm
        visible={issueModalVisible}
        onCancel={() => setIssueModalVisible(false)}
        onSubmit={submitTransaction}
        submitting={submitting}
        asset={selectedAsset}
      />

      {/* 转账资产表单 */}
      <TransferAssetForm
        visible={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onSubmit={submitTransaction}
        submitting={submitting}
        asset={selectedAsset}
      />
    </div>
  );
};

export default AssetsPage;
