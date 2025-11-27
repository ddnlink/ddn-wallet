import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Typography } from 'antd';
import { useIntl } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';
import { putConfirmation } from '@/services/dao';
import styles from '../index.less';

const { Title } = Typography;
const { Option } = Select;

interface ConfirmationFormProps {
  contributionId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ contributionId, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  // 如果有传入贡献ID，则设置初始值
  React.useEffect(() => {
    if (contributionId) {
      form.setFieldsValue({ contribution_id: contributionId });
    }
  }, [form, contributionId]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 获取密钥
      const keyStore = getKeyStore();
      if (!keyStore || !keyStore.phaseKey) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        return;
      }

      // 添加密钥到表单数据
      const formData = {
        ...values,
        secret: keyStore.phaseKey,
      };

      // 调用API创建确认
      const confirmation = await DdnJS.dao.createConfirmation(formData);
      const response = await putConfirmation(confirmation);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.dao.confirmation.create.success' }));
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.dao.confirmation.create.failure' }));
      }
    } catch (error) {
      console.error('创建确认失败:', error);
      message.error(intl.formatMessage({ id: 'pages.dao.confirmation.create.failure' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>
        <Title level={3}>{intl.formatMessage({ id: 'pages.dao.confirmation.create.title' })}</Title>
        <p>{intl.formatMessage({ id: 'pages.dao.confirmation.create.subtitle' })}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ state: 0 }}
      >
        <Form.Item
          name="contribution_id"
          label={intl.formatMessage({ id: 'pages.dao.confirmation.contribution_id' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.confirmation.contribution_id.required' }) },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.dao.confirmation.contribution_id.placeholder' })}
            disabled={!!contributionId}
          />
        </Form.Item>

        <Form.Item
          name="url"
          label={intl.formatMessage({ id: 'pages.dao.confirmation.url' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.contribution.url.required' }) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.dao.contribution.url.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="state"
          label={intl.formatMessage({ id: 'pages.dao.confirmation.state' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.common.required' }, { field: intl.formatMessage({ id: 'pages.dao.confirmation.state' }) }) },
          ]}
        >
          <Select>
            <Option value={0}>{intl.formatMessage({ id: 'pages.dao.confirmation.state.0' })}</Option>
            <Option value={1}>{intl.formatMessage({ id: 'pages.dao.confirmation.state.1' })}</Option>
          </Select>
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

export default ConfirmationForm;
