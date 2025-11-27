import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, message, Modal, Alert, Steps, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { history, useIntl, useModel } from '@umijs/max';
import { setKeyStore } from '@/utils/authority';
import styles from './index.less';
import DdnJS from '@ddn/js-sdk';

const { Step } = Steps;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  // 注册相关状态
  const [registerVisible, setRegisterVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [backText, setBackText] = useState('savePhasekey');
  const [okText, setOkText] = useState('next');
  const [phaseKey, setPhaseKey] = useState('');
  const [questions, setQuestions] = useState('');
  const [answers, setAnswers] = useState('');
  const [disabled, setDisabled] = useState(false);

  // 生成助记词
  useEffect(() => {
    if (registerVisible) {
      const mnemonic = DdnJS.crypto.generateSecret();
      setPhaseKey(mnemonic);
    }
  }, [registerVisible]);

  // 登录表单提交
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      setLoading(true);

      const phaseKey = values.phaseKey.trim();

      // 验证助记词是否有效
      // if (!validateMnemonic(phaseKey)) {
      //   message.error(intl.formatMessage({ id: 'pages.login.phasekey-error' }));
      //   setLoading(false);
      //   return;
      // }

      // 使用 DDN SDK 生成密钥对
      const keyPair = DdnJS.crypto.getKeys(phaseKey);
      const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');

      const keyStore = {
        address: curAddress,
        phaseKey: phaseKey,
        publicKey: keyPair.publicKey,
      };

      // 保存密钥对到本地存储
      setKeyStore(keyStore);

      // 更新全局状态
      await setInitialState((s) => ({
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

      message.success(intl.formatMessage({ id: 'pages.login.success' }));

      // 跳转到首页
      history.push('/');
      setLoading(false);

    } catch (error) {
      console.error('Login error:', error);
      message.error(intl.formatMessage({ id: 'pages.login.failure' }));
      setLoading(false);
    }
  };

  // 显示注册模态框
  const showRegisterModal = () => {
    setCurrentStep(0);
    setBackText('savePhasekey');
    setOkText('next');
    setDisabled(false);
    setRegisterVisible(true);
  };

  // 关闭注册模态框
  const handleRegisterCancel = () => {
    setRegisterVisible(false);
  };

  // 处理返回/保存按钮
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

  // 下载助记词为文本文件
  const download = (filename: string, text: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 处理创建/下一步按钮
  const handleCreate = () => {
    if (currentStep === 0) {
      // 移动到验证步骤
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
      // 完成注册
      registerAccount(phaseKey);
    }
  };

  // 重新生成助记词
  const againCreatePhaseKey = () => {
    const newPhaseKey = DdnJS.crypto.generateSecret();
    setPhaseKey(newPhaseKey);
  };

  // 检查答案是否正确
  const checkAnswers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === answers) {
      setDisabled(false);
    }
  };

  // 使用助记词注册账户
  const registerAccount = (mnemonic: string) => {
    try {
      const keyPair = DdnJS.crypto.getKeys(mnemonic);
      const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');
      const keyStore = {
        address: curAddress,
        phaseKey: mnemonic,
        publicKey: keyPair.publicKey,
      };

      // 保存密钥对到本地存储
      setKeyStore(keyStore);

      // 更新全局状态
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

      // 关闭模态框并跳转到首页
      setRegisterVisible(false);
      history.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      message.error(intl.formatMessage({ id: 'pages.register.failure' }));
    }
  };

  return (
    <div className={styles.main}>
      {/* 装饰元素 */}
      <div className={styles.decorationCircle1}></div>
      <div className={styles.decorationCircle2}></div>
      <div className={styles.decorationDot1}></div>
      <div className={styles.decorationDot2}></div>
      <div className={styles.decorationDot3}></div>
      <div className={styles.decorationLine1}></div>
      <div className={styles.decorationLine2}></div>
      <div className={styles.loginContainer}>
        <div className={styles.top}>
          <div className={styles.header}>
            <span className={styles.title}>{intl.formatMessage({ id: 'pages.login.title' })}</span>
          </div>
          <div className={styles.desc}>{intl.formatMessage({ id: 'pages.login.subtitle' })}</div>
        </div>

        <Form
          name="login"
          initialValues={{ autoLogin: true }}
          onFinish={handleSubmit}
          className={styles.form}
          size="middle"
          style={{ marginBottom: 0 }}
        >
        <div className={styles.formTitle}>
          {intl.formatMessage({ id: 'pages.login.wordsLogin' })}
        </div>

        <Form.Item
          name="phaseKey"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.login.phasekey-placeholder' }),
            },
          ]}
          style={{ marginBottom: 12 }}
        >
          <Input.TextArea
            placeholder={intl.formatMessage({ id: 'pages.login.phasekey-placeholder' })}
            rows={3}
            className={styles.input}
          />
        </Form.Item>

        <Form.Item name="autoLogin" valuePropName="checked" style={{ marginBottom: 16 }}>
          <Checkbox>{intl.formatMessage({ id: 'pages.login.remember-me' })}</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.button}
          >
            {intl.formatMessage({ id: 'pages.login.login' })}
          </Button>
        </Form.Item>

        <div className={styles.footer}>
          <Button
            type="link"
            onClick={showRegisterModal}
            className={styles.registerLink}
          >
            {intl.formatMessage({ id: 'pages.register.create-account' })}
          </Button>
        </div>
      </Form>
      </div>

      {/* 注册模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.register.create-account' })}
        open={registerVisible}
        onCancel={handleRegisterCancel}
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
        width="700px"
      >
        <div className={styles.register}>
          <Steps
            current={currentStep}
            labelPlacement="vertical"
            style={{ padding: '10px 80px 30px' }}
          >
            <Step title={intl.formatMessage({ id: 'pages.register.step1' })} />
            <Step title={intl.formatMessage({ id: 'pages.register.step2' })} />
          </Steps>
          {currentStep === 0 && (
            <div style={{ height: '220px', fontSize: '16px' }}>
              <p>{intl.formatMessage({ id: 'pages.register.yourPhasekey' })}</p>
              <div className={styles.phaseKeyCon}>
                {phaseKey}
                <Tooltip title={intl.formatMessage({ id: 'pages.register.copy' })}>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(phaseKey);
                      message.success(intl.formatMessage({ id: 'pages.register.copied' }));
                    }}
                  />
                </Tooltip>
              </div>
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
                style={{ marginBottom: '20px' }}
              />
            </div>
          )}
          {currentStep === 1 && (
            <div style={{ height: '220px', fontSize: '16px' }}>
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
  );
};

export default LoginPage;
