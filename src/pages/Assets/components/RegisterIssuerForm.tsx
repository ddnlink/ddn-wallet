import React from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { useIntl } from 'umi';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';

interface RegisterIssuerFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (transaction: any) => void;
  submitting: boolean;
}

const RegisterIssuerForm: React.FC<RegisterIssuerFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  submitting,
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const keystore = getKeyStore();
      const { phaseKey } = keystore;

      // 构造交易数据
      const transaction = await DdnJS.aob.createIssuer(
        values.name,
        values.description,
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
      title={intl.formatMessage({ id: 'pages.assets.issuer.register' })}
      visible={visible}
      onCancel={handleCancel}
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
        message={intl.formatMessage({ id: 'pages.assets.issuer.register.fee.notice' })}
        description={intl.formatMessage({ id: 'pages.assets.issuer.register.fee.description' }, { fee: '100 DDN' })}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        name="register_issuer_form"
      >
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'pages.assets.issuer.name' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.issuer.name.required' }),
            },
            {
              pattern: /^[A-Za-z0-9]{3,16}$/,
              message: intl.formatMessage({ id: 'pages.assets.issuer.name.format' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.assets.issuer.name.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="description"
          label={intl.formatMessage({ id: 'pages.assets.issuer.description' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.issuer.description.required' }),
            },
            {
              max: 100,
              message: intl.formatMessage({ id: 'pages.assets.issuer.description.max' }),
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder={intl.formatMessage({ id: 'pages.assets.issuer.description.placeholder' })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterIssuerForm;