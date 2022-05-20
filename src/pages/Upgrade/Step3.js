import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import { formatMessage } from 'umi/locale';
import styles from './style.less';

@connect(({ upgrade }) => ({
  data: upgrade.step,
}))
class Step3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    console.log(data);
    const onFinish = () => {
      router.push('/');
    };
    const information = (
      <div className={styles.information}>
        {/* <Row>
          <Col xs={24} sm={8} className={styles.label}>
            付款账户：{data.senderAddress}
          </Col>
          <Col xs={24} sm={16}>
            {data.amount}
          </Col>
        </Row> */}
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.sender-address' })}
          </Col>
          <Col xs={24} sm={16}>
            {data.receiverAddress}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.receive-address' })}
          </Col>
          <Col xs={24} sm={16}>
            {data.receiverAddress}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.transfer-amount' })}
          </Col>
          <Col xs={24} sm={16}>
            <span className={styles.money}>{data.amount}</span> DDN
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          {formatMessage({ id: 'app.transfer.transfer-in-wallet' })}
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title={formatMessage({ id: 'app.transfer.operate-success' })}
        description={formatMessage({ id: 'app.transfer.success-info' })}
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
