import React, { PureComponent } from 'react';
import { connect } from 'dva';
import bip39 from 'bip39';
import { Button, Modal, Input, Alert, Steps } from 'antd';
import { formatMessage } from 'umi/locale';
import DdnJS from '@ddn/js-sdk';
import styles from './Register.less';

const { Step } = Steps;

class Register extends PureComponent {
  state = {
    visible: false,
    currentStep: 0,
    backText: 'savePhasekey',
    okText: 'next',
    phaseKey: '',
    questions: '',
    answers: '',
    disabled: false,
  };

  componentDidMount() {
    const { props } = this;
    props.dispatch({
      type: 'assets/fetch',
    });
    const mnemonic = bip39.generateMnemonic();
    this.setState({ phaseKey: mnemonic });
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    // console.log('handleCancel')
    this.setState({ visible: false });
  };

  handleBack = () => {
    const { currentStep, phaseKey } = this.state;
    if (currentStep === 0) {
      this.download('phaseKey', phaseKey);
    } else if (currentStep === 1) {
      this.setState({ currentStep: 0, backText: 'savePhasekey', okText: 'next', disabled: false });
    }
  };

  // js实现下载txt文件
  download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  handleCreate = () => {
    const { currentStep, phaseKey } = this.state;
    if (currentStep === 0) {
      const arr = phaseKey.split(' ');
      const number = parseInt(Math.random() * arr.length, 10);
      const word = arr[number];
      arr.splice(number, 1, '-----');
      this.setState({
        currentStep: 1,
        backText: 'back',
        okText: 'begin',
        questions: arr.join(' '),
        answers: word,
        disabled: true,
      });
    } else if (currentStep === 1) {
      this.login(phaseKey);
    }
  };

  againCreatePhaseKey = () => {
    // 再一次创建一个随机12位单词组成的字符串
    const phaseKey = bip39.generateMnemonic();
    this.setState({ phaseKey });
  };

  // 检查单词是否正确
  checkAnswers = e => {
    const { answers } = this.state;
    if (e.target.value.trim() === answers) {
      this.setState({ disabled: false });
    }
  };

  // 登陆
  login = phaseKey => {
    const { dispatch } = this.props;
    const keyPair = DdnJS.crypto.getKeys(phaseKey);
    const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey);
    const keyStore = {
      address: curAddress,
      phaseKey,
      publicKey: keyPair.publicKey,
    };
    dispatch({
      type: 'login/login',
      payload: {
        status: 'ok',
        type: 'account',
        currentAuthority: 'address',
        keyStore,
      },
      callback: response => {
        console.log('response', response);
      },
    });
  };

  render() {
    const { visible, currentStep, phaseKey, questions, backText, okText, disabled } = this.state;
    return (
      <div>
        <Button size="large" block type="primary" onClick={this.showModal}>
          {formatMessage({ id: 'app.register.create-account' })}
        </Button>
        <Modal
          title={formatMessage({ id: 'app.register.create-account' })}
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.handleBack();
              }}
            >
              {formatMessage({ id: `app.register.${backText}` })}
            </Button>,
            <Button
              disabled={disabled}
              key="submit"
              type="primary"
              onClick={() => {
                this.handleCreate();
              }}
            >
              {formatMessage({ id: `app.register.${okText}` })}
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
              <Step title={formatMessage({ id: 'app.register.step1' })} />
              <Step title={formatMessage({ id: 'app.register.step2' })} />
            </Steps>
            {currentStep === 0 && (
              <div style={{ height: '260px', fontSize: '16px' }}>
                <p>{formatMessage({ id: 'app.register.yourPhasekey' })}</p>
                <div className={styles.phaseKeyCon}>{phaseKey}</div>
                <Button
                  type="dashed"
                  onClick={this.againCreatePhaseKey}
                  style={{ margin: '10px 0 30px' }}
                >
                  {formatMessage({ id: 'app.register.regenerate' })}
                </Button>
                <Alert
                  showIcon
                  description={formatMessage({ id: 'app.register.info' })}
                  type="warning"
                />
              </div>
            )}
            {currentStep === 1 && (
              <div style={{ height: '260px', fontSize: '16px' }}>
                <p>{formatMessage({ id: 'app.register.validate' })}</p>
                <div className={styles.phaseKeyCon}>{questions}</div>
                <br />
                <br />
                <div>
                  <span>{formatMessage({ id: 'app.register.misswords' })} :</span>
                  <span>
                    <Input onChange={this.checkAnswers} className={styles.missInput} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))(Register);
