import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Tabs, Tag, Tooltip, Spin, Alert, Row, Col, Progress, Statistic, Divider } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, TeamOutlined, BarChartOutlined, RocketOutlined } from '@ant-design/icons';
import { useIntl, useRequest, useModel } from '@umijs/max';
import DdnJS from '@ddn/js-sdk'
import { queryDelegates, queryVotes, postTransaction } from '@/services/api';
import { getKeyStore } from '@/utils/authority';
import styles from './index.less';

const { TabPane } = Tabs;

const VotePage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedDelegates, setSelectedDelegates] = useState<string[]>([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'vote' | 'register'>('vote');
  const [delegateUsername, setDelegateUsername] = useState('');
  const [isUserDelegate, setIsUserDelegate] = useState(false);
  const [votedDelegates, setVotedDelegates] = useState<string[]>([]);
  const [activeTabKey, setActiveTabKey] = useState('1');

  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  // 获取受托人列表
  const { data: delegatesData, loading: delegatesLoading, run: fetchDelegates } = useRequest(
    () => queryDelegates({ limit: 101, offset: 0 }),
    {
      onSuccess: (result) => {
        if (result && result.success) {
          // 处理受托人数据
          // 检查当前用户是否已经是受托人
          if (initialState?.currentUser?.publicKey && 'delegates' in result) {
            const delegates = result.delegates as API.DelegateInfo[];
            const isDelegate = delegates.some(
              (delegate: any) => delegate.publicKey === initialState.currentUser?.publicKey
            );
            if (isDelegate) {
              const delegate = delegates.find(
                (d: any) => d.publicKey === initialState.currentUser?.publicKey
              );
              if (delegate) {
                setDelegateUsername(delegate.username);
                setIsUserDelegate(true);
              }
            }
          }
        }
      },
    }
  );

  // 获取当前用户的投票列表
  const { loading: votesLoading, run: fetchVotes } = useRequest(
    () => queryVotes({ address: initialState?.currentUser?.address || '' }),
    {
      ready: !!initialState?.currentUser?.address,
      onSuccess: (result) => {
        console.log('我的投票列表: ', result);
        if (result && result.success && 'delegates' in result) {
          // 提取所有已投票受托人的 publicKey
          const votedPublicKeys = (result.delegates as API.DelegateInfo[]).map((delegate: any) => delegate.publicKey);
          console.log('已投票的受托人 publicKey: ', votedPublicKeys);
          setVotedDelegates(votedPublicKeys);
        }
      },
    }
  );

  // 打开密码输入框
  const openPasswordModal = (type: 'vote' | 'register') => {
    setActionType(type);
    setPasswordVisible(true);
  };

  // 处理投票
  const handleVote = async () => {
    try {
      setLoading(true);
      const keyStore = getKeyStore();
      if (!keyStore) {
        message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
        setLoading(false);
        return;
      }

      // 验证密钥是否合法
      const secret = password || keyStore.phaseKey;
      const keyPair = DdnJS.crypto.getKeys(secret);
      const address = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');

      // 验证地址是否与当前用户地址匹配
      if (address !== initialState?.currentUser?.address) {
        message.error(intl.formatMessage({ id: 'pages.transfer.invalid-key' }));
        setLoading(false);
        return;
      }

      // 构造投票数据，为每个公钥添加 + 前缀
      const delegates = selectedDelegates.map(publicKey => `+${publicKey}`);

      // 创建投票交易
      const transaction = await DdnJS.vote?.createVote(delegates, secret);

      // 提交交易
      const result = await postTransaction({ transaction });

      if (result.success) {
        message.success(intl.formatMessage({ id: 'pages.vote.success' }));
        // 更新已投票的受托人列表
        const newVotedDelegates = [...votedDelegates, ...selectedDelegates];
        setVotedDelegates(newVotedDelegates);
        setSelectedDelegates([]);
        setPasswordVisible(false);
        setPassword('');
        fetchDelegates();
        fetchVotes();
        // 切换到“我的投票”标签页
        setActiveTabKey('2');
      } else {
        message.error(result.error || intl.formatMessage({ id: 'pages.vote.failure' }));
      }
    } catch (error) {
      console.error('Vote error:', error);
      message.error(intl.formatMessage({ id: 'pages.vote.failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 处理注册受托人
  const handleRegisterDelegate = async () => {
    try {
      setLoading(true);
      const keyStore = getKeyStore();
      if (!keyStore) {
        message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
        setLoading(false);
        return;
      }

      // 验证密钥是否合法
      const secret = password || keyStore.phaseKey;
      const keyPair = DdnJS.crypto.getKeys(secret);
      const address = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');

      // 验证地址是否与当前用户地址匹配
      if (address !== initialState?.currentUser?.address) {
        message.error(intl.formatMessage({ id: 'pages.transfer.invalid-key' }));
        setLoading(false);
        return;
      }

      // 创建受托人注册交易
      const transaction = await DdnJS.delegate?.createDelegate(delegateUsername, secret);

      // 提交交易
      const result = await postTransaction({ transaction });

      if (result.success) {
        message.success(intl.formatMessage({ id: 'pages.vote.register-success' }));
        setVisible(false);
        setPasswordVisible(false);
        setPassword('');
        form.resetFields();
        setIsUserDelegate(true);
        fetchDelegates();
      } else {
        message.error(result.error || intl.formatMessage({ id: 'pages.vote.register-failure' }));
      }
    } catch (error) {
      console.error('Register delegate error:', error);
      message.error(intl.formatMessage({ id: 'pages.vote.register-failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 处理选择受托人
  const handleSelectDelegate = (delegate: any) => {
    const publicKey = delegate.publicKey;
    if (selectedDelegates.includes(publicKey)) {
      setSelectedDelegates(selectedDelegates.filter(key => key !== publicKey));
    } else {
      if (selectedDelegates.length < 33) {
        setSelectedDelegates([...selectedDelegates, publicKey]);
      } else {
        message.warning('最多只能选择33个受托人');
      }
    }
  };

  // 处理表单提交
  const handleSubmit = (values: any) => {
    if (values.username) {
      setDelegateUsername(values.username);
      openPasswordModal('register');
    }
  };

  // 处理密码提交
  const handlePasswordSubmit = () => {
    if (actionType === 'vote') {
      handleVote();
    } else if (actionType === 'register') {
      handleRegisterDelegate();
    }
  };

  // 受托人表格列定义
  const delegatesColumns = [
    {
      title: intl.formatMessage({ id: 'pages.vote.username' }),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: intl.formatMessage({ id: 'pages.vote.address' }),
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <a href="#" target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.vote.rate' }),
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a: any, b: any) => a.rate - b.rate,
    },
    {
      title: intl.formatMessage({ id: 'pages.vote.approval' }),
      dataIndex: 'approval',
      key: 'approval',
      render: (text: number) => `${text.toFixed(2)}%`,
      sorter: (a: any, b: any) => a.approval - b.approval,
    },
    {
      title: intl.formatMessage({ id: 'pages.vote.productivity' }),
      dataIndex: 'productivity',
      key: 'productivity',
      render: (text: number) => `${text.toFixed(2)}%`,
      sorter: (a: any, b: any) => a.productivity - b.productivity,
    },
    {
      title: intl.formatMessage({ id: 'pages.vote.forged' }),
      dataIndex: 'producedblocks',
      key: 'producedblocks',
      sorter: (a: any, b: any) => a.producedblocks - b.producedblocks,
    },
    {
      title: intl.formatMessage({ id: 'pages.vote.missed' }),
      dataIndex: 'missedblocks',
      key: 'missedblocks',
      sorter: (a: any, b: any) => a.missedblocks - b.missedblocks,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => {
        // 判断是否已投票
        const isVoted = votedDelegates.includes(record.publicKey);
        // 判断是否已选择
        const isSelected = selectedDelegates.includes(record.publicKey);

        return (
          <Button
            type={isVoted ? 'primary' : (isSelected ? 'primary' : 'default')}
            onClick={() => !isVoted && handleSelectDelegate(record)}
            disabled={isVoted}
          >
            {isVoted ? '已投票' : (isSelected ? '已选' : '选择')}
          </Button>
        );
      },
    },
  ];



  // 计算投票统计信息
  const maxVotes = 33; // 最大可投票数量
  const votedCount = votedDelegates.length;
  const votedPercentage = Math.round((votedCount / maxVotes) * 100);

  return (
    <div className={styles.votePage}>
      {/* 科技感头部装饰 */}
      <div className={styles.headerDecoration}>
        <div className={styles.headerContent}>
          <h1><RocketOutlined /> {intl.formatMessage({ id: 'pages.vote.title' })}</h1>
          <p>{intl.formatMessage({ id: 'pages.vote.subtitle' })}</p>
          {isUserDelegate && (
            <div className={styles.delegateStatus}>
              <CheckCircleOutlined /> {intl.formatMessage({ id: 'pages.vote.you-are-delegate' }, { username: delegateUsername })}
            </div>
          )}
        </div>
      </div>

      {/* 投票统计信息 */}
      <Card className={styles.statsCard}>
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Statistic
              title={intl.formatMessage({ id: 'pages.vote.voted-delegates' })}
              value={votedCount}
              suffix={`/ ${maxVotes}`}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title={intl.formatMessage({ id: 'pages.vote.total-delegates' })}
              value={delegatesData && 'delegates' in delegatesData ? (delegatesData.delegates as API.DelegateInfo[]).length : 0}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title={intl.formatMessage({ id: 'pages.vote.voting-power' })}
              value={votedPercentage}
              suffix="%"
              prefix={<BarChartOutlined />}
            />
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <div className={styles.progressWrapper}>
          <div className={styles.progressLabel}>
            <span>{intl.formatMessage({ id: 'pages.vote.voting-progress' })}</span>
            <span>{votedCount}/{maxVotes}</span>
          </div>
          <Progress percent={votedPercentage} status={votedPercentage === 100 ? 'success' : 'active'} />
        </div>
      </Card>

      <Card
        title={intl.formatMessage({ id: 'pages.vote.manage-votes' })}
        extra={
          <div>
            {!isUserDelegate ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setVisible(true)}
                style={{ marginRight: 16 }}
              >
                {intl.formatMessage({ id: 'pages.vote.register' })}
              </Button>
            ) : (
              <Tooltip title={intl.formatMessage({ id: 'pages.vote.already-delegate' })}>
                <Button
                  type="default"
                  icon={<CheckCircleOutlined />}
                  style={{ marginRight: 16, background: '#f6ffed', borderColor: '#b7eb8f', color: '#52c41a' }}
                  disabled
                >
                  {intl.formatMessage({ id: 'pages.vote.registered' })}
                </Button>
              </Tooltip>
            )}
            <Button
              type="primary"
              disabled={selectedDelegates.length === 0}
              onClick={() => openPasswordModal('vote')}
            >
              {intl.formatMessage({ id: 'pages.vote.vote' })}
              {selectedDelegates.length > 0 && ` (${selectedDelegates.length})`}
            </Button>
          </div>
        }
        variant='borderless'
      >
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane
            tab={intl.formatMessage({ id: 'pages.vote.delegates' })}
            key="1"
          >
            <div className={styles.selectedDelegates}>
              <div className={styles.selectedTitle}>已选受托人：</div>
              <div className={styles.selectedTags}>
                {selectedDelegates.length === 0 ? (
                  <span>未选择任何受托人</span>
                ) : (
                  selectedDelegates.map((key, index) => {
                    const delegates = delegatesData && 'delegates' in delegatesData ?
                      (delegatesData.delegates as API.DelegateInfo[]) : [];
                    const delegate = delegates.find((d: any) => d.publicKey === key);
                    return (
                      <Tag
                        key={key}
                        closable
                        onClose={() => setSelectedDelegates(selectedDelegates.filter(k => k !== key))}
                      >
                        {delegate?.username || `受托人${index + 1}`}
                      </Tag>
                    );
                  })
                )}
              </div>
            </div>
            <Table
              loading={delegatesLoading}
              dataSource={delegatesData && 'delegates' in delegatesData ?
                (delegatesData.delegates as API.DelegateInfo[]) : []}
              columns={delegatesColumns}
              rowKey="publicKey"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab="我的投票"
            key="2"
          >
            {votedDelegates.length > 0 ? (
              <Table
                loading={votesLoading || delegatesLoading}
                dataSource={delegatesData && 'delegates' in delegatesData ?
                  (delegatesData.delegates as API.DelegateInfo[]).filter(d => votedDelegates.includes(d.publicKey)) : []}
                columns={delegatesColumns.filter(col => col.key !== 'action')}
                rowKey="publicKey"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>您还没有投票给任何受托人</p>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'pages.vote.register' })}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label={intl.formatMessage({ id: 'pages.vote.username' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'pages.common.submit' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 密码输入弹窗 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.common.enter-password' })}
        open={passwordVisible}
        onCancel={() => setPasswordVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPasswordVisible(false)}>
            {intl.formatMessage({ id: 'pages.common.cancel' })}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handlePasswordSubmit}>
            {intl.formatMessage({ id: 'pages.common.confirm' })}
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Alert
            message={intl.formatMessage({
              id: actionType === 'vote'
                ? 'pages.vote.confirm-vote'
                : 'pages.vote.confirm-register'
            })}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form layout="vertical">
            <Form.Item
              label={intl.formatMessage({ id: 'pages.common.password' })}
              required
              tooltip={intl.formatMessage({ id: 'pages.common.password-tooltip' })}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={intl.formatMessage({ id: 'pages.common.password-placeholder' })}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default VotePage;
