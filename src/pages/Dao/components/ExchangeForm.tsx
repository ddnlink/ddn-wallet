import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, message, Typography } from 'antd';
import { useIntl } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';
import { putExchange } from '@/services/dao';
import styles from '../index.less';

const { Title } = Typography;

interface ExchangeFormProps {
  orgId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ExchangeForm: React.FC<ExchangeFormProps> = ({ orgId, onSuccess, onCancel }) => {
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

      // 将价格转换为整数（以聪为单位）
      const priceInSatoshi = Math.floor(values.price * 100000000);

      // 添加密钥到表单数据
      const formData = {
        org_id: values.org_id,
        price: priceInSatoshi.toString(),
        received_address: values.received_address,
        secret: keyStore.phaseKey,
      };

      // 调用API创建交易
      const exchange = await DdnJS.dao.createExchange(formData);
      const response = await putExchange(exchange);

      if (response.success) {
        message.success(intl.formatMessage({ id: 'pages.dao.exchange.create.success' }));
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.dao.exchange.create.failure' }));
      }
    } catch (error) {
      console.error('创建交易失败:', error);
      message.error(intl.formatMessage({ id: 'pages.dao.exchange.create.failure' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>
        <Title level={3}>{intl.formatMessage({ id: 'pages.dao.exchange.create.title' })}</Title>
        <p>{intl.formatMessage({ id: 'pages.dao.exchange.create.subtitle' })}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="org_id"
          label={intl.formatMessage({ id: 'pages.dao.exchange.org_id' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.exchange.org_id.required' }) },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'pages.dao.exchange.org_id.placeholder' })}
            disabled={!!orgId}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label={intl.formatMessage({ id: 'pages.dao.exchange.price' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.exchange.price.required' }) },
          ]}
        >
          <InputNumber
            placeholder={intl.formatMessage({ id: 'pages.dao.exchange.price.placeholder' })}
            min={0}
            step={0.00000001}
            precision={8}
            style={{ width: '100%' }}
            addonAfter="DDN"
          />
        </Form.Item>

        <Form.Item
          name="received_address"
          label={intl.formatMessage({ id: 'pages.dao.exchange.receiver' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.dao.exchange.receiver.required' }) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.dao.exchange.receiver.placeholder' })} />
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

export default ExchangeForm;
