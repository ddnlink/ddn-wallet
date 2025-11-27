import React, { useCallback, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Button, Badge, Modal, message, Tooltip } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, GlobalOutlined, NodeIndexOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons';
import { history, useIntl, setLocale, getLocale, useModel } from '@umijs/max';
import { NETWORKS, STORAGE_KEYS } from '@/constants';
import { formatAddress, copyToClipboard } from '@/utils/utils';
import QRCode from 'qrcode';
import styles from './index.less';
const { Header } = Layout;

interface HeaderProps {
  initialState: any;
  setInitialState: (state: any) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ initialState, setInitialState }) => {
  const intl = useIntl();
  const currentLocale = getLocale();
  const { network, updateNetwork } = useModel('global');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.KEY_STORE);
    setInitialState({ ...initialState, currentUser: undefined });
    message.success(intl.formatMessage({ id: 'component.header.logoutSuccess' }));
    history.push('/user/login');
  }, [initialState, setInitialState, intl]);

  const handleLocaleChange = useCallback((locale: string) => {
    setLocale(locale, false);
  }, []);

  const handleNetworkChange = useCallback((net: string) => {
    updateNetwork(net);
  }, [updateNetwork]);

  const handleCopyAddress = useCallback(() => {
    if (initialState?.currentUser?.address) {
      copyToClipboard(initialState.currentUser.address);
      message.success(intl.formatMessage({ id: 'component.header.copySuccess' }));
    }
  }, [initialState, intl]);

  const showQrCode = useCallback(() => {
    if (initialState?.currentUser?.address) {
      QRCode.toDataURL(initialState.currentUser.address, (err, url) => {
        if (err) {
          console.error('Failed to generate QR code', err);
          return;
        }
        setQrCodeUrl(url);
        setQrModalVisible(true);
      });
    }
  }, [initialState]);

  const userMenu = {
    items: [
      {
        key: 'account',
        icon: <UserOutlined />,
        label: intl.formatMessage({ id: 'component.header.account' }),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: intl.formatMessage({ id: 'component.header.settings' }),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: intl.formatMessage({ id: 'component.header.logout' }),
        onClick: handleLogout,
      },
    ],
  };

  const localeMenu = {
    items: [
      {
        key: 'zh-CN',
        label: '中文',
        onClick: () => handleLocaleChange('zh-CN'),
      },
      {
        key: 'en-US',
        label: 'English',
        onClick: () => handleLocaleChange('en-US'),
      },
    ],
  };

  const networkMenu = {
    items: [
      {
        key: 'mainnet',
        label: '主网',
        onClick: () => handleNetworkChange(NETWORKS.MAINNET),
      },
      {
        key: 'testnet',
        label: '测试网',
        onClick: () => handleNetworkChange(NETWORKS.TESTNET),
      },
    ],
  };

  return (
    <Header className={styles.header}>
      <div className={styles.right}>
        <Space>
          <Dropdown menu={{ items: networkMenu.items }} placement="bottomRight">
            <Button type="text" icon={<NodeIndexOutlined />}>
              <Badge status={network === NETWORKS.MAINNET ? 'success' : 'warning'} text={network === NETWORKS.MAINNET ? '主网' : '测试网'} />
            </Button>
          </Dropdown>
          <Dropdown menu={{ items: localeMenu.items }} placement="bottomRight">
            <Button type="text" icon={<GlobalOutlined />}>
              {currentLocale === 'zh-CN' ? '中文' : 'English'}
            </Button>
          </Dropdown>
          {initialState?.currentUser && (
            <>
              <Dropdown menu={{ items: userMenu.items }} placement="bottomRight">
                <span className={styles.action}>
                  <Avatar size="small" icon={<UserOutlined />} className={styles.avatar} />
                  <span className={styles.name}>{formatAddress(initialState.currentUser.address)}</span>
                </span>
              </Dropdown>
              <Tooltip title={intl.formatMessage({ id: 'component.header.copyAddress' })}>
                <Button type="text" icon={<CopyOutlined />} onClick={handleCopyAddress} />
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'component.header.showQrCode' })}>
                <Button type="text" icon={<QrcodeOutlined />} onClick={showQrCode} />
              </Tooltip>
            </>
          )}
        </Space>
      </div>

      <Modal
        title={intl.formatMessage({ id: 'component.header.addressQrCode' })}
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={null}
      >
        <div className={styles.qrCodeContainer}>
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className={styles.qrCode} />}
          <div className={styles.addressInfo}>
            <p>{initialState?.currentUser?.address}</p>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyAddress}
            >
              {intl.formatMessage({ id: 'component.header.copy' })}
            </Button>
          </div>
        </div>
      </Modal>
    </Header>
  );
};

export default AppHeader;
