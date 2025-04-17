import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, message, Spin, Modal, Input, Steps } from 'antd';
import { history, useIntl, useModel } from '@umijs/max';
import { SwapOutlined } from '@ant-design/icons';
import DdnJS from '@ddn/js-sdk';
import { createTransaction } from '@/services/api';
// import { formatAmount, parseAmount } from '@/utils/utils';
// import { TRANS_TYPES } from '@/constants';
import { getKeyStore } from '@/utils/authority';
import { decryptKeystore } from '@/utils/crypto';
import styles from './index.less';

const { Step } = Steps;

const Step2: React.FC = () => {
  const [transferData, setTransferData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    // 从 sessionStorage 获取转账数据
    const data = sessionStorage.getItem('transferData');
    if (data) {
      setTransferData(JSON.parse(data));
    } else {
      // 如果没有数据，返回第一步
      history.push('/transfer/step1');
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    // 获取密钥库
    const keyStore = getKeyStore();
    if (!keyStore) {
      message.error(intl.formatMessage({ id: 'pages.transfer.no-keystore' }));
      setLoading(false);
      return;
    }

    let secret;
    try {
      // 解密私钥
      secret = password // ? decryptKeystore(keyStore, password) : keyStore.phaseKey; // todo: 完成

      // 验证密钥是否合法
      const keyPair = DdnJS.crypto.getKeys(secret);
      const address = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');
      console.log('address............' , address);

      // 验证地址是否与当前用户地址匹配
      if (address !== initialState?.currentUser?.address) {

        message.error(intl.formatMessage({ id: 'pages.transfer.invalid-key' }));
        setLoading(false);
        return;
      }
    } catch (error) {

      message.error(intl.formatMessage({ id: 'pages.transfer.wrong-password' }) + error);
      setLoading(false);
      return;
    }

    const transaction = await DdnJS.transaction.createTransaction(
      transferData.recipient,
      transferData.amount,
      transferData.remark,
      secret
    );

    const response = await createTransaction(transaction);

    // 检查响应是否存在
    if (!response) {
      message.error(intl.formatMessage({ id: 'pages.transfer.no-response' }));
      setLoading(false);
      return;
    }

    if (response.success) {
      // 保存交易结果到 sessionStorage
      transferData.timestamp = transaction.timestamp;
      transferData.transactionId = response.transactionId;
      sessionStorage.setItem('transferResult', JSON.stringify(transferData));

      // 跳转到第三步
      history.push('/transfer/step3');
    }

    setLoading(false);
  };

  const handleBack = () => {
    history.push('/transfer/step1');
  };

  const showPasswordModal = () => {
    setPasswordVisible(true);
  };

  const handlePasswordSubmit = () => {
    setPasswordVisible(false);
    handleSubmit();
  };

  const handlePasswordCancel = () => {
    setPasswordVisible(false);
  };

  if (!transferData) {
    return <Spin />;
  }

  return (
    <div className={styles.transferPage}>
      {/* 添加装饰头部 */}
      <div className={styles.headerDecoration}>
        <div className={styles.decorationContent}>
          <div className={styles.decorationTitle}>
            {intl.formatMessage({ id: 'pages.transfer.confirm' })}
          </div>
          <SwapOutlined className={styles.decorationIcon} />
        </div>
      </div>

      <Card variant='borderless'>
        <div className={styles.title}>
          {/* {intl.formatMessage({ id: 'pages.transfer.confirm' })} */}
        </div>
        <div className={styles.stepsContainer}>
          <Steps current={1} progressDot>
            <Step title={intl.formatMessage({ id: 'pages.transfer.recipient' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.confirm' })} />
            <Step title={intl.formatMessage({ id: 'pages.transfer.success' })} />
          </Steps>
        </div>
        <div className={styles.confirmContainer}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.recipient' })}>
              {transferData.recipient}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.amount' })}>
              {transferData.amount} {transferData.token || 'DDN'}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.fee' })}>
              {transferData.fee} DDN
            </Descriptions.Item>
            {transferData.remark && (
              <Descriptions.Item label={intl.formatMessage({ id: 'pages.transfer.remark' })}>
                {transferData.remark}
              </Descriptions.Item>
            )}
            <Descriptions.Item label={intl.formatMessage({ id: 'pages.home.trans.senderId' })}>
              {initialState?.currentUser?.address}
            </Descriptions.Item>
          </Descriptions>

          <div className={styles.buttonContainer}>
            <Space size="middle">
              <Button onClick={handleBack}>
                {intl.formatMessage({ id: 'pages.transfer.back' })}
              </Button>
              <Button type="primary" onClick={showPasswordModal} loading={loading}>
                {intl.formatMessage({ id: 'pages.transfer.submit' })}
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'pages.transfer.enter-password' })}
        open={passwordVisible}
        onOk={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
      >
        <Input.Password
          placeholder={intl.formatMessage({ id: 'pages.transfer.password-placeholder' })}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Step2;
