import React, { useState } from 'react';
import { Card, List, Button, Modal, Form, Input, Select, message, Avatar, Tag, Space } from 'antd';
import { PlusOutlined, AppstoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from './index.less';

const { Option } = Select;

interface DappItem {
  id: string;
  name: string;
  description: string;
  category: number;
  tags: string[];
  icon: string;
  link: string;
}

const DappPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dapps, setDapps] = useState<DappItem[]>([
    {
      id: '1',
      name: 'DDN Explorer',
      description: 'DDN 区块链浏览器，查看区块、交易、账户等信息。',
      category: 1,
      tags: ['区块链', '浏览器'],
      icon: 'https://ddn.link/logo.png',
      link: 'https://explorer.ddn.link',
    },
    {
      id: '2',
      name: 'DDN Docs',
      description: 'DDN 开发文档，包含 API 文档、SDK 使用指南等。',
      category: 2,
      tags: ['文档', '开发'],
      icon: 'https://ddn.link/logo.png',
      link: 'https://docs.ddn.link',
    },
  ]);
  
  const intl = useIntl();
  
  // 处理安装应用
  const handleInstallDapp = async (values: any) => {
    try {
      setLoading(true);
      
      // 这里应该调用 DDN SDK 安装应用
      // 为了演示，我们直接添加到本地状态
      
      const newDapp: DappItem = {
        id: Date.now().toString(),
        name: values.name,
        description: values.description,
        category: values.category,
        tags: values.tags,
        icon: values.icon || 'https://ddn.link/logo.png',
        link: values.link,
      };
      
      setDapps([...dapps, newDapp]);
      
      message.success(intl.formatMessage({ id: 'pages.dapp.success' }));
      setVisible(false);
      form.resetFields();
      
      setLoading(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.dapp.failure' }));
      setLoading(false);
    }
  };
  
  // 处理卸载应用
  const handleUninstallDapp = (id: string) => {
    try {
      // 这里应该调用 DDN SDK 卸载应用
      // 为了演示，我们直接从本地状态移除
      
      setDapps(dapps.filter(dapp => dapp.id !== id));
      
      message.success(intl.formatMessage({ id: 'pages.dapp.success' }));
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.dapp.failure' }));
    }
  };
  
  // 处理打开应用
  const handleOpenDapp = (link: string) => {
    window.open(link, '_blank');
  };
  
  // 获取分类名称
  const getCategoryName = (category: number) => {
    switch (category) {
      case 1:
        return '工具';
      case 2:
        return '文档';
      case 3:
        return '游戏';
      case 4:
        return '社交';
      case 5:
        return '金融';
      default:
        return '其他';
    }
  };
  
  return (
    <div className={styles.dappPage}>
      <Card
        title={intl.formatMessage({ id: 'pages.dapp.title' })}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            {intl.formatMessage({ id: 'pages.dapp.install' })}
          </Button>
        }
        variant='borderless'
      >
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }}
          dataSource={dapps}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <div className={styles.dappCover} onClick={() => handleOpenDapp(item.link)}>
                    <Avatar size={64} src={item.icon} icon={<AppstoreOutlined />} />
                  </div>
                }
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleUninstallDapp(item.id)}
                  >
                    {intl.formatMessage({ id: 'pages.dapp.uninstall' })}
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div className={styles.dappTitle} onClick={() => handleOpenDapp(item.link)}>
                      {item.name}
                    </div>
                  }
                  description={
                    <div>
                      <div className={styles.dappDescription}>{item.description}</div>
                      <div className={styles.dappTags}>
                        <Tag color="blue">{getCategoryName(item.category)}</Tag>
                        {item.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
      
      <Modal
        title={intl.formatMessage({ id: 'pages.dapp.install' })}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleInstallDapp}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'pages.dapp.name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={intl.formatMessage({ id: 'pages.dapp.desc' })}
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category"
            label={intl.formatMessage({ id: 'pages.dapp.category' })}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={1}>工具</Option>
              <Option value={2}>文档</Option>
              <Option value={3}>游戏</Option>
              <Option value={4}>社交</Option>
              <Option value={5}>金融</Option>
              <Option value={6}>其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="tags"
            label={intl.formatMessage({ id: 'pages.dapp.tags' })}
            rules={[{ required: true }]}
          >
            <Select mode="tags" />
          </Form.Item>
          <Form.Item
            name="icon"
            label="图标 URL"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="应用链接"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {intl.formatMessage({ id: 'pages.dapp.submit' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DappPage;
