import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi';
import jdenticon from 'jdenticon';
import { CopyOutlined, LockOutlined, LogoutOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Tooltip, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode';
import SelectLang from '../SelectLang';
import styles from './index.less';

const success = text => {
  message.success(text);
};

function shortName(name) {
  if (name.length > 20) {
    const prev = name.slice(0, 6);
    const suffix = name.slice(-6);
    const newName = `${prev}...${suffix}`;
    return newName;
  }
  return name;
}

export default class GlobalHeaderRight extends PureComponent {
  state = {
    visible: false,
    qrImgUrl: '',
  };

  componentWillReceiveProps(nextProps) {
    const { currentAccount } = nextProps;
    jdenticon.update('#identicon', currentAccount.address || 'address');
  }

  onAddressCopyClick = () => {
    const { currentAccount } = this.props;
    copy(currentAccount.address);
    success(formatMessage({ id: 'component.globalHeader.copySuccessful' }));
  };

  showModal = () => {
    const { currentAccount } = this.props;
    const qrUrl = currentAccount.address;
    const self = this;
    QRCode.toDataURL(qrUrl, (err, url) => {
      self.setState({
        qrImgUrl: url,
        visible: true,
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { currentAccount, onMenuClick, theme } = this.props;
    const { visible, qrImgUrl } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="lock">
          <LockOutlined />
          <FormattedMessage id="menu.account.lock" defaultMessage="lock" />
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Dropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <span className={styles.identIcon}>
              <svg id="identicon" width="40" height="40" />
            </span>
            <span className={styles.name}>
              {currentAccount.address ? shortName(currentAccount.address) : 'address'}
            </span>
          </span>
        </Dropdown>
        <span
          className={styles.action}
          title={formatMessage({ id: 'component.globalHeader.copyAddress' })}
        >
          <CopyOutlined onClick={this.onAddressCopyClick} className="iconButton" />
        </span>
        <span
          className={styles.action}
          title={formatMessage({ id: 'component.globalHeader.qrcode' })}
          onClick={this.showModal}
        >
          <QrcodeOutlined />
        </span>
        <SelectLang className={styles.action} />
        <Modal
          title={formatMessage({ id: 'component.globalHeader.qrcode' })}
          visible={visible}
          footer={false}
          onCancel={this.handleCancel}
        >
          <div style={{ textAlign: 'center' }}>
            <img id="imgQrCode" src={qrImgUrl} alt="qrImg" />
            <div>{formatMessage({ id: 'component.globalHeader.addressQRcode' })}</div>
            <div style={{ margin: '20px' }}>
              <span>{currentAccount.address ? currentAccount.address : 'address'}</span>
              <CopyOutlined onClick={this.onAddressCopyClick} style={{ marginLeft: '20px' }} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
