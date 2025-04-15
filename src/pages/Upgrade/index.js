import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage } from 'umi/locale';
import styles from './style.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper
        title={
          <div>
            <Icon type="swap" theme="outlined" />
            <span style={{ marginLeft: '20px' }}>
              {formatMessage({ id: 'app.transfer.transfer-step' })}
            </span>
          </div>
        }
        tabActiveKey={location.pathname}
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title={formatMessage({ id: 'app.transfer.fill-info' })} />
              <Step title={formatMessage({ id: 'app.transfer.validate-title' })} />
              <Step title={formatMessage({ id: 'app.transfer.finished' })} />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
