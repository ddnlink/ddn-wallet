import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Tabs, Tag, Space } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useIntl, useRequest, useModel } from '@umijs/max';
import { queryMultiSignatureAccounts, createMultiSignatureAccount, signTransaction } from '@/services/api';
import styles from './index.less';

const { TabPane } = Tabs;

const MultiPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [keysgroup, setKeysgroup] = useState<string[]>([]);
  const [keyInput, setKeyInput] = useState('');
  
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  
  // 获取多重签名账户列表
  const { data: accountsData, loading, run: fetchAccounts } = useRequest(
    () => queryMultiSignatureAccounts({ publicKey: initialState?.currentUser?.publicKey || '' }),
    {
      ready: !!initialState?.currentUser?.publicKey,
      onSuccess: (result) => {
        if (result && result.success) {
          // 处理多重签名账户数据
        }
      },
    }
  );
  
  // 处理创建多重签名账户
  const handleCreateAccount = async (values: any) => {
    try {
      // 这里应该调用 DDN SDK 创建多重签名账户
      // 为了演示，我们直接调用 API
      const response = await createMultiSignatureAccount({
        min: values.min,
        lifetime: values.lifetime,
        keysgroup: keysgroup.map(key => `+${key}`),
        secret: 'your secret', // 这里应该从安全的地方获取
      });
      
      if (response && response.success) {
        message.success(intl.formatMessage({ id: 'pages.multi.success' }));
        setVisible(false);
        form.resetFields();
        setKeysgroup([]);
        fetchAccounts();
      } else {
        message.error(response?.error || intl.formatMessage({ id: 'pages.multi.failure' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.multi.failure' }));
    }
  };
  
  // 处理签名交易
  const handleSignTransaction = async (transactionId: string) => {
    try {
      // 这里应该调用 DDN SDK 签名交易
      // 为了演示，我们直接调用 API
      const response = await signTransaction({
        transactionId,
        secret: 'your secret', // 这里应该从安全的地方获取
      });
      
      if (response && response.success) {
        message.success(intl.formatMessage({ id: 'pages.multi.success' }));
        fetchAccounts();
      } else {
        message.error(response?.error || intl.formatMessage({ id: 'pages.multi.failure' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.multi.failure' }));
    }
  };
  
  // 处理添加密钥
  const handleAddKey = () => {
    if (!keyInput) {
      message.warning('请输入公钥');
      return;
    }
    
    if (keysgroup.includes(keyInput)) {
      message.warning('该公钥已添加');
      return;
    }
    
    setKeysgroup([...keysgroup, keyInput]);
    setKeyInput('');
  };
  
  // 处理删除密钥
  const handleRemoveKey = (key: string) => {
    setKeysgroup(keysgroup.filter(k => k !== key));
  };
  
  // 处理表单提交
  const handleSubmit = (values: any) => {
    if (keysgroup.length === 0) {
      message.warning('请至少添加一个公钥');
      return;
    }
    
    handleCreateAccount(values);
  };
  
  // 多重签名账户表格列定义
  const accountsColumns = [
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
      title: intl.formatMessage({ id: 'pages.multi.min' }),
      dataIndex: 'min',
      key: 'min',
    },
    {
      title: intl.formatMessage({ id: 'pages.multi.lifetime' }),
      dataIndex: 'lifetime',
      key: 'lifetime',
    },
    {
      title: intl.formatMessage({ id: 'pages.multi.keysgroup' }),
      dataIndex: 'keysgroup',
      key: 'keysgroup',
      render: (text: string[]) => (
        <div className={styles.keysgroup}>
          {text.map((key, index) => (
            <Tag key={index}>{key.replace('+', '')}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <Button onClick={() => handleSignTransaction(record.transactionId)}>
            签名
          </Button>
        </Space>
      ),
    },
  ];
  
  // 待处理交易表格列定义
  const pendingColumns = [
    {
      title: intl.formatMessage({ id: 'pages.home.trans.id' }),
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <a href="#" target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.type' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.senderId' }),
      dataIndex: 'senderId',
      key: 'senderId',
      render: (text: string) => (
        <a href="#" target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.amount' }),
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `${text / 100000000} DDN`,
    },
    {
      title: '已签名/总数',
      dataIndex: 'signatures',
      key: 'signatures',
      render: (text: string[], record: any) => `${text.length}/${record.min}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Button onClick={() => handleSignTransaction(record.id)}>
          签名
        </Button>
      ),
    },
  ];
  
  return (
    <div className={styles.multiPage}>
      <Card
        title={intl.formatMessage({ id: 'pages.multi.title' })}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            {intl.formatMessage({ id: 'pages.multi.create' })}
          </Button>
        }
        variant='borderless'
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab="多重签名账户"
            key="1"
          >
            <Table
              loading={loading}
              dataSource={accountsData?.data?.accounts || []}
              columns={accountsColumns}
              rowKey="address"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab="待处理交易"
            key="2"
          >
            <Table
              loading={loading}
              dataSource={[]} // 这里应该是待处理的交易列表
              columns={pendingColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      <Modal
        title={intl.formatMessage({ id: 'pages.multi.create' })}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setKeysgroup([]);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="min"
            label={intl.formatMessage({ id: 'pages.multi.min' })}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={2} max={16} />
          </Form.Item>
          <Form.Item
            name="lifetime"
            label={intl.formatMessage({ id: 'pages.multi.lifetime' })}
            rules={[{ required: true }]}
            initialValue={24}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={72} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.multi.keysgroup' })}
          >
            <div className={styles.keysgroupInput}>
              <Input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="请输入公钥"
              />
              <Button type="primary" onClick={handleAddKey}>
                {intl.formatMessage({ id: 'pages.multi.add' })}
              </Button>
            </div>
            <div className={styles.keysgroupList}>
              {keysgroup.map((key, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveKey(key)}
                >
                  {key}
                </Tag>
              ))}
            </div>
          </Form.Item>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'pages.multi.submit' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MultiPage;
