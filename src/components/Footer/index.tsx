import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { GithubOutlined, TwitterOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from './index.less';

const { Footer } = Layout;
const { Link } = Typography;

const AppFooter: React.FC = () => {
  const intl = useIntl();

  return (
    <Footer className={styles.footer}>
      <div className={styles.links}>
        <Space split="|">
          <Link href="https://github.com/ddnlink" target="_blank">
            <GithubOutlined /> GitHub
          </Link>
          <Link href="https://twitter.com/DDN_link" target="_blank">
            <TwitterOutlined /> Twitter
          </Link>
          <Link href="https://ddn.link" target="_blank">
            DDN Website
          </Link>
          <Link href="https://docs.ddn.link" target="_blank">
            Documentation
          </Link>
          <Link href="/terms" target="_blank">
            {intl.formatMessage({ id: 'component.footer.terms' })}
          </Link>
          <Link href="/privacy" target="_blank">
            {intl.formatMessage({ id: 'component.footer.privacy' })}
          </Link>
        </Space>
      </div>
      <div className={styles.copyright}>
        <Typography>
          {intl.formatMessage({ id: 'component.footer.copyright' }) || 'Copyright © 2025 Powered by DDN FOUNDATION'}
        </Typography>
      </div>
    </Footer>
  );
};

export default AppFooter;
