import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Tabs, Tag, Tooltip } from 'antd';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useIntl, useRequest, useModel } from '@umijs/max';
import { queryDelegates, queryVoters } from '@/services/api';
import styles from './index.less';

const { TabPane } = Tabs;

const VotePage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedDelegates, setSelectedDelegates] = useState<string[]>([]);
  
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  
  // 获取受托人列表
  const { data: delegatesData, loading: delegatesLoading, run: fetchDelegates } = useRequest(
    () => queryDelegates({ limit: 101, offset: 0 }),
    {
      onSuccess: (result) => {
        if (result && result.success) {
          // 处理受托人数据
        }
      },
    }
  );
  
  // 获取投票人列表
  const { data: votersData, loading: votersLoading, run: fetchVoters } = useRequest(
    () => queryVoters({ publicKey: initialState?.currentUser?.publicKey || '' }),
    {
      ready: !!initialState?.currentUser?.publicKey,
      onSuccess: (result) => {
        if (result && result.success) {
          // 处理投票人数据
        }
      },
    }
  );
  
  // 处理投票
  const handleVote = async (values: any) => {
    try {
      // 这里应该调用 DDN SDK 进行投票
      // 为了演示，我们直接显示成功消息
      
      message.success(intl.formatMessage({ id: 'pages.vote.success' }));
      setVisible(false);
      form.resetFields();
      fetchDelegates();
      fetchVoters();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.vote.failure' }));
    }
  };
  
  // 处理注册受托人
  const handleRegisterDelegate = async (values: any) => {
    try {
      // 这里应该调用 DDN SDK 注册受托人
      // 为了演示，我们直接显示成功消息
      
      message.success(intl.formatMessage({ id: 'pages.vote.success' }));
      setVisible(false);
      form.resetFields();
      fetchDelegates();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.vote.failure' }));
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
      handleRegisterDelegate(values);
    } else {
      handleVote({ delegates: selectedDelegates });
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
      render: (text: any, record: any) => (
        <Button
          type={selectedDelegates.includes(record.publicKey) ? 'primary' : 'default'}
          onClick={() => handleSelectDelegate(record)}
        >
          {selectedDelegates.includes(record.publicKey) ? '已选' : '选择'}
        </Button>
      ),
    },
  ];
  
  // 投票人表格列定义
  const votersColumns = [
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
      title: intl.formatMessage({ id: 'pages.home.balance' }),
      dataIndex: 'balance',
      key: 'balance',
      render: (text: number) => `${text / 100000000} DDN`,
      sorter: (a: any, b: any) => a.balance - b.balance,
    },
  ];
  
  return (
    <div className={styles.votePage}>
      <Card
        title={intl.formatMessage({ id: 'pages.vote.title' })}
        extra={
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setVisible(true)}
              style={{ marginRight: 16 }}
            >
              {intl.formatMessage({ id: 'pages.vote.register' })}
            </Button>
            <Button
              type="primary"
              disabled={selectedDelegates.length === 0}
              onClick={() => handleVote({ delegates: selectedDelegates })}
            >
              {intl.formatMessage({ id: 'pages.vote.vote' })}
              {selectedDelegates.length > 0 && ` (${selectedDelegates.length})`}
            </Button>
          </div>
        }
        variant='borderless'
      >
        <Tabs defaultActiveKey="1">
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
                    const delegate = delegatesData?.data?.delegates?.find(
                      (d: any) => d.publicKey === key
                    );
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
              dataSource={delegatesData?.data?.delegates || []}
              columns={delegatesColumns}
              rowKey="publicKey"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab="我的投票"
            key="2"
          >
            <Table
              loading={votersLoading}
              dataSource={votersData?.data?.accounts || []}
              columns={votersColumns}
              rowKey="address"
              pagination={{ pageSize: 10 }}
            />
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
                {intl.formatMessage({ id: 'pages.assets.submit' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VotePage;
