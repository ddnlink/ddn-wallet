import React from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, Alert } from 'antd';
import { useIntl } from 'umi';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';

interface RegisterAssetFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (transaction: any) => void;
  submitting: boolean;
  issuer: any;
}

const RegisterAssetForm: React.FC<RegisterAssetFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  submitting,
  issuer,
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const keystore = getKeyStore();
      const { phaseKey } = keystore;

      // 计算精度和最大发行量
      const precision = Number(values.precision);
      let multi = 1;
      for (let i = 0; i < precision; i += 1) {
        multi *= 10;
      }
      const maximum = parseInt(values.maximum * multi, 10).toString();

      // 构造资产名称
      const name = `${issuer.name}.${values.name}`;

      // 构造交易数据
      const transaction = await DdnJS.aob.createAsset(
        name,
        values.description,
        maximum,
        precision,
        values.strategy || '',
        values.allowBlacklist ? '1' : '0',
        values.allowWhitelist ? '1' : '0',
        values.allowWriteoff ? '1' : '0',
        phaseKey
      );

      onSubmit(transaction);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'pages.assets.register' })}
      visible={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {intl.formatMessage({ id: 'pages.common.cancel' })}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          {intl.formatMessage({ id: 'pages.common.submit' })}
        </Button>,
      ]}
    >
      <Alert
        message={intl.formatMessage({ id: 'pages.assets.register.fee.notice' })}
        description={intl.formatMessage({ id: 'pages.assets.register.fee.description' }, { fee: '500 DDN' })}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        name="register_asset_form"
        initialValues={{
          precision: 3,
          allowBlacklist: false,
          allowWhitelist: false,
          allowWriteoff: false,
        }}
      >
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'pages.assets.name' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.name.required' }),
            },
            {
              pattern: /^[A-Za-z0-9]{3,16}$/,
              message: intl.formatMessage({ id: 'pages.assets.name.format' }),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label={intl.formatMessage({ id: 'pages.assets.description' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.description.required' }),
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="maximum"
          label={intl.formatMessage({ id: 'pages.assets.maximum' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.maximum.required' }),
            },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="precision"
          label={intl.formatMessage({ id: 'pages.assets.precision' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.precision.required' }),
            },
          ]}
        >
          <InputNumber min={0} max={16} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="strategy"
          label={intl.formatMessage({ id: 'pages.assets.strategy' })}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="allowBlacklist"
          valuePropName="checked"
          label={intl.formatMessage({ id: 'pages.assets.allowBlacklist' })}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="allowWhitelist"
          valuePropName="checked"
          label={intl.formatMessage({ id: 'pages.assets.allowWhitelist' })}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="allowWriteoff"
          valuePropName="checked"
          label={intl.formatMessage({ id: 'pages.assets.allowWriteoff' })}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterAssetForm;
