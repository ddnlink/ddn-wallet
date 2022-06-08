import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox, Alert } from 'antd';
import DdnJS from '@ddn/js-sdk';
import Login from '@/components/Login';
import styles from './Login.less';
import Register from './Register';

DdnJS.init('m66gcvle');

const { Wallet, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (err) return;
    const { dispatch } = this.props;
    try {
      const keyPair = DdnJS.crypto.getKeys(values.phaseKey.trim());
      const curAddress = DdnJS.crypto.generateAddress(keyPair.publicKey, 'D');

      const keyStore = {
        address: curAddress,
        phaseKey: values.phaseKey,
        publicKey: keyPair.publicKey,
      };

      console.log('curAddress', keyStore);

      dispatch({
        type: 'login/login',
        payload: {
          status: 'ok',
          type: 'account',
          currentAuthority: 'address',
          keyStore,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const { type, autoLogin } = this.state;
    // const { nethash, isMobile } = this.context
    // console.log(nethash, isMobile, this.context);
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.title}>{formatMessage({ id: 'layout.user.wallet' })}</span>
            </div>
            <div className={styles.desc}>{formatMessage({ id: 'layout.user.slogan' })}</div>
          </div>
          <div style={{ margin: '10px 0', color: '#4865FE', fontSize: '16px' }}>
            {formatMessage({ id: 'app.login.wordsLogin' })}
          </div>
          <Wallet
            name="phaseKey"
            placeholder={formatMessage({ id: 'app.login.phasekey-placeholder' })}
            style={{ backgroundColor: 'rgba(245,245,245,1)' }}
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <Register />
        </Login>
      </div>
    );
  }
}

export default LoginPage;
