import React from 'react';
import { Modal, Form, Input, InputNumber, Button, Alert } from 'antd';
import { useIntl } from 'umi';
import DdnJS from '@ddn/js-sdk';
import { getKeyStore } from '@/utils/authority';

interface TransferAssetFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (transaction: any) => void;
  submitting: boolean;
  asset: any;
}

const TransferAssetForm: React.FC<TransferAssetFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  submitting,
  asset,
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const keystore = getKeyStore();
      const { phaseKey } = keystore;

      // 计算精度和转账金额
      const precision = asset.precision || 0;
      let multi = 1;
      for (let i = 0; i < precision; i += 1) {
        multi *= 10;
      }
      const amount = parseInt(values.amount * multi, 10).toString();

      // 获取资产名称
      const currency = asset.currency || asset.name;

      // 构造交易数据
      const transaction = await DdnJS.aob.createTransfer(
        currency,
        amount,
        values.recipientId,
        null,
        values.message || '',
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

  // 计算可转账的最大数量
  const calculateMaxAmount = () => {
    if (!asset) return 0;

    const precision = asset.precision || 0;
    const balance = asset.balance || '0';

    return Number(balance) / Math.pow(10, precision);
  };

  const maxAmount = calculateMaxAmount();

  return (
    <Modal
      title={intl.formatMessage({ id: 'pages.assets.transfer' })}
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
        message={intl.formatMessage({ id: 'pages.assets.transfer.fee.notice' })}
        description={intl.formatMessage({ id: 'pages.assets.transfer.fee.description' }, { fee: '0.1 DDN' })}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        name="transfer_asset_form"
      >
        <Form.Item
          label={intl.formatMessage({ id: 'pages.assets.name' })}
        >
          <div>{asset?.currency || asset?.name}</div>
        </Form.Item>

        <Form.Item
          name="recipientId"
          label={intl.formatMessage({ id: 'pages.assets.transfer.recipient' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.transfer.recipient.required' }),
            },
            {
              pattern: /^D[0-9A-Za-z]{33}$/,
              message: intl.formatMessage({ id: 'pages.assets.transfer.recipient.format' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.assets.transfer.recipient.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="amount"
          label={intl.formatMessage({ id: 'pages.assets.transfer.amount' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.assets.transfer.amount.required' }),
            },
            {
              type: 'number',
              min: 0.000001,
              max: maxAmount,
              message: intl.formatMessage(
                { id: 'pages.assets.transfer.amount.range' },
                { max: maxAmount }
              ),
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            precision={asset?.precision || 0}
            placeholder={intl.formatMessage({ id: 'pages.assets.transfer.amount.placeholder' })}
          />
        </Form.Item>

        <Form.Item
          name="message"
          label={intl.formatMessage({ id: 'pages.assets.transfer.message' })}
          rules={[
            {
              max: 256,
              message: intl.formatMessage({ id: 'pages.assets.transfer.message.max' }),
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder={intl.formatMessage({ id: 'pages.assets.transfer.message.placeholder' })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferAssetForm;
