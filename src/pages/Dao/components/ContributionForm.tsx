import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, message, Typography } from 'antd';
import { useIntl } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';
import styles from '../index.less';
import { putContribution } from '@/services/dao';

const { Title } = Typography;
const { TextArea } = Input;

interface ContributionFormProps {
  orgId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ orgId, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  // 如果有传入组织ID，则设置初始值
  React.useEffect(() => {
    if (orgId) {
      form.setFieldsValue({ org_id: orgId });
    }
  }, [form, orgId]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 获取密钥
      const keyStore = getKeyStore();
      if (!keyStore || !keyStore.phaseKey) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        return;
      }

      // 将奖励转换为整数（以聪为单位）
      const priceInSatoshi = values.price ? Math.floor(values.price * 100000000) : 0;

      // 添加密钥到表单数据
      const formData = {
        ...values,
        price: priceInSatoshi.toString(),
        secret: keyStore.phaseKey,
      };

      // 调用API创建贡献
      const contribution = await DdnJS.dao.createContribution(values.org_id, formData);
      const response = await putContribution(contribution);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.dao.contribution.create.success' }));
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.dao.contribution.create.failure' }));
      }
    } catch (error) {
      console.error('创建贡献失败:', error);
      message.error(intl.formatMessage({ id: 'pages.dao.contribution.create.failure' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>
        <Title level={3}>{intl.formatMessage({ id: 'pages.dao.contribution.create.title' })}</Title>
        <p>{intl.formatMessage({ id: 'pages.dao.contribution.create.subtitle' })}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="org_id"
          label={intl.formatMessage({ id: 'pages.dao.contribution.org_id' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.contribution.org_id.required' }) },
          ]}
        >
          <Input 
            placeholder={intl.formatMessage({ id: 'pages.dao.contribution.org_id.placeholder' })}
            disabled={!!orgId}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label={intl.formatMessage({ id: 'pages.dao.contribution.title.field' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.contribution.title.required' }) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.dao.contribution.title.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="url"
          label={intl.formatMessage({ id: 'pages.dao.contribution.url' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.contribution.url.required' }) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.dao.contribution.url.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="price"
          label={intl.formatMessage({ id: 'pages.dao.contribution.price' })}
        >
          <InputNumber
            placeholder={intl.formatMessage({ id: 'pages.dao.contribution.price.placeholder' })}
            min={0}
            step={0.00000001}
            precision={8}
            style={{ width: '100%' }}
            addonAfter="DDN"
          />
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

export default ContributionForm;
