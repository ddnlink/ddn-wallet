import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Tooltip } from 'antd';
import { useIntl } from '@umijs/max';
import { ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import DdnJS from '@ddn/js-sdk';
import { putOrg } from '@/services/dao';
import { getKeyStore } from '@/utils/authority';
import { generateOrgId, validateOrgId } from '@/utils/daoUtils';
import styles from '../index.less';

const { Title } = Typography;

interface OrgFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const OrgForm: React.FC<OrgFormProps> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  // 组件加载时自动生成一个组织ID
  useEffect(() => {
    const initialOrgId = generateOrgId();
    form.setFieldsValue({ org_id: initialOrgId });
  }, [form]);

  // 重新生成组织ID
  const handleRegenerateOrgId = () => {
    const newOrgId = generateOrgId();
    form.setFieldsValue({ org_id: newOrgId });
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Get keystore for secret
      const keyStore = getKeyStore();
      if (!keyStore || !keyStore.phaseKey) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        return;
      }

      const secret = keyStore.phaseKey;

      // 准备组织数据
      const orgData = {
        org_id: values.org_id,
        name: values.name,
        url: values.url,
        tags: values.tags,
        state: 0, // 默认为正常状态
        secret
      };

      // 创建组织交易体
      let transaction;
      try {
        // 使用 createOrg 方法创建交易体
        transaction = await DdnJS.dao.createOrg(orgData);
      } catch (error: any) {
        console.error('Failed to create organization transaction:', error);
        message.error(`Transaction Error: ${error.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // 提交交易到区块链
      const response = await putOrg(transaction);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.dao.org.create.success' }));
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.dao.org.create.failure' }));
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
      message.error(intl.formatMessage({ id: 'pages.dao.org.create.failure' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>
        <Title level={3}>{intl.formatMessage({ id: 'pages.dao.org.create.title' })}</Title>
        <p>{intl.formatMessage({ id: 'pages.dao.org.create.subtitle' })}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ state: 0 }}
      >
        <Form.Item
          name="org_id"
          label={
            <span>
              {intl.formatMessage({ id: 'pages.dao.org.id' })}
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.id.tooltip' }, { defaultMessage: '组织ID是唯一标识符，长度4-20位，只能包含字母和数字' })}>
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.org.id.required' }) },
            { min: 4, max: 20, message: intl.formatMessage({ id: 'pages.dao.org.id.format' }) },
            { validator: (_, value) => validateOrgId(value) ? Promise.resolve() : Promise.reject(new Error(intl.formatMessage({ id: 'pages.dao.org.id.format' }))) }
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.dao.org.id.placeholder' })}
            addonAfter={
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.id.regenerate' }, { defaultMessage: '重新生成组织ID' })}>
                <ReloadOutlined className={styles.regenerateIcon} onClick={handleRegenerateOrgId} />
              </Tooltip>
            }
          />
        </Form.Item>

        <Form.Item
          name="name"
          label={
            <span>
              {intl.formatMessage({ id: 'pages.dao.org.name' })}
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.name.tooltip' }, { defaultMessage: '组织名称应简洁明确，能清晰表达组织的定位和特点' })}>
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.org.name.required' }) },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.dao.org.name.placeholder' })}
            suffix={
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.name.example' }, { defaultMessage: '例如：区块链技术研究社区、Web3创新联盟、元宇宙开发者组织' })}>
                <QuestionCircleOutlined style={{ color: '#bfbfbf' }} />
              </Tooltip>
            }
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label={
            <span>
              {intl.formatMessage({ id: 'pages.dao.org.tags' })}
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.tags.tooltip' }, { defaultMessage: '标签用于分类和检索组织，多个标签用逗号分隔' })}>
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.org.tags.required' }) },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.dao.org.tags.placeholder' })}
            suffix={
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.tags.example' }, { defaultMessage: '例如：blockchain,web3,defi,dao,nft,metaverse' })}>
                <QuestionCircleOutlined style={{ color: '#bfbfbf' }} />
              </Tooltip>
            }
          />
        </Form.Item>

        <Form.Item
          name="url"
          label={
            <span>
              {intl.formatMessage({ id: 'pages.dao.org.url' })}
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.url.tooltip' }, { defaultMessage: '组织的官方网站或相关资源链接，如百科、文档、社交媒体等' })}>
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.org.url.required' }) },
            { type: 'url', message: intl.formatMessage({ id: 'pages.dao.org.url.format' }, { defaultMessage: '请输入有效的URL地址' }) },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.dao.org.url.placeholder' })}
            suffix={
              <Tooltip title={intl.formatMessage({ id: 'pages.dao.org.url.example' }, { defaultMessage: '例如：https://www.example.org, https://docs.google.com/document/d/xxx' })}>
                <QuestionCircleOutlined style={{ color: '#bfbfbf' }} />
              </Tooltip>
            }
          />
        </Form.Item>

        {/* 状态字段由系统自动设置，不需要用户输入 */}
        <Form.Item
          name="state"
          hidden
        >
          <Input type="hidden" />
        </Form.Item>

        <div className={styles.formActions}>
          <Button onClick={onCancel}>
            {intl.formatMessage({ id: 'pages.common.cancel' })}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {intl.formatMessage({ id: 'pages.common.submit' })}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default OrgForm;
