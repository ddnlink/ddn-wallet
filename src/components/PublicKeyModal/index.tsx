import React, { useState } from 'react';
import { Modal, Input, Button, message, Typography, Space, Tooltip, Divider } from 'antd';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import DdnJS from '@ddn/js-sdk';
import { copyToClipboard } from '@/utils/utils';

const { Text, Paragraph } = Typography;

interface PublicKeyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PublicKeyModal: React.FC<PublicKeyModalProps> = ({ visible, onClose }) => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const [phaseKey, setPhaseKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);

  // 当前用户的公钥
  const currentUserPublicKey = initialState?.currentUser?.publicKey || '';

  // 处理生成公钥
  const handleGeneratePublicKey = () => {
    if (!phaseKey.trim()) {
      message.warning(intl.formatMessage({ id: 'pages.multi.publickey.placeholder' }));
      return;
    }

    setLoading(true);
    try {
      // 使用 DDN SDK 生成密钥对
      const keyPair = DdnJS.crypto.getKeys(phaseKey.trim());
      setPublicKey(keyPair.publicKey);
      setLoading(false);
    } catch (error) {
      console.error('生成公钥失败:', error);
      message.error(intl.formatMessage({ id: 'pages.multi.publickey.error' }));
      setLoading(false);
    }
  };

  // 复制公钥
  const handleCopyPublicKey = (key: string) => {
    copyToClipboard(key);
    message.success(intl.formatMessage({ id: 'pages.multi.publickey.copied' }));
  };

  // 重置表单
  const handleReset = () => {
    setPhaseKey('');
    setPublicKey('');
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'pages.multi.publickey.title' })}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: '20px' }}>
        <Paragraph>
          <Text strong>{intl.formatMessage({ id: 'pages.multi.publickey.current' })}：</Text>
          <br />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <Text code style={{ flex: 1, wordBreak: 'break-all' }}>{currentUserPublicKey}</Text>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopyPublicKey(currentUserPublicKey)}
              style={{ marginLeft: '8px' }}
            />
          </div>
        </Paragraph>

        <Divider />

        <Paragraph>
          <Text strong>{intl.formatMessage({ id: 'pages.multi.publickey.other' })}：</Text>
          <Tooltip title={intl.formatMessage({ id: 'pages.multi.publickey.tooltip' })}>
            <InfoCircleOutlined style={{ marginLeft: '8px' }} />
          </Tooltip>
        </Paragraph>

        <Input.TextArea
          value={phaseKey}
          onChange={(e) => setPhaseKey(e.target.value)}
          placeholder={intl.formatMessage({ id: 'pages.multi.publickey.placeholder' })}
          rows={2}
          style={{ marginBottom: '16px' }}
        />

        <Space>
          <Button type="primary" onClick={handleGeneratePublicKey} loading={loading}>
            {intl.formatMessage({ id: 'pages.multi.publickey.generate' })}
          </Button>
          <Button onClick={handleReset}>{intl.formatMessage({ id: 'pages.multi.publickey.reset' })}</Button>
        </Space>

        {publicKey && (
          <div style={{ marginTop: '16px' }}>
            <Text strong>{intl.formatMessage({ id: 'pages.multi.publickey.result' })}：</Text>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
              <Text code style={{ flex: 1, wordBreak: 'break-all' }}>{publicKey}</Text>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => handleCopyPublicKey(publicKey)}
                style={{ marginLeft: '8px' }}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PublicKeyModal;
