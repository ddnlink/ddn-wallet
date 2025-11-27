import React from 'react';
import { Card, Typography } from 'antd';
import { Outlet } from '@umijs/max';
import styles from './index.less';

const { Text } = Typography;

const UserLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <Card 
        style={{
          width: "62.5%", 
          minWidth: "1080px", 
          margin: "0px auto", 
          marginTop: "120px",
          padding: '0', 
          borderRadius: '20px'
        }}
      >
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.leftimg} />
          </div>
          <div className={styles.right}>
            <Outlet />
          </div>
        </div>
      </Card>
      <div className={styles.footer}>
        <Text type="secondary">Copyright © {new Date().getFullYear()} Powered by DDN FOUNDATION</Text>
      </div>
    </div>
  );
};

export default UserLayout;
