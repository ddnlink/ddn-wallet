import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { STORAGE_KEYS } from '@/constants';
import styles from './index.less';

interface ContactItem {
  id: string;
  name: string;
  address: string;
  desc?: string;
}

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const intl = useIntl();

  // 从本地存储加载联系人
  useEffect(() => {
    const storedContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (storedContacts) {
      try {
        setContacts(JSON.parse(storedContacts));
      } catch (e) {
        console.error('Failed to parse contacts from localStorage', e);
      }
    }
  }, []);

  // 保存联系人到本地存储
  const saveContactsToStorage = (newContacts: ContactItem[]) => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(newContacts));
  };

  // 处理添加联系人
  const handleAddContact = async (values: any) => {
    try {
      setLoading(true);

      const newContact: ContactItem = {
        id: Date.now().toString(),
        name: values.name,
        address: values.address,
        desc: values.desc,
      };

      const newContacts = [...contacts, newContact];
      setContacts(newContacts);
      saveContactsToStorage(newContacts);

      message.success(intl.formatMessage({ id: 'pages.contact.success' }));
      setVisible(false);
      form.resetFields();

      setLoading(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.contact.failure' }));
      setLoading(false);
    }
  };

  // 处理编辑联系人
  const handleEditContact = async (values: any) => {
    try {
      setLoading(true);

      if (!editingContact) {
        throw new Error('No contact is being edited');
      }

      const updatedContact: ContactItem = {
        ...editingContact,
        name: values.name,
        address: values.address,
        desc: values.desc,
      };

      const newContacts = contacts.map(contact =>
        contact.id === editingContact.id ? updatedContact : contact
      );

      setContacts(newContacts);
      saveContactsToStorage(newContacts);

      message.success(intl.formatMessage({ id: 'pages.contact.success' }));
      setVisible(false);
      setEditingContact(null);
      form.resetFields();

      setLoading(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.contact.failure' }));
      setLoading(false);
    }
  };

  // 处理删除联系人
  const handleDeleteContact = (id: string) => {
    try {
      const newContacts = contacts.filter(contact => contact.id !== id);
      setContacts(newContacts);
      saveContactsToStorage(newContacts);

      message.success(intl.formatMessage({ id: 'pages.contact.success' }));
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pages.contact.failure' }));
    }
  };

  // 打开编辑模态框
  const showEditModal = (contact: ContactItem) => {
    setEditingContact(contact);
    form.setFieldsValue({
      name: contact.name,
      address: contact.address,
      desc: contact.desc,
    });
    setVisible(true);
  };

  // 处理表单提交
  const handleSubmit = (values: any) => {
    if (editingContact) {
      handleEditContact(values);
    } else {
      handleAddContact(values);
    }
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingContact(null);
    form.resetFields();
  };

  // 联系人表格列定义
  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.contact.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'pages.contact.address' }),
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <a href="#" target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.contact.desc' }),
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: ContactItem) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            {intl.formatMessage({ id: 'pages.contact.edit' })}
          </Button>
          <Popconfirm
            title="确定要删除这个联系人吗？"
            onConfirm={() => handleDeleteContact(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            >
              {intl.formatMessage({ id: 'pages.contact.delete' })}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.contactPage}>
      <Card
        title={intl.formatMessage({ id: 'pages.contact.title' })}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            {intl.formatMessage({ id: 'pages.contact.add' })}
          </Button>
        }
        variant='borderless'
      >
        <Table
          dataSource={contacts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={
          editingContact
            ? intl.formatMessage({ id: 'pages.contact.edit' })
            : intl.formatMessage({ id: 'pages.contact.add' })
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'pages.contact.name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label={intl.formatMessage({ id: 'pages.contact.address' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desc"
            label={intl.formatMessage({ id: 'pages.contact.desc' })}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <div className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {intl.formatMessage({ id: 'pages.contact.submit' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactPage;
