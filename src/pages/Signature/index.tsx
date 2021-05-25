import React from 'react';
import { Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import Verify from './Verify';
import Signature from './Signature';
import styles from './index.less';
const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

export default () => (
  <PageContainer content={<FormattedMessage id="verify.basic.description" />}>
    <div className={styles.container}>
      <div id="components-tabs-demo-card">
        <Tabs onChange={callback} type="card">
          <TabPane tab="签名信息" key="1">
            <Verify />
          </TabPane>
          <TabPane tab="验证信息" key="2">
            <Signature />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </PageContainer>
);
