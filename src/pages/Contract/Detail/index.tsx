import React, { useState } from 'react';
import { Card, Tabs, Descriptions, Button, Typography, Spin, message, Tag, Space, Tooltip, Table, Divider, Drawer, Badge } from 'antd';
import { CodeOutlined, ApiOutlined, FileTextOutlined, TransactionOutlined, HistoryOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useIntl, history, useParams, useRequest } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { getContract, getContractCode, getContractMeta, getContractResult, getContractTransfers } from '@/services/contract';
import { formatAddress, formatTime, formatAmount } from '@/utils/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './index.less';

const { Text } = Typography;
const { TabPane } = Tabs;

const ContractDetail: React.FC = () => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>('info');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<any>(null);

  // 获取合约基本信息
  const { data: contractInfo, loading: infoLoading } = useRequest(
    async () => {
      try {
        const response = await getContract({ id: id as string });
        console.log('Contract info response:', response);
        if (response.success) {
          return response.contract;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch contract info:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [id],
    }
  );

  // 获取合约代码
  const { data: contractCode, loading: codeLoading } = useRequest(
    async () => {
      if (activeTab !== 'code') return null;
      try {
        const response = await getContractCode({ id: id as string });
        console.log('Contract code response:', response);
        if (response.success) {
          return response.code;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch contract code:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [id, activeTab],
    }
  );

  // 获取合约元数据
  const { data: contractMeta, loading: metaLoading } = useRequest(
    async () => {
      if (activeTab !== 'meta') return null;
      try {
        const response = await getContractMeta({ id: id as string });
        console.log('Contract metadata response:', response);
        if (response.success) {
          // API 返回的是 metadata 字段，需要解析 JSON 字符串
          if (response.metadata) {
            try {
              return JSON.parse(response.metadata);
            } catch (e) {
              console.error('Failed to parse contract metadata:', e);
              return response.metadata; // 如果解析失败，返回原始字符串
            }
          }
          return response.meta || null;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch contract meta:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return null;
      }
    },
    {
      refreshDeps: [id, activeTab],
    }
  );

  // 获取合约执行结果
  const { data: contractResults, loading: resultsLoading } = useRequest(
    async () => {
      if (activeTab !== 'results') return { rows: [], count: 0 };
      try {
        // 由于API需要transactionId参数，这里我们传递id作为合约id
        const response = await getContractResult({ id: id as string });
        console.log('Contract results response:', response);
        if (response.success) {
          return {
            rows: response.rows || [],
            count: response.count || 0,
          };
        }
        return { rows: [], count: 0 };
      } catch (error) {
        console.error('Failed to fetch contract results:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { rows: [], count: 0 };
      }
    },
    {
      refreshDeps: [id, activeTab],
    }
  );

  // 获取合约转账记录
  const { data: contractTransfers, loading: transfersLoading } = useRequest(
    async () => {
      if (activeTab !== 'transfers') return { rows: [], count: 0 };
      try {
        const response = await getContractTransfers({ id: id as string });
        if (response.success && response.data) {
          return {
            rows: response.data.rows || [],
            count: response.data.count || 0,
          };
        }
        return { rows: [], count: 0 };
      } catch (error) {
        console.error('Failed to fetch contract transfers:', error);
        message.error(intl.formatMessage({ id: 'pages.common.fetch.failed' }));
        return { rows: [], count: 0 };
      }
    },
    {
      refreshDeps: [id, activeTab],
    }
  );

  // 返回合约列表
  const handleBack = () => {
    history.push('/contract/list');
  };

  // 调用合约
  const handleCallContract = () => {
    history.push(`/contract/interact/${id}`);
  };

  // 渲染合约基本信息
  const renderContractInfo = () => {
    if (!contractInfo) return <Spin />;

    return (
      <Descriptions bordered column={1} className={styles.descriptions}>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.id' })}>
          <Text copyable>{contractInfo.id}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.name' })}>
          {contractInfo.name}
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.type' })}>
          <Tag color="blue">{contractInfo.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.creator' })}>
          <Text copyable>{contractInfo.creatorId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.version' })}>
          {contractInfo.version}
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.timestamp' })}>
          {formatTime(contractInfo.timestamp)}
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.description' })}>
          {contractInfo.description || '-'}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // 渲染合约代码
  const renderContractCode = () => {
    if (codeLoading) return <Spin />;
    if (!contractCode) return <Text type="secondary">{intl.formatMessage({ id: 'pages.common.no.data' })}</Text>;

    return (
      <div className={styles.codeContainer}>
        <SyntaxHighlighter language="javascript" style={prism} showLineNumbers={true}>
          {contractCode}
        </SyntaxHighlighter>
      </div>
    );
  };

  // 渲染合约元数据
  const renderContractMeta = () => {
    if (metaLoading) return <Spin />;
    if (!contractMeta) return <Text type="secondary">{intl.formatMessage({ id: 'pages.common.no.data' })}</Text>;

    // 如果是字符串，显示原始JSON
    if (typeof contractMeta === 'string') {
      return (
        <div className={styles.metaContainer}>
          <SyntaxHighlighter language="json" style={prism} showLineNumbers={true}>
            {contractMeta}
          </SyntaxHighlighter>
        </div>
      );
    }

    // 处理新的元数据格式
    return (
      <div className={styles.metaContainer}>
        <Descriptions bordered column={1} className={styles.descriptions}>
          <Descriptions.Item label={intl.formatMessage({ id: 'pages.contract.name' })}>
            {contractMeta.className || '-'}
          </Descriptions.Item>
        </Descriptions>

        {/* 显示常量变量 */}
        {contractMeta.constVariables && contractMeta.constVariables.length > 0 && (
          <>
            <Divider orientation="left">常量变量</Divider>
            <Table
              dataSource={contractMeta.constVariables}
              rowKey="name"
              pagination={false}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type) => <Text code>{type?.text || type?.name || JSON.stringify(type)}</Text>,
                },
              ]}
            />
          </>
        )}

        {/* 显示数据接口 */}
        {contractMeta.dataInterfaces && contractMeta.dataInterfaces.length > 0 && (
          <>
            <Divider orientation="left">数据接口</Divider>
            <Table
              dataSource={contractMeta.dataInterfaces}
              rowKey="name"
              pagination={false}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '属性',
                  dataIndex: 'properties',
                  key: 'properties',
                  render: (properties) => {
                    if (!properties || properties.length === 0) return '-';
                    return (
                      <ul className={styles.paramsList}>
                        {properties.map((prop: any, index: number) => (
                          <li key={index}>
                            <Text strong>{prop.name}</Text>: <Text code>{prop.type?.text || prop.type?.name || JSON.stringify(prop.type)}</Text>
                            {prop.optional && <Tag color="blue">可选</Tag>}
                          </li>
                        ))}
                      </ul>
                    );
                  },
                },
              ]}
            />
          </>
        )}

        {/* 显示自定义类型 */}
        {contractMeta.customeTypes && contractMeta.customeTypes.length > 0 && (
          <>
            <Divider orientation="left">自定义类型</Divider>
            <Table
              dataSource={contractMeta.customeTypes}
              rowKey="name"
              pagination={false}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '属性',
                  dataIndex: 'properties',
                  key: 'properties',
                  render: (properties) => {
                    if (!properties || properties.length === 0) return '-';
                    return (
                      <ul className={styles.paramsList}>
                        {properties.map((prop: any, index: number) => (
                          <li key={index}>
                            <Text strong>{prop.name}</Text>: <Text code>{prop.type?.text || prop.type?.name || JSON.stringify(prop.type)}</Text>
                            {prop.optional && <Tag color="blue">可选</Tag>}
                          </li>
                        ))}
                      </ul>
                    );
                  },
                },
              ]}
            />
          </>
        )}

        {/* 显示状态变量 */}
        {contractMeta.states && contractMeta.states.length > 0 && (
          <>
            <Divider orientation="left">状态变量</Divider>
            <Table
              dataSource={contractMeta.states}
              rowKey="name"
              pagination={false}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type) => <Text code>{type?.text || type?.name || JSON.stringify(type)}</Text>,
                },
                {
                  title: '属性',
                  key: 'attributes',
                  render: (_: any, record: any) => (
                    <Space>
                      {record.public && <Tag color="green">公开</Tag>}
                      {record.readonly && <Tag color="orange">只读</Tag>}
                    </Space>
                  ),
                },
              ]}
            />
          </>
        )}

        {/* 显示方法 */}
        {contractMeta.methods && contractMeta.methods.length > 0 && (
          <>
            <Divider orientation="left">方法</Divider>
            <Table
              dataSource={contractMeta.methods}
              rowKey="name"
              pagination={false}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '参数',
                  dataIndex: 'parameters',
                  key: 'parameters',
                  render: (parameters) => {
                    if (!parameters || parameters.length === 0) return '-';
                    return (
                      <ul className={styles.paramsList}>
                        {parameters.map((param: any, index: number) => (
                          <li key={index}>
                            <Text strong>{param.name}</Text>: <Text code>{param.type?.text || param.type?.name || JSON.stringify(param.type)}</Text>
                            {param.optional && <Tag color="blue">可选</Tag>}
                          </li>
                        ))}
                      </ul>
                    );
                  },
                },
                {
                  title: '返回类型',
                  dataIndex: 'returnType',
                  key: 'returnType',
                  render: (returnType) => returnType ? <Text code>{returnType?.text || returnType?.name || JSON.stringify(returnType)}</Text> : '-',
                },
                {
                  title: '属性',
                  key: 'attributes',
                  render: (_: any, record: any) => (
                    <Space>
                      {record.public && <Tag color="green">公开</Tag>}
                      {record.isConstructor && <Tag color="purple">构造函数</Tag>}
                      {record.payable && <Tag color="gold">可支付</Tag>}
                      {record.constant && <Tag color="cyan">常量</Tag>}
                      {record.defaultPayable && <Tag color="magenta">默认支付</Tag>}
                    </Space>
                  ),
                },
              ]}
            />
          </>
        )}
      </div>
    );
  };

  // 处理查看详情
  const handleViewDetail = (record: any) => {
    setCurrentResult(record);
    setDrawerVisible(true);
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  // 渲染合约执行结果
  const renderContractResults = () => {
    if (resultsLoading) return <Spin />;
    if (!contractResults || contractResults.rows.length === 0) {
      return <Text type="secondary">{intl.formatMessage({ id: 'pages.common.no.data' })}</Text>;
    }

    const columns = [
      {
        title: intl.formatMessage({ id: 'pages.home.trans.id' }),
        dataIndex: 'transaction_id',
        key: 'transaction_id',
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <Text copyable={{ text }}>{formatAddress(text, 8, 8)}</Text>
          </Tooltip>
        ),
      },
      {
        title: '合约接口',
        dataIndex: 'interface',
        key: 'interface',
        render: (text: string) => text || '-',
      },
      {
        title: 'Gas 消耗',
        dataIndex: 'gas',
        key: 'gas',
        render: (gas: number) => gas || '-',
      },
      {
        title: intl.formatMessage({ id: 'pages.common.status' }),
        dataIndex: 'success',
        key: 'success',
        render: (success: boolean) => (
          <Badge
            status={success ? 'success' : 'error'}
            text={
              <Space>
                {success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                {success ? intl.formatMessage({ id: 'pages.common.success' }) : intl.formatMessage({ id: 'pages.common.failure' })}
              </Space>
            }
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: any) => (
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
        ),
      },
    ];

    return (
      <>
        <Table
          dataSource={contractResults.rows}
          columns={columns}
          rowKey="transaction_id"
          pagination={{
            total: contractResults.count,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `${intl.formatMessage({ id: 'pages.common.total' })} ${total} ${intl.formatMessage({ id: 'pages.common.items' })}`,
          }}
          onRow={(record) => ({
            onClick: () => handleViewDetail(record),
            style: { cursor: 'pointer' }
          })}
        />

        <Drawer
          title="合约执行结果详情"
          placement="right"
          width={600}
          onClose={handleCloseDrawer}
          open={drawerVisible}
          extra={
            <Space>
              <Button onClick={handleCloseDrawer}>关闭</Button>
            </Space>
          }
        >
          {currentResult && (
            <div className={styles.resultDetailContainer}>
              <Descriptions bordered column={1} className={styles.descriptions}>
                <Descriptions.Item label="交易ID">
                  <Text copyable>{currentResult.transaction_id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="合约ID">
                  <Text copyable>{currentResult.contract_id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="接口">
                  {currentResult.interface || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Badge
                    status={currentResult.success ? 'success' : 'error'}
                    text={currentResult.success ? '成功' : '失败'}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Gas 消耗">
                  {currentResult.gas || '-'}
                </Descriptions.Item>
                {currentResult.error && (
                  <Descriptions.Item label="错误信息">
                    <div className={styles.errorMessage}>
                      {currentResult.error}
                    </div>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="状态变更哈希">
                  {currentResult.stateChangesHash ? (
                    <Text copyable>{currentResult.stateChangesHash}</Text>
                  ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="数据">
                  <div className={styles.dataContainer}>
                    <SyntaxHighlighter language="json" style={prism} showLineNumbers={true}>
                      {typeof currentResult.data === 'string'
                        ? currentResult.data
                        : JSON.stringify(currentResult.data, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Drawer>
      </>
    );
  };

  // 渲染合约转账记录
  const renderContractTransfers = () => {
    if (transfersLoading) return <Spin />;
    if (!contractTransfers || contractTransfers.rows.length === 0) {
      return <Text type="secondary">{intl.formatMessage({ id: 'pages.common.no.data' })}</Text>;
    }

    const columns = [
      {
        title: intl.formatMessage({ id: 'pages.home.trans.id' }),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <Text copyable={{ text }}>{formatAddress(text, 8, 8)}</Text>
          </Tooltip>
        ),
      },
      {
        title: intl.formatMessage({ id: 'pages.home.trans.senderId' }),
        dataIndex: 'senderId',
        key: 'senderId',
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <Text copyable={{ text }}>{formatAddress(text, 8, 8)}</Text>
          </Tooltip>
        ),
      },
      {
        title: intl.formatMessage({ id: 'pages.home.trans.recipientId' }),
        dataIndex: 'recipientId',
        key: 'recipientId',
        ellipsis: true,
        render: (text: string) => (
          <Tooltip title={text}>
            <Text copyable={{ text }}>{formatAddress(text, 8, 8)}</Text>
          </Tooltip>
        ),
      },
      {
        title: intl.formatMessage({ id: 'pages.home.trans.amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: number) => formatAmount(amount),
      },
      {
        title: intl.formatMessage({ id: 'pages.home.trans.height' }),
        dataIndex: 'height',
        key: 'height',
      },
      {
        title: intl.formatMessage({ id: 'pages.home.trans.timestamp' }),
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (timestamp: number) => formatTime(timestamp),
      },
    ];

    return (
      <Table
        dataSource={contractTransfers.rows}
        columns={columns}
        rowKey="id"
        pagination={{
          total: contractTransfers.count,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `${intl.formatMessage({ id: 'pages.common.total' })} ${total} ${intl.formatMessage({ id: 'pages.common.items' })}`,
        }}
      />
    );
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.contract.detail' }),
        subTitle: contractInfo?.name,
        onBack: handleBack,
        extra: [
          <Button
            key="call"
            type="primary"
            icon={<ApiOutlined />}
            onClick={handleCallContract}
          >
            {intl.formatMessage({ id: 'pages.contract.call' })}
          </Button>,
        ],
      }}
      loading={infoLoading}
    >
      <div className={styles.container}>
        <Card className={styles.detailCard}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  {intl.formatMessage({ id: 'pages.contract.info' })}
                </span>
              }
              key="info"
            >
              {renderContractInfo()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CodeOutlined />
                  {intl.formatMessage({ id: 'pages.contract.code' })}
                </span>
              }
              key="code"
            >
              {renderContractCode()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  {intl.formatMessage({ id: 'pages.contract.meta' })}
                </span>
              }
              key="meta"
            >
              {renderContractMeta()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HistoryOutlined />
                  {intl.formatMessage({ id: 'pages.contract.result' })}
                </span>
              }
              key="results"
            >
              {renderContractResults()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <TransactionOutlined />
                  {intl.formatMessage({ id: 'pages.contract.transfers' })}
                </span>
              }
              key="transfers"
            >
              {renderContractTransfers()}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ContractDetail;
