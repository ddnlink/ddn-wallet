import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Alert, Steps, Typography, message } from 'antd';
import { history, useIntl, useModel } from '@umijs/max';
import { setKeyStore } from '@/utils/authority';
import DdnJS from '@ddn/js-sdk';
// import bip39 from 'bip39';
import styles from './index.less';

const { Step } = Steps;
const { Link } = Typography;

const RegisterPage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [backText, setBackText] = useState('savePhasekey');
  const [okText, setOkText] = useState('next');
  const [phaseKey, setPhaseKey] = useState('');
  const [questions, setQuestions] = useState('');
  const [answers, setAnswers] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  // Generate mnemonic on component mount
  useEffect(() => {
    const mnemonic = DdnJS.crypto.generateSecret();
    setPhaseKey(mnemonic);
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      download('phaseKey', phaseKey);
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setBackText('savePhasekey');
      setOkText('next');
      setDisabled(false);
    }
  };

  // Download mnemonic as a text file
  const download = (filename: string, text: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreate = () => {
    if (currentStep === 0) {
      // Move to validation step
      const arr = phaseKey.split(' ');
      const number = parseInt(String(Math.random() * arr.length), 10);
      const word = arr[number];
      arr.splice(number, 1, '-----');
      setCurrentStep(1);
      setBackText('back');
      setOkText('begin');
      setQuestions(arr.join(' '));
      setAnswers(word);
      setDisabled(true);
    } else if (currentStep === 1) {
      // Complete registration
      login(phaseKey);
    }
  };

  const againCreatePhaseKey = () => {
    // Generate a new random 12-word mnemonic
    const newPhaseKey = bip39.generateMnemonic();
    setPhaseKey(newPhaseKey);
  };

  // Check if the answer is correct
  const checkAnswers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === answers) {
      setDisabled(false);
    }
  };

  // Login with the mnemonic
  const login = (mnemonic: string) => {
    try {
      const keyPair = DdnJS.crypto.getKeys(mnemonic);
      const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');
      const keyStore = {
        address: curAddress,
        phaseKey: mnemonic,
        publicKey: keyPair.publicKey,
      };

      // Save keystore to local storage
      setKeyStore(keyStore);

      // Update global state
      setInitialState((s) => ({
        ...s,
        currentUser: {
          name: 'DDN User',
          address: curAddress,
          publicKey: keyPair.publicKey,
          access: 'user',
          balance: 0,
          lock_height: 0
        },
      }));

      message.success(intl.formatMessage({ id: 'pages.register.success' }));

      // Close modal and redirect to home page
      setVisible(false);
      history.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      message.error(intl.formatMessage({ id: 'pages.register.failure' }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.registerButton}>
          <Button size="large" block type="primary" onClick={showModal}>
            {intl.formatMessage({ id: 'pages.register.create-account' })}
          </Button>
          <div className={styles.loginLink}>
            <Link href="/user/login">
              {intl.formatMessage({ id: 'pages.register.login' })}
            </Link>
          </div>
        </div>

        <Modal
          title={intl.formatMessage({ id: 'pages.register.create-account' })}
          open={visible}
          onCancel={handleCancel}
          footer={[
            <Button
              key="back"
              onClick={() => {
                handleBack();
              }}
            >
              {intl.formatMessage({ id: `pages.register.${backText}` })}
            </Button>,
            <Button
              disabled={disabled}
              key="submit"
              type="primary"
              onClick={() => {
                handleCreate();
              }}
            >
              {intl.formatMessage({ id: `pages.register.${okText}` })}
            </Button>,
          ]}
          destroyOnClose
          width="800px"
        >
          <div className={styles.register}>
            <Steps
              current={currentStep}
              labelPlacement="vertical"
              style={{ padding: '10px 100px 50px' }}
            >
              <Step title={intl.formatMessage({ id: 'pages.register.step1' })} />
              <Step title={intl.formatMessage({ id: 'pages.register.step2' })} />
            </Steps>
            {currentStep === 0 && (
              <div style={{ height: '260px', fontSize: '16px' }}>
                <p>{intl.formatMessage({ id: 'pages.register.yourPhasekey' })}</p>
                <div className={styles.phaseKeyCon}>{phaseKey}</div>
                <Button
                  type="dashed"
                  onClick={againCreatePhaseKey}
                  style={{ margin: '10px 0 30px' }}
                >
                  {intl.formatMessage({ id: 'pages.register.regenerate' })}
                </Button>
                <Alert
                  showIcon
                  description={intl.formatMessage({ id: 'pages.register.info' })}
                  type="warning"
                />
              </div>
            )}
            {currentStep === 1 && (
              <div style={{ height: '260px', fontSize: '16px' }}>
                <p>{intl.formatMessage({ id: 'pages.register.validate' })}</p>
                <div className={styles.phaseKeyCon}>{questions}</div>
                <br />
                <br />
                <div>
                  <span>{intl.formatMessage({ id: 'pages.register.misswords' })} :</span>
                  <span>
                    <Input onChange={checkAnswers} className={styles.missInput} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RegisterPage;
